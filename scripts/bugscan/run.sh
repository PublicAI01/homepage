#!/bin/bash
#
# Unattended daily bug scan → fix → adversarial review → push.
#
#   scripts/bugscan/run.sh [--dry-run] [--scan-only]
#   BUGSCAN_REPO=~/publicai-index scripts/bugscan/run.sh
#
# Three Claude sessions, and the split is the point. The scanner reads and
# ranks. The fixer resumes that same session, because the reasoning that found
# the bug is the reasoning that should fix it. The reviewer is deliberately
# fresh: a reviewer holding the fixer's premises reviews nothing.
#
# Between fixer and reviewer sit gates no model can argue with — forbidden
# paths, a size ceiling, and whatever the repository's own checks are. Any of
# them failing rolls the entire batch back and mails a human; nothing is ever
# half-applied.
#
# The runner is repository-agnostic on purpose. Two copies of a gate script
# would drift, and these gates are the only thing standing between a model's
# judgement and production. What differs per repository — forbidden paths,
# which constants are human decisions, how "fail safe" reads there — lives in
# that repository's own .claude/bugscan.profile, next to the .claude/bugscan.md
# the skill reads. No profile, no run: silently scanning a repository whose
# boundaries nobody declared is worse than not scanning it.
#
# Silence means clean. Mail arrives only when a human has something to decide.
set -uo pipefail

REPO="${BUGSCAN_REPO:-$HOME/homepage}"
CONF="${BUGSCAN_ENV:-$HOME/.config/publicai/bugscan.env}"

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

cd "$REPO" || { echo "进不去 $REPO" >&2; exit 1; }
REPO=$(pwd -P)

# ── The scanned repository declares its own boundaries ──────────────────────
PROFILE="$REPO/.claude/bugscan.profile"
if [ ! -f "$PROFILE" ]; then
  echo "ERROR: $REPO 没有 .claude/bugscan.profile,拒绝扫描(本仓尚未接入 bugscan)" >&2
  exit 1
fi
BUGSCAN_LABEL=''; FORBID_RE=''; FIX_NOTES=''; REVIEW_NOTES=''; GATE_STEPS=()
. "$PROFILE"
for required in BUGSCAN_LABEL FORBID_RE FIX_NOTES REVIEW_NOTES; do
  [ -n "${!required}" ] || { echo "ERROR: profile 里缺 $required" >&2; exit 1; }
done
[ "${#GATE_STEPS[@]}" -gt 0 ] || { echo "ERROR: profile 里缺 GATE_STEPS" >&2; exit 1; }

# A pattern grep cannot compile matches nothing, so an invalid FORBID_RE does
# not fail closed — it opens the gate completely and says nothing. Checked
# here, loudly, because that is exactly how it would go unnoticed.
for re_name in FORBID_RE EXEMPT_RE SIZE_EXEMPT_RE; do
  re_value=${!re_name:-}
  [ -n "$re_value" ] || continue
  if ! printf 'probe\n' | grep -qE "$re_value" 2>/dev/null; then
    if ! printf 'probe\n' | grep -E "$re_value" >/dev/null 2>&1; then
      printf 'probe\n' | grep -E "$re_value" >/dev/null 2>/tmp/.bugscan-re || true
      if [ -s /tmp/.bugscan-re ]; then
        echo "ERROR: $re_name 不是合法的 ERE,拒绝扫描 —— 非法正则会让禁改闸静默全开" >&2
        cat /tmp/.bugscan-re >&2
        exit 1
      fi
    fi
  fi
done

MAX_LINES="${MAX_LINES:-400}"
STATE="${BUGSCAN_STATE:-$HOME/.local/state/bugscan/$BUGSCAN_LABEL}"
# Best model first; the rest are what to fall back to when it is unavailable
# or out of quota. One probe up front, one model for all three stages — the
# fixer resumes the scanner's session, so switching mid-run makes the second
# half of a conversation a different mind than the first.
MODELS="${BUGSCAN_MODELS:-claude-fable-5-1 claude-opus-5}"
SCAN_TIMEOUT="${BUGSCAN_SCAN_TIMEOUT:-2400}"
FIX_TIMEOUT="${BUGSCAN_FIX_TIMEOUT:-3600}"
REVIEW_TIMEOUT="${BUGSCAN_REVIEW_TIMEOUT:-1800}"

