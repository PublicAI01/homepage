#!/bin/bash
#
# The daily index refresh, run on this machine instead of in Actions.
#
#   scripts/refresh/daily.sh [--force] [--dry-run]
#
# A stand-in, not a replacement. The pipeline's own workflow does this at
# 06:00 UTC and does it better — it archives every capture, mails the
# unknown rows, runs the discovery sweep. But its repository is private,
# and the account's Actions minutes have been unpaid since 2026-09-23;
# two refreshes were skipped before anyone noticed the index had gone
# stale, and the billing will not be fixed until next month (Steven,
# 2026-09-25). So this runs at the same hour, does the part that matters
# — fetch, build, gate, ship — and stands down on its own the moment the
# workflow starts working again.
#
# Same three gates as the workflow. Nothing reaches the homepage that
# they did not pass; a gate that fails leaves the site on yesterday's
# snapshot and mails a person, which is the same bargain the workflow
# makes.
set -uo pipefail

CONF="${BUGSCAN_ENV:-$HOME/.config/publicai/bugscan.env}"
[ -f "$CONF" ] && { set -a; . "$CONF"; set +a; }
export PATH="${BUGSCAN_PATH:-$HOME/.local/node/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin}"

PIPELINE="${REFRESH_PIPELINE:-$HOME/publicai-index}"
SITE="${REFRESH_SITE:-$HOME/homepage}"
STATE="${REFRESH_STATE:-$HOME/.local/state/publicai-refresh}"
NOTIFY="$SITE/scripts/bugscan/notify.sh"
FORCE=0; DRY=0
for a in "$@"; do
  case "$a" in
    --force) FORCE=1 ;;
    --dry-run) DRY=1 ;;
  esac
done

mkdir -p "$STATE"
DAY=$(date +%F)
LOG="$STATE/$DAY.log"
log() { printf '%s  %s\n' "$(date '+%H:%M:%S')" "$*" | tee -a "$LOG"; }
mail() { [ -x "$NOTIFY" ] && "$NOTIFY" "$1" >>"$LOG" 2>&1 || true; }

log "═══ 本地刷新 $DAY ═══"

# One run at a time. A stale lock older than three hours is a crashed run.
LOCK="$STATE/lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +180 2>/dev/null)" ]; then
    log "清掉超过 3 小时的僵尸锁"; rm -rf "$LOCK"; mkdir "$LOCK" || exit 1
  else
    log "上一轮还在跑,本轮跳过"; exit 0
  fi
fi
trap 'rm -rf "$LOCK"' EXIT

# Stand down when Actions is working again: a refresh that succeeded in
# the last 24 hours means the workflow is back and this job is noise —
# and worse than noise, because two snapshots of the same day would race.
if [ "$FORCE" -ne 1 ]; then
  last=$(cd "$PIPELINE" && gh run list --workflow refresh.yml -L 5 \
    --json conclusion,createdAt --jq \
    '[.[] | select(.conclusion=="success")] | first | .createdAt' 2>/dev/null)
  if [ -n "$last" ] && [ "$last" != "null" ]; then
    # TZ=UTC or BSD date reads the Z-stamp as local time and the answer
    # is off by the offset — seven hours here, enough to stand down on a
    # thirty-hour-old success and skip the refresh this job exists for.
    when=$(TZ=UTC date -j -f '%Y-%m-%dT%H:%M:%SZ' "$last" +%s 2>/dev/null || echo 0)
    age=$(( ( $(date +%s) - when ) / 3600 ))
    if [ "$age" -ge 0 ] && [ "$age" -lt 24 ]; then
      log "Actions 的刷新 $age 小时前成功过,本轮让路(--force 可强跑)"
      exit 0
    fi
  fi
fi

# The bugscan fixer works in the same two repositories around noon; its
# rollback reverts whatever tree it finds. Never overlap (2026-09-23).
for label in publicai-index homepage; do
  if [ -d "$HOME/.local/state/bugscan/$label/lock" ]; then
    log "bugscan 正在扫 $label,本轮跳过"; exit 0
  fi
done

die() {
  log "$1"
  { printf '%s\n\n' "$1"; printf '线上还是上一份,没有被改动。\n\n日志:%s\n' "$LOG"; } \
    | mail "【Index】本地刷新没跑成:$2"
  exit 1
}

cd "$PIPELINE" || die "进不去 $PIPELINE" "仓库不在"
git diff --quiet && git diff --cached --quiet || die "管线仓工作区有未提交改动,不敢动" "工作区不干净"
git pull -q --ff-only origin main 2>>"$LOG" || die "管线仓 pull 不动(和 origin 分叉了)" "仓库分叉"

log "抓取…"
pnpm run fetch >>"$LOG" 2>&1 || die "抓取失败,见日志" "抓取挂了"
log "构建…"
node src/cli/build.ts >>"$LOG" 2>&1 || die "构建失败,见日志" "构建挂了"

D="$SITE/src/app/model-index/data"
log "合理性闸…"
gate_out="$STATE/$DAY.gate.txt"
: >"$gate_out"
node src/cli/gate.ts out/index.json "$D/index.json" >>"$gate_out" 2>&1 \
  || { log "$(cat "$gate_out")"; die "$(cat "$gate_out")" "文字榜没过闸"; }
held=''
for t in image video; do
  node src/cli/gate.ts "out/$t.json" "$D/$t.json" --min-sources 3 >>"$gate_out" 2>&1 \
    || held="$held $t"
done
[ -n "$held" ] && log "这些 track 没过闸,保留昨天的:$held"

if [ "$DRY" -eq 1 ]; then log "--dry-run:到此为止,没有改动 $SITE"; exit 0; fi

cd "$SITE" || die "进不去 $SITE" "仓库不在"
git diff --quiet && git diff --cached --quiet || die "首页仓工作区有未提交改动,不敢动" "工作区不干净"
git pull -q --ff-only origin main 2>>"$LOG" || die "首页仓 pull 不动" "仓库分叉"

for f in index image video; do
  case " $held " in *" $f "*) continue ;; esac
  cp "$PIPELINE/out/$f.json" "$D/$f.json"
done
# Publisher marks the fetch captured, for boards nobody has picked a
# logo for. Never over a file someone put there.
for m in "$PIPELINE"/raw/marks/*; do
  [ -f "$m" ] || continue
  dest="$SITE/public/model-index/logos/$(basename "$m")"
  [ -e "$dest" ] || cp "$m" "$dest"
done

node scripts/index-history.ts >>"$LOG" 2>&1 || die "写历史失败" "历史没写成"
pnpm exec prettier --write "$D" >>"$LOG" 2>&1

if git diff --quiet -- "$D"; then
  log "快照没有变化,不提交"; exit 0
fi
git add -A >>"$LOG" 2>&1
git commit -q -m "📈 Refresh the model index snapshot

Built and gated on this machine. The pipeline runs in a private
repository whose Actions minutes are unpaid until next month; these are
the same three gates the workflow applies.${held:+

Held back at the gate, still on the previous copy:$held}

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" >>"$LOG" 2>&1 \
  || die "提交失败" "提交挂了"
git push -q origin main >>"$LOG" 2>&1 || die "推送失败" "推送挂了"
log "已推送 $(git rev-parse --short HEAD)"

[ -n "$held" ] && printf '文字榜正常更新了。\n\n这些 track 没过合理性闸,线上还是昨天的:%s\n\n%s\n\n日志:%s\n' \
  "$held" "$(grep -E '^  · ' "$gate_out" || true)" "$LOG" \
  | mail "【Index】图片/视频榜今天落后了一天"

log "═══ 完 ═══"
