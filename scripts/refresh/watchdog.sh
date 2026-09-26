#!/bin/bash
#
# Is the published index still fresh?
#
#   scripts/refresh/watchdog.sh [--hours 36]
#
# `daily.sh` mails when a refresh runs and fails. Nothing mails when a
# refresh never runs at all: this Mac was shut, the LaunchAgent was
# unloaded, launchd never fired. That gap used to be covered by the
# workflow's own failure notice, and the workflow is the thing that went
# away — the index sat two days stale in September and the first to notice
# was a person looking at the site.
#
# So: read the date off what is actually published, and say something when
# it is older than a day and a half. Run from the noon scan, which fires
# whether or not the refresh did.
set -uo pipefail

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
NOTIFY="$SELF_DIR/../bugscan/notify.sh"
API="${INDEX_API:-https://publicai.io/model-index/api?limit=1}"
HOURS=36
[ "${1:-}" = "--hours" ] && HOURS="$2"

say() {
  # One mail a day either way: inside the noon scan this joins that day's
  # digest, outside it goes on its own.
  if [ -n "${BUGSCAN_DIGEST:-}" ]; then
    printf '%s\n' "【bugscan/index】$1" >>"$BUGSCAN_DIGEST.subjects"
    printf '## %s\n\n%s\n\n' "【bugscan/index】$1" "$2" >>"$BUGSCAN_DIGEST"
  else
    printf '%s\n' "$2" | "$NOTIFY" "【Index】$1" >/dev/null 2>&1 || true
  fi
  echo "watchdog: $1"
}

# Three tries: one timeout at noon is the network, not a stale index.
for i in 1 2 3; do
  body=$(curl -fsS --max-time 20 "$API" 2>/dev/null) && break
  body=''
  [ "$i" -lt 3 ] && sleep 20
done

if [ -z "$body" ]; then
  say "线上榜单取不到" \
"连着三次取不到 $API(每次 20 秒超时,间隔 20 秒)。

可能是站点挂了,也可能是这台机器的网络。先打开 https://publicai.io/model-index 看一眼;
页面正常就是这台机器的事,页面也打不开就是站点的事。"
  exit 1
fi

stamp=$(printf '%s' "$body" | sed -n 's/.*"generatedAt":"\([^"]*\)".*/\1/p' | cut -d. -f1)
# BSD date reads a Z-stamp as local time unless told otherwise, which is a
# seven-hour error here and exactly the size that hides a stale day.
when=$(TZ=UTC date -j -f '%Y-%m-%dT%H:%M:%S' "${stamp%Z}" +%s 2>/dev/null || echo 0)
if [ "$when" -eq 0 ]; then
  say "线上榜单的时间戳读不出来" \
"取到了页面数据,但 generatedAt 解析不了:「$stamp」

这多半是 API 的字段变了,不是刷新出了事。"
  exit 1
fi

age=$(( ( $(date +%s) - when ) / 3600 ))
if [ "$age" -ge "$HOURS" ]; then
  say "榜单 $age 小时没更新了" \
"线上最新快照是 $(TZ=UTC date -r "$when" '+%Y-%m-%d %H:%M UTC'),距今 $age 小时,超过了 $HOURS 小时的线。

刷新那一环没跑,或者跑了没推上去。按顺序看三件事:

1. \`launchctl list | grep io.publicai.refresh\` —— 任务还在不在,上次退出码是几
2. \`tail -40 ~/.local/state/publicai-refresh/agent.log\` —— 最后一次跑到哪一步
3. 这台机器昨晚 23:00 是不是关着的

手动补一次:\`~/homepage/scripts/refresh/daily.sh\`(加 --force 可以无视 Actions 的让路判断)。"
  exit 1
fi

echo "watchdog: 榜单 $age 小时前更新过,没事"
