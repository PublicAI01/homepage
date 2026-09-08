#!/bin/bash
#
# Unattended daily bug scan → fix → adversarial review → push.
#
#   scripts/bugscan/run.sh [--dry-run] [--scan-only]
#
# Three Claude sessions, and the split is the point. The scanner reads and
# ranks. The fixer resumes that same session, because the reasoning that found
# the bug is the reasoning that should fix it. The reviewer is deliberately
# fresh: a reviewer holding the fixer's premises reviews nothing.
#
# Between fixer and reviewer sit gates no model can argue with — forbidden
# paths, a size ceiling, lint, typecheck, the whole test suite. A commit on
# this repository deploys to production, so those gates are the only thing
# between a model's judgement and the live site. Any of them failing rolls the
# entire batch back and mails a human; nothing is ever half-applied.
#
# Silence means clean. Mail arrives only when a human has something to decide.
set -uo pipefail

REPO="${BUGSCAN_REPO:-$HOME/homepage}"
CONF="${BUGSCAN_ENV:-$HOME/.config/publicai/bugscan.env}"
STATE="${BUGSCAN_STATE:-$HOME/.local/state/bugscan/homepage}"

[ -f "$CONF" ] && { set -a; . "$CONF"; set +a; }
export PATH="${BUGSCAN_PATH:-$HOME/.local/node/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin}"

DRY=0; SCAN_ONLY=0
for a in "$@"; do
  case "$a" in
    --dry-run)   DRY=1 ;;
    --scan-only) SCAN_ONLY=1 ;;
    *) echo "unknown flag: $a" >&2; exit 2 ;;
  esac
done

# ── Gates ────────────────────────────────────────────────────────────────────
# Machine-written data, human-decided constants, the deploy pipeline, and this
# script itself. A fix that lands here is out of scope by construction, so it
# voids the batch rather than being argued about.
FORBID_RE='^(\.github/|scripts/bugscan/|\.claude/|src/app/model-index/data/|src/app/model-index/lib/weights\.ts$|public/|\.env|\.gitignore$|package\.json$|pnpm-lock\.yaml$|next\.config)'
MAX_LINES="${BUGSCAN_MAX_LINES:-400}"
SCAN_TIMEOUT="${BUGSCAN_SCAN_TIMEOUT:-2400}"
FIX_TIMEOUT="${BUGSCAN_FIX_TIMEOUT:-3600}"
REVIEW_TIMEOUT="${BUGSCAN_REVIEW_TIMEOUT:-1800}"

mkdir -p "$STATE"
DAY=$(date +%F)
LOG="$STATE/$DAY.log"
NOTIFY="$REPO/scripts/bugscan/notify.sh"

log() { printf '%s  %s\n' "$(date '+%H:%M:%S')" "$*" | tee -a "$LOG"; }
mail_out() { "$NOTIFY" "$1" >>"$LOG" 2>&1; }

# One run at a time. A stale lock older than six hours is a crashed run, not a
# live one — six hours is longer than every timeout above put together.
LOCK="$STATE/lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +360 2>/dev/null)" ]; then
    log "清掉超过 6 小时的僵尸锁"; rm -rf "$LOCK"; mkdir "$LOCK" || exit 1
  else
    log "上一轮还在跑,本轮跳过"; exit 0
  fi
fi
trap 'rm -rf "$LOCK"' EXIT

# Wall-clock cap around a child, because macOS ships no timeout(1).
run_capped() {
  local secs=$1; shift
  "$@" & local pid=$! waited=0
  while kill -0 "$pid" 2>/dev/null; do
    if [ "$waited" -ge "$secs" ]; then
      kill -TERM "$pid" 2>/dev/null; sleep 5; kill -KILL "$pid" 2>/dev/null
      wait "$pid" 2>/dev/null; return 124
    fi
    sleep 5; waited=$((waited + 5))
  done
  wait "$pid"
}