mkdir -p "$STATE"
DAY=$(date +%F)
LOG="$STATE/$DAY.log"
SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
NOTIFY="$SELF_DIR/notify.sh"
. "$SELF_DIR/lib.sh"

log() { printf '%s  %s\n' "$(date '+%H:%M:%S')" "$*" | tee -a "$LOG"; }

# Everything a person needs to hear about today goes through here, and this
# is the only place in the whole pipeline that speaks. Under daily.sh
# (BUGSCAN_DIGEST set) it appends a section to the day's digest, which
# daily.sh sends once for every repository together; standalone it mails at
# once. It used to be three voices — this script, the fix session for its
# skipped items, and daily.sh for account failures — so a single bad day
# arrived as three or four mails saying overlapping things (2026-09-11: the
# fix session's "3 fixed, 2 for you" followed a minute later by this
# script's "rolled back", about the same batch).
mail_out() {
  local subject=$1 body; body=$(cat)
  if [ -n "${BUGSCAN_DIGEST:-}" ]; then
    printf '%s\n' "$subject" >>"$BUGSCAN_DIGEST.subjects"
    printf '## %s\n\n%s\n\n' "$subject" "$body" >>"$BUGSCAN_DIGEST"
    log "digest: $subject"
  else
    printf '%s' "$body" | "$NOTIFY" "$subject" >>"$LOG" 2>&1
  fi
}

# The fix session's own words for what it left to a person — the block it is
# told to end with.
#
# Empty when nothing was skipped: the session writes the heading every time,
# and "本轮无跳过项" under it is not something to mail about (2026-09-12).
# Empty too when everything under it has already been said: an unresolved
# judgement call used to be rewritten and mailed every morning until someone
# acted on it (see new-skips.py).
SKIPS="$STATE/skips.json"
skipped_summary() {
  [ -f "${FIX_OUT:-/nonexistent}" ] || return 0
  [ "${NSKIP:-0}" -gt 0 ] || return 0
  sed -n '/^【跳过项·大白话总结】/,$p' "$FIX_OUT" | sed '/^【已发信】/,$d' \
    | python3 "$SELF_DIR/new-skips.py" "$SKIPS"
}

# What is already with a person, for the fix session to recognise rather
# than explain again.
open_skips() {
  [ -f "$SKIPS" ] && python3 "$SELF_DIR/new-skips.py" "$SKIPS" --open 2>/dev/null
}

# One run at a time per repository. A stale lock older than six hours is a
# crashed run, not a live one — longer than every timeout above put together.
LOCK="$STATE/lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +360 2>/dev/null)" ]; then
    log "清掉超过 6 小时的僵尸锁"; rm -rf "$LOCK"; mkdir "$LOCK" || exit 1
  else
    log "上一轮还在跑,本轮跳过"; exit 0
  fi
fi
trap 'rm -rf "$LOCK"' EXIT

# Claude's text answer and session id, from one headless call.
CLAUDE_TEXT=''; CLAUDE_SID=''
ask_claude() {
  local timeout=$1 out=$2; shift 2
  local raw="$STATE/.raw.json"
  run_capped "$timeout" claude --output-format json --model "$MODEL" "$@" >"$raw" 2>>"$LOG"
  local rc=$?
  [ "$rc" -eq 124 ] && { log "claude 超时($timeout 秒)"; return 124; }
  [ "$rc" -ne 0 ] && { log "claude 退出码 $rc"; return "$rc"; }
  # A refused or unauthenticated call still exits 0 and still says "success";
  # is_error is the only field that tells the truth about it.
  if [ "$(json_field "$raw" is_error)" = true ]; then
    log "claude 报错: $(json_field "$raw" result | head -c 200)"; return 1
  fi
  CLAUDE_TEXT=$(json_field "$raw" result)
  CLAUDE_SID=$(json_field "$raw" session_id)
  printf '%s\n' "$CLAUDE_TEXT" >"$out"
  return 0
}

