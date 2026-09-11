#!/bin/bash
#
# The day's scans, as one job.
#
#   scripts/bugscan/daily.sh [--scan-only|--dry-run]
#
# One account, one probe, one mail. Each repository used to be its own cron
# entry, which meant an account-level failure — an expired login, an exhausted
# quota — arrived once per repository: the same fact twice, the second copy
# telling you nothing the first had not (2026-09-09, and Steven was right to
# say so).
#
# Run by a LaunchAgent rather than cron, and that is not a preference. The
# CLI's credentials live in the login keychain; cron runs in a background
# context that cannot reach it, so every scan died at "Not logged in" while
# `claude` worked perfectly in a terminal. A LaunchAgent runs in the user's
# own session, where the keychain is unlocked.
set -uo pipefail

CONF="${BUGSCAN_ENV:-$HOME/.config/publicai/bugscan.env}"
[ -f "$CONF" ] && { set -a; . "$CONF"; set +a; }
export PATH="${BUGSCAN_PATH:-$HOME/.local/node/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin}"

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
. "$SELF_DIR/lib.sh"
NOTIFY="$SELF_DIR/notify.sh"

REPOS="${BUGSCAN_REPOS:-$HOME/homepage $HOME/publicai-index}"
MODELS="${BUGSCAN_MODELS:-claude-fable-5-1 claude-opus-5}"
STATE="${BUGSCAN_DAILY_STATE:-$HOME/.local/state/bugscan}"
mkdir -p "$STATE"
LOG="$STATE/daily-$(date +%F).log"
log() { printf '%s  %s\n' "$(date '+%H:%M:%S')" "$*" | tee -a "$LOG"; }

log "═══ 今天的扫描 ═══"

if pick_model "$MODELS" "$STATE"; then
  log "模型 $PICKED_MODEL"
else
  log "没有可用的模型: $PICK_REASON"
  { pick_diagnosis "$PICK_REASON"
    printf '\n\n两个仓今天都没扫(%s)。\n\n试过:%s\n原话:%s\n日志:%s\n' \
      "$REPOS" "$MODELS" "$PICK_REASON" "$LOG"
  } | "$NOTIFY" "【bugscan】今天两个仓都没扫成" >>"$LOG" 2>&1
  exit 1
fi

export BUGSCAN_MODEL="$PICKED_MODEL"

# Every repository's run writes what a person needs to hear into one digest,
# and it goes out once, at the end — or not at all, when nothing needed a
# person. Before this each run (and the fix session inside it) mailed on its
# own, and a day with two repositories and one rolled-back batch was four
# mails about two facts.
DIGEST="$STATE/daily-$(date +%F).digest.md"
rm -f "$DIGEST" "$DIGEST.subjects"
export BUGSCAN_DIGEST="$DIGEST"

rc=0
for repo in $REPOS; do
  log "── $(basename "$repo")"
  BUGSCAN_REPO="$repo" "$SELF_DIR/run.sh" "$@" || rc=1
done

if [ -s "$DIGEST" ]; then
  # Subject: one clause per repository, from the section titles.
  subject=$(sed -E 's/^【bugscan\/?([^】]*)】/\1:/' "$DIGEST.subjects" \
    | awk -F: '{ n[$1]++; last[$1]=$2 } END { for (r in n) printf "%s%s %s", (c++ ? " · " : ""), r, (n[r] > 1 ? n[r] " 件" : last[r]) }')
  { cat "$DIGEST"; printf '总日志:%s\n' "$LOG"; } \
    | "$NOTIFY" "【bugscan】$subject" >>"$LOG" 2>&1
  log "已发一封:$subject"
else
  log "今天没有需要人看的事,不发信"
fi
log "═══ 完 ═══"
exit "$rc"