# Claude's text answer and session id, from one headless call.
CLAUDE_TEXT=''; CLAUDE_SID=''
ask_claude() {
  local timeout=$1 out=$2; shift 2
  local raw="$STATE/.raw.json"
  run_capped "$timeout" claude --output-format json "$@" >"$raw" 2>>"$LOG"
  local rc=$?
  [ "$rc" -eq 124 ] && { log "claude 超时($timeout 秒)"; return 124; }
  [ "$rc" -ne 0 ] && { log "claude 退出码 $rc"; return "$rc"; }
  # A refused or unauthenticated call still exits 0 and still says "success";
  # is_error is the only field that tells the truth about it.
  if python3 -c '
import json, sys
sys.exit(0 if json.load(open(sys.argv[1])).get("is_error") else 1)' "$raw" 2>/dev/null; then
    log "claude 报错: $(python3 -c '
import json, sys
sys.stdout.write((json.load(open(sys.argv[1])).get("result") or "")[:200])' "$raw" 2>/dev/null)"
    return 1
  fi
  CLAUDE_TEXT=$(python3 -c '
import json, sys
d = json.load(open(sys.argv[1]))
sys.stdout.write(d.get("result") or "")' "$raw" 2>/dev/null) || return 1
  CLAUDE_SID=$(python3 -c '
import json, sys
print(json.load(open(sys.argv[1])).get("session_id") or "")' "$raw" 2>/dev/null)
  printf '%s\n' "$CLAUDE_TEXT" >"$out"
  return 0
}

cd "$REPO" || { log "进不去 $REPO"; exit 1; }

log "═══ bugscan $DAY ═══"

# ── Stage 0: the tree must be someone else's business before we start ───────
git fetch -q origin 2>>"$LOG"
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "main" ]; then
  log "当前在 $branch,不是 main,跳过"; exit 0
fi
if ! git diff --quiet || ! git diff --cached --quiet; then
  log "工作区有未提交改动,跳过(不碰你手上的活)"; exit 0
fi
git pull -q --ff-only origin main 2>>"$LOG" || { log "pull 失败,跳过"; exit 0; }
BASE=$(git rev-parse HEAD)
UNTRACKED_BEFORE="$STATE/.untracked-before"
git ls-files --others --exclude-standard | sort >"$UNTRACKED_BEFORE"
log "基线 $BASE"

rollback() {
  git checkout -q -- . 2>>"$LOG"
  git ls-files --others --exclude-standard | sort \
    | comm -13 "$UNTRACKED_BEFORE" - | while read -r f; do rm -f "$f"; done
  log "已回滚到 $BASE"
}

# ── Stage 1: scan (read-only) ───────────────────────────────────────────────
SCAN_OUT="$STATE/$DAY.scan.md"
log "阶段 1/3 扫描…"
scan_prompt="/bugscan

补充:src/app/model-index/data/index.json 与 history.json 是机器写入的快照(合计
约 1MB),不要通读它们 —— 读结构用得着的一小段就够,别把上下文烧在数据上。"

if ! ask_claude "$SCAN_TIMEOUT" "$SCAN_OUT" -p "$scan_prompt" --permission-mode plan; then
  printf '扫描阶段没跑完(超时或报错)。日志:%s\n' "$LOG" | mail_out "【bugscan】今天没扫成,需要你看一眼"
  exit 1
fi
SID="$CLAUDE_SID"

summary=$(grep -m1 -E '^SUMMARY: P0=[0-9]+ P1=[0-9]+ P2=[0-9]+' "$SCAN_OUT")
if [ -z "$summary" ]; then
  log "没拿到 SUMMARY 行,判为无产物"
  { echo "扫描没有产出合规的 SUMMARY 行 —— 多半是 .claude/bugscan.md 缺失,或模型跑偏了。"; \
    echo; head -60 "$SCAN_OUT"; } | mail_out "【bugscan】今天扫描无产物,需要你看一眼"
  exit 1
fi
P0=$(sed -E 's/.*P0=([0-9]+).*/\1/' <<<"$summary")
P1=$(sed -E 's/.*P1=([0-9]+).*/\1/' <<<"$summary")
P2=$(sed -E 's/.*P2=([0-9]+).*/\1/' <<<"$summary")
log "$summary   session=$SID"

if [ "$SCAN_ONLY" = 1 ]; then log "--scan-only,到此为止 → $SCAN_OUT"; exit 0; fi
if [ $((P0 + P1)) -eq 0 ]; then
  log "没有 P0/P1(P2=$P2,报告里留着),今天不动代码"; exit 0
fi

# ── Stage 2: fix (resumes the scan session) ─────────────────────────────────
FIX_OUT="$STATE/$DAY.fix.md"
log "阶段 2/3 修复 P0=$P0 P1=$P1…"
fix_prompt="/bugfix

无人值守模式。基线 commit: $BASE。只修上一轮 /bugscan 报告里明确写了「值得修」的
P0 / P1。P2 一律不修。

**执行闸**:本仓不设资金/交易执行闸 —— 这是官网,没有下单、支付、资金转移。
但下列是**判决域**(人定的参数与产品口径,不是 bug;信心 100% 也不改,只报告 + 走邮件):
  · src/app/model-index/lib/weights.ts 里的任何常数(各榜权重、域划分、board 元数据、
    哪个源算 report ✱、SOURCE_LOGO)
  · 产品口径:榜单展示条数、导出图行数、卡片信息取舍
  · 文案、一句话定位、配色、排版

**禁改路径**(脚本有同源硬闸,命中即整批作废、白干一轮):
  .github/   scripts/bugscan/   .claude/   src/app/model-index/data/
  src/app/model-index/lib/weights.ts   public/   .env*   .gitignore
  package.json   pnpm-lock.yaml   next.config.*

**规模闸**:本轮全部改动(含新增测试)合计不得超过 $MAX_LINES 行(added+deleted)。

**测试**:pnpm test(vitest,10 个测试文件)。新增回归测试必须满足「把修复回滚掉,
这个测试会失败」。改完自己跑一遍;脚本随后会独立重跑 lint / tsc / test 复核。

**不许碰 git**(add/commit/push/checkout/reset/stash)。提交由脚本在过闸并通过独立
复审后做,你一碰回滚就失效了。

**跳过项发信**:本轮所有跳过的 P0/P1 合并成一封,由你自己发:
  printf '%s' \"<正文>\" | $REPO/scripts/bugscan/notify.sh \"<标题>\"
正文主体 = 你输出末尾那段【跳过项·大白话总结】,原样复制、一字不改。发信失败只打印
一行,不要重试。"

if ! ask_claude "$FIX_TIMEOUT" "$FIX_OUT" -p "$fix_prompt" --resume "$SID" \
     --dangerously-skip-permissions; then
  rollback
  printf '修复阶段没跑完(超时或报错)。扫描结果还在:%s\n日志:%s\n' "$SCAN_OUT" "$LOG" \
    | mail_out "【bugscan】今天扫出了 P0=$P0 P1=$P1,但修复没跑完"
  exit 1
fi

fixed_line=$(grep -m1 -E '^FIXED: [0-9]+ SKIPPED: [0-9]+' "$FIX_OUT")
if [ -z "$fixed_line" ]; then
  log "没拿到 FIXED 行,判为无产物"
  rollback
  { echo "修复阶段没有产出合规的 FIXED 行,已整批回滚。"; echo; head -60 "$FIX_OUT"; } \
    | mail_out "【bugscan】修复阶段无产物,已回滚"
  exit 1
fi
NFIX=$(sed -E 's/^FIXED: ([0-9]+).*/\1/' <<<"$fixed_line")
NSKIP=$(sed -E 's/.*SKIPPED: ([0-9]+).*/\1/' <<<"$fixed_line")
log "$fixed_line"

CHANGED="$STATE/.changed"
{ git diff --name-only
  git ls-files --others --exclude-standard | comm -13 "$UNTRACKED_BEFORE" -
} | sed '/^$/d' | sort -u >"$CHANGED"

if [ ! -s "$CHANGED" ]; then
  # No diff and nothing claimed fixed is the ordinary quiet outcome; the fix
  # session mails its own skipped items, so there is nothing to add here.
  log "没有代码改动(FIXED=$NFIX SKIPPED=$NSKIP)"
  [ "$NFIX" -gt 0 ] && log "注意:自称修了 $NFIX 条却没有 diff —— 已当作 0 条处理"
  exit 0
fi
log "改动文件:"; sed 's/^/  /' "$CHANGED" | tee -a "$LOG"

# ── Mechanical gates ────────────────────────────────────────────────────────
fail_batch() {
  local gate=$1 why=$2
  rollback
  { echo "$why"; echo; echo "已整批回滚,线上没有任何改动。"; echo
    echo "修复方自述:"; sed -n '1,80p' "$FIX_OUT"; echo
    echo "扫描报告:$SCAN_OUT"; echo "日志:$LOG"; } \
    | mail_out "【bugscan】$gate,已回滚"
  exit 1
}

hits=$(grep -E "$FORBID_RE" "$CHANGED" || true)
[ -n "$hits" ] && fail_batch "改到了不该改的文件" "命中禁改路径,整批作废:
$hits"

lines=$(git diff --numstat | awk '{a+=$1; d+=$2} END {print a+d+0}')
while IFS= read -r f; do
  git ls-files --error-unmatch "$f" >/dev/null 2>&1 \
    || lines=$((lines + $(wc -l <"$f" 2>/dev/null || echo 0)))
done <"$CHANGED"
log "改动规模 $lines 行(上限 $MAX_LINES)"
[ "$lines" -gt "$MAX_LINES" ] && fail_batch "改动太大($lines 行)" "改动 $lines 行,超过 $MAX_LINES 行的规模闸,整批作废。"

log "复核 lint / typecheck / test…"
gate_log="$STATE/$DAY.gates.log"
: >"$gate_log"
for step in "lint|pnpm lint" "类型检查|pnpm exec tsc --noEmit" "测试|pnpm test"; do
  label=${step%%|*} cmd=${step#*|}
  echo "=== $cmd ===" >>"$gate_log"
  if ! run_capped 900 $cmd >>"$gate_log" 2>&1; then
    fail_batch "$label 没过" "\`$cmd\` 没过,整批作废。最后 40 行:

$(tail -40 "$gate_log")"
  fi
  log "  ✓ $cmd"
done

# ── Stage 3: adversarial review, by a session that shares no premises ──────
REVIEW_OUT="$STATE/$DAY.review.md"
log "阶段 3/3 独立复审…"
{ git diff
  while IFS= read -r f; do
    git ls-files --error-unmatch "$f" >/dev/null 2>&1 && continue
    printf -- '--- 新文件 %s ---\n' "$f"; cat "$f"
  done <"$CHANGED"
} >"$STATE/.review-diff"
review_prompt="/bugreview

基线 commit: $BASE
仓库:publicai.io 官网。推 main 即自动构建镜像并部署到生产 —— **你放行 = 今天上线**,
你之后没有任何人会再看这份 diff。

本仓没有资金/交易路径,skill 里的「失败方向检查」在这里这样读:
  · 公开榜单的数字宁可**不显示或报错**,也不能显示一个算错的数;
  · 限流 / 输入校验 / reCAPTCHA 宁可拦错,也不能放过;
  · report ✱ 的隔离宁可过严,也不能漏进默认排名。
把任何失败路径从「拦住/报错/不显示」改成「继续/静默/沿用旧值」的,一律 FAIL。

判决域(改了就 FAIL,与修得对不对无关):weights.ts 里的权重与口径常数、榜单展示
条数、文案与配色。

--- 修复方自述(这是口供,不是证据)---
$(cat "$FIX_OUT")

--- 完整 diff ---
$(cat "$STATE/.review-diff")"

if ! ask_claude "$REVIEW_TIMEOUT" "$REVIEW_OUT" -p "$review_prompt" --permission-mode plan; then
  fail_batch "复审没跑完" "复审阶段没跑完(超时或报错)。按「复审不过 ⇒ 不放行」处理。"
fi

verdict=$(grep -m1 -E '^REVIEW: (PASS|FAIL)' "$REVIEW_OUT")
case "$verdict" in
  "REVIEW: PASS") log "复审通过" ;;
  "REVIEW: FAIL"*) fail_batch "独立复审否决了这批修复" "独立复审否决:
${verdict#REVIEW: FAIL}

复审正文:
$(sed -n '1,60p' "$REVIEW_OUT")" ;;
  *) fail_batch "复审没给出判决" "复审没给出判决行,按不放行处理。" ;;
esac

# ── Commit and ship ────────────────────────────────────────────────────────
if [ "$DRY" = 1 ]; then
  log "--dry-run:过了所有闸但不提交。diff 留在工作区。"; trap - EXIT; rm -rf "$LOCK"; exit 0
fi

git add -A --pathspec-from-file="$CHANGED" 2>>"$LOG"
git -c user.name='bugscan' -c user.email='bugscan@publicai.io' commit -q -F - <<COMMIT 2>>"$LOG"
🐛 自动修复 $NFIX 条($DAY)

$(sed -n '1,120p' "$FIX_OUT")

扫描:P0=$P0 P1=$P1 P2=$P2 · 跳过 $NSKIP · $lines 行
闸:禁改路径 / 规模 / lint / tsc / test / 独立复审 全过
COMMIT

if git push -q origin main 2>>"$LOG"; then
  NEW=$(git rev-parse --short HEAD)
  log "已推送 $NEW —— 部署会自己跑起来"
else
  log "push 失败"
  { echo "修复通过了全部闸并已在本地提交,但 push 失败了。"; echo
    echo "本地 commit: $(git rev-parse HEAD)"; echo "日志:$LOG"; } \
    | mail_out "【bugscan】修好了但推不上去,需要你处理"
  exit 1
fi
log "═══ 完 ═══"