log "═══ bugscan $BUGSCAN_LABEL $DAY ═══"

MODEL="${BUGSCAN_MODEL:-}"
if [ -z "$MODEL" ]; then
  if pick_model "$MODELS" "$STATE"; then
    MODEL=$PICKED_MODEL
  else
    log "没有可用的模型: $PICK_REASON"
    { pick_diagnosis "$PICK_REASON"; printf '\n\n试过:%s\n原话:%s\n日志:%s\n' \
        "$MODELS" "$PICK_REASON" "$LOG"; } \
      | mail_out "【bugscan】今天没扫成:$(pick_diagnosis "$PICK_REASON" | head -1 | cut -c1-24)"
    exit 1
  fi
fi
log "模型 $MODEL"

# ── Stage 0: the tree must be someone else's business before we start ───────
git fetch -q origin 2>>"$LOG"
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "main" ]; then
  log "当前在 $branch,不是 main,跳过"; exit 0
fi
if ! git diff --quiet || ! git diff --cached --quiet; then
  log "工作区有未提交改动,跳过(不碰你手上的活)"; exit 0
fi
# A dirty tree or a side branch means someone is working here — stay quiet.
# A history that will not fast-forward is different: it does not resolve on
# its own, so every following day would skip in silence.
if ! git pull -q --ff-only origin main 2>>"$LOG"; then
  log "pull 不了(本地和 origin 分叉了),跳过"
  printf '本地的 %s 和 origin/main 分叉了,快进不了,所以今天没扫 —— 而且在有人处理之前,
以后每天都会静默跳过。

本地: %s
日志: %s
' \
    "$REPO" "$(git status -sb | head -1)" "$LOG" \
    | mail_out "【bugscan/$BUGSCAN_LABEL】本地仓分叉了,扫描停摆"
  exit 0
fi
BASE=$(git rev-parse HEAD)
UNTRACKED_BEFORE="$STATE/.untracked-before"
git ls-files --others --exclude-standard | sort >"$UNTRACKED_BEFORE"
log "基线 $BASE"

rollback() {
  # Keep what is being thrown away. A batch voided for one bad hunk had
  # four good fixes in it, and with the diff gone a person re-derived
  # them from the fixer's prose (2026-09-20). The patch is the record:
  # `git apply` it, drop the bad hunk, and the rest of the work stands.
  { git add -N . 2>>"$LOG"; git diff >"$STATE/$DAY.rejected.patch" 2>>"$LOG"
    git reset -q 2>>"$LOG"; } || true
  # Stash, never discard. The tree was someone else's business when this
  # run started (Stage 0) — but a person can start editing at 12:23 while
  # the fixer is working, and then `git checkout -- .` deletes their
  # uncommitted work with the batch. That happened on 2026-09-23: a
  # half-applied rename in the tree failed the type check, the batch was
  # voided for it, and the rollback took the rename with it. Nothing here
  # is destroyed any more; `git stash list` has it.
  if git stash push --include-untracked -q \
       -m "bugscan $BUGSCAN_LABEL $DAY rollback" 2>>"$LOG"; then
    log "已回滚到 $BASE(改动进了 git stash,没有丢)"
  else
    git checkout -q -- . 2>>"$LOG"
    git ls-files --others --exclude-standard | sort \
      | comm -13 "$UNTRACKED_BEFORE" - | while IFS= read -r f; do rm -f "$f"; done
    log "已回滚到 $BASE"
  fi
}

# ── Stage 1: scan (read-only) ───────────────────────────────────────────────
SCAN_OUT="$STATE/$DAY.scan.md"
log "阶段 1/3 扫描…"
if ! ask_claude "$SCAN_TIMEOUT" "$SCAN_OUT" -p "/bugscan" --permission-mode plan; then
  printf '扫描阶段没跑完(超时或报错)。日志:%s\n' "$LOG" \
    | mail_out "【bugscan/$BUGSCAN_LABEL】今天没扫成,需要你看一眼"
  exit 1
fi
SID="$CLAUDE_SID"

summary=$(grep -m1 -E '^SUMMARY: P0=[0-9]+ P1=[0-9]+ P2=[0-9]+' "$SCAN_OUT")
if [ -z "$summary" ]; then
  log "没拿到 SUMMARY 行,判为无产物"
  { echo "扫描没有产出合规的 SUMMARY 行 —— 多半是 .claude/bugscan.md 缺失,或模型跑偏了。"
    echo; head -60 "$SCAN_OUT"; } \
    | mail_out "【bugscan/$BUGSCAN_LABEL】今天扫描无产物,需要你看一眼"
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
gate_list=$(printf '  · %s\n' "${GATE_STEPS[@]#*|}")
fix_prompt="/bugfix

无人值守模式。基线 commit: $BASE。只修上一轮 /bugscan 报告里明确写了「值得修」的
P0 / P1。P2 一律不修。

$FIX_NOTES

**禁改路径**(脚本有同源硬闸,命中即整批作废、白干一轮),匹配这个正则:
  $FORBID_RE

**规模闸**:本轮全部改动(含新增测试)合计不得超过 $MAX_LINES 行(added+deleted)。$( [ -n "${SIZE_EXEMPT_RE:-}" ] && printf '
自动生成的回归快照不计入这个上限(匹配 %s),它按 FIX_NOTES 里那两条规矩兜住。
所以「补丁只有几行、但快照要重跑几千行」不是跳过的理由 —— 那种就直接修。' "$SIZE_EXEMPT_RE" )

**测试**:改完自己跑一遍;脚本随后会独立重跑这些复核,你说过了不算:
$gate_list
新增回归测试必须满足「把修复回滚掉,这个测试会失败」。

**不许碰 git**(add/commit/push/checkout/reset/stash)。提交由脚本在过闸并通过独立
复审后做,你一碰回滚就失效了。

**跳过项不用你发信**:外层脚本统一发,一天一封。你只要把输出末尾那段
【跳过项·大白话总结】写完整 —— 脚本会原样摘走。【已发信】一行写「由脚本统一发」。
不要调用 notify.sh,不要发任何邮件。

**每条跳过项开头写一个稳定代号** \`[skip:短横线小写名]\`,例如
\`**[skip:reports-in-rankings] 博文数字进了领域排名**\`。同一个底层问题,以后每次
都必须用同一个代号 —— 措辞可以变,代号不能变。脚本靠它认出「这条人已经知道了」,
从而不再每天重发同一件事。
$(open_skips | sed 's/^/  · /' | { grep . && printf '%s\n' '
(上面这些已经在人那里等着了 —— 代号 + 标题。今天如果又跳过其中某条,照旧用同一个代号
写出来,脚本会自己压掉、不会重复打扰人;**不要**因为它在等就绕开它,也不要换个代号重报。)'; } || true)"

if ! ask_claude "$FIX_TIMEOUT" "$FIX_OUT" -p "$fix_prompt" --resume "$SID" \
     --dangerously-skip-permissions; then
  rollback
  printf '修复阶段没跑完(超时或报错)。扫描结果还在:%s\n日志:%s\n' "$SCAN_OUT" "$LOG" \
    | mail_out "【bugscan/$BUGSCAN_LABEL】扫出了 P0=$P0 P1=$P1,但修复没跑完"
  exit 1
fi

fixed_line=$(grep -m1 -E '^FIXED: [0-9]+ SKIPPED: [0-9]+' "$FIX_OUT")
if [ -z "$fixed_line" ]; then
  log "没拿到 FIXED 行,判为无产物"
  rollback
  { echo "修复阶段没有产出合规的 FIXED 行,已整批回滚。"; echo; head -60 "$FIX_OUT"; } \
    | mail_out "【bugscan/$BUGSCAN_LABEL】修复阶段无产物,已回滚"
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
  # No diff is the ordinary quiet outcome; only what was left to a person
  # needs saying.
  log "没有代码改动(FIXED=$NFIX SKIPPED=$NSKIP)"
  [ "$NFIX" -gt 0 ] && log "注意:自称修了 $NFIX 条却没有 diff —— 已当作 0 条处理"
  skipped=$(skipped_summary)
  [ -n "$skipped" ] && { echo "$skipped"; echo; echo "修复报告:$FIX_OUT"; } \
    | mail_out "【bugscan/$BUGSCAN_LABEL】$NSKIP 处没自动修,要你拍板"
  exit 0
fi
log "改动文件:"; sed 's/^/  /' "$CHANGED" | tee -a "$LOG"

# Every change as one real unified diff, new files included. `cat`-ing an
# untracked file in would have left its lines without a leading `+`, and the
# leak check reads added lines — so a secret in a *new* file, the likeliest
# shape of all, would have been invisible to it. --no-index against /dev/null
# gives a genuine addition diff instead. (Caught 2026-09-08 by a test that
# planted a real key in a new file and watched every gate wave it through.)
FULL_DIFF="$STATE/.review-diff"
{ git diff
  while IFS= read -r f; do
    git ls-files --error-unmatch "$f" >/dev/null 2>&1 && continue
    git diff --no-index -- /dev/null "$f" || true
  done <"$CHANGED"
} >"$FULL_DIFF"

# ── Mechanical gates ────────────────────────────────────────────────────────
fail_batch() {
  local gate=$1 why=$2
  rollback
  { echo "$why"; echo; echo "已整批回滚,$BUGSCAN_LABEL 没有任何改动。"; echo
    skipped=$(skipped_summary)
    [ -n "$skipped" ] && { echo "$skipped"; echo; }
    echo "修复方自述:"; sed -n '1,80p' "$FIX_OUT"; echo
    echo "被回滚的补丁:$STATE/$DAY.rejected.patch(去掉出问题的那块,其余可以 git apply)"
    echo "也在 git stash 里(git stash list),什么都没有丢。"
    echo
    echo "如果你当时正好在这个仓里改东西:那些改动会混进上面的 diff,而且很可能"
    echo "就是这批没过闸的原因 —— 这一轮的判决不作数。锁在 $LOCK,扫描期间"
    echo "最好别动这个仓。"
    echo "扫描报告:$SCAN_OUT"; echo "日志:$LOG"; } \
    | mail_out "【bugscan/$BUGSCAN_LABEL】$gate,已回滚"
  exit 1
}

hits=$(grep -E "$FORBID_RE" "$CHANGED" || true)
if [ -n "$hits" ] && [ -n "${EXEMPT_RE:-}" ]; then
  hits=$(printf '%s\n' "$hits" | grep -vE "$EXEMPT_RE" || true)
fi
[ -n "$hits" ] && fail_batch "改到了不该改的文件" "命中禁改路径,整批作废:
$hits"

# A denylist leaves everything unnamed writable; on a public repository the
# safer shape is the other way round. A fix that genuinely needs a file
# outside these roots voids the batch and mails a person — which is the right
# outcome for a repository the whole world can read.
# A path EXEMPT_RE carved out of the denylist is allowed here too; the two
# gates must agree, or the exemption is a promise the whitelist breaks
# (2026-09-11: a clean batch was voided for touching the one fixture the
# profile explicitly lets it touch).
if [ -n "${ALLOW_RE:-}" ]; then
  strays=$(grep -vE "$ALLOW_RE" "$CHANGED" | grep -vE "${EXEMPT_RE:-^\$}" || true)
  [ -n "$strays" ] && fail_batch "改到了白名单以外的地方" "只允许改这些路径:$ALLOW_RE
越界的文件,整批作废:
$strays"
fi

# Last line before anything leaves the machine. See leak-check.py — the first
# check is literal against this machine's own credential files, because the
# realistic leak is a model inlining a config value to make a bug go away.
leak_out=$(python3 "$(dirname "$NOTIFY")/leak-check.py" "$FULL_DIFF" 2>&1)
if [ $? -ne 0 ]; then
  fail_batch "diff 里可能带着密钥" "$leak_out

**这批改动一行都没有离开本机。**$( [ "$(git config --get remote.origin.url)" ] && echo "
仓库: $(git config --get remote.origin.url)" )"
fi
log "  ✓ 密钥检查"

# The size gate is there to stop a runaway refactor, so it counts what a
# person would have to read. A regenerated snapshot is not that: its size
# measures the data, not the change, and a five-line parsing fix rewrites
# two thousand lines of it. Counting those turned real one-line fixes into
# mail asking a human to do them by hand (Grok 4.20 and the Grok Reasoning
# merge, 2026-09-12 and -14). Such files are named per repository in
# SIZE_EXEMPT_RE and are held to their own rules instead — a parse test
# against the raw captures, and every change explained by the stated cause.
size_of() {
  local f=$1
  if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
    git diff --numstat -- "$f" | awk '{a+=$1; d+=$2} END {print a+d+0}'
  else
    wc -l <"$f" 2>/dev/null || echo 0
  fi
}
lines=0 generated=0
while IFS= read -r f; do
  n=$(size_of "$f")
  if [ -n "${SIZE_EXEMPT_RE:-}" ] && printf '%s\n' "$f" | grep -qE "$SIZE_EXEMPT_RE"; then
    generated=$((generated + n))
  else
    lines=$((lines + n))
  fi
done <"$CHANGED"
log "改动规模 $lines 行(上限 $MAX_LINES)$( [ "$generated" -gt 0 ] && echo " + 生成物 $generated 行不计")"
[ "$lines" -gt "$MAX_LINES" ] && fail_batch "改动太大($lines 行)" \
  "改动 $lines 行(不含生成物),超过 $MAX_LINES 行的规模闸,整批作废。"

log "复核 ${#GATE_STEPS[@]} 项检查…"
gate_log="$STATE/$DAY.gates.log"
: >"$gate_log"
for step in "${GATE_STEPS[@]}"; do
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
review_prompt="/bugreview

基线 commit: $BASE

$REVIEW_NOTES

--- 修复方自述(这是口供,不是证据)---
$(cat "$FIX_OUT")

--- 完整 diff ---
$(cat "$FULL_DIFF")"

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

模型:$MODEL · 扫描:P0=$P0 P1=$P1 P2=$P2 · 跳过 $NSKIP · $lines 行
闸:禁改路径 / 规模 / ${#GATE_STEPS[@]} 项检查 / 独立复审 全过
COMMIT

if git push -q origin main 2>>"$LOG"; then
  log "已推送 $(git rev-parse --short HEAD)"
  skipped=$(skipped_summary)
  if [ -n "$skipped" ]; then
    { echo "修了 $NFIX 处,已推 $(git rev-parse --short HEAD)。$NSKIP 处没自动修,要你看:"; echo
      echo "$skipped"; echo; echo "修复报告:$FIX_OUT"; } \
      | mail_out "【bugscan/$BUGSCAN_LABEL】修了 $NFIX 处,$NSKIP 处要你拍板"
  fi
else
  log "push 失败"
  { echo "修复通过了全部闸并已在本地提交,但 push 失败了。"; echo
    echo "本地 commit: $(git rev-parse HEAD)"; echo "日志:$LOG"; } \
    | mail_out "【bugscan/$BUGSCAN_LABEL】修好了但推不上去,需要你处理"
  exit 1
fi
log "═══ 完 ═══"
