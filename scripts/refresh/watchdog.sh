#!/bin/bash
#
# Is the published index still fresh — and is it still the whole index?
#
#   scripts/refresh/watchdog.sh [--hours 36]
#
# `daily.sh` and the workflow mail when a refresh runs and fails. Nothing
# mails when a refresh never runs, or when the failure mail itself breaks:
# this Mac was shut, the cron line was removed, the workflow failed four
# times and its mail step died with it (2026-10-23 to 10-25). The index sat
# two days stale in September and the first to notice was a person looking
# at the site.
#
# Testing the text: every run with a low --hours mails for real.
#
# So: read the date off what is actually published, and say something when
# it is older than a day and a half. Run from the noon scan, which fires
# whether or not the refresh did.
#
# Freshness is half the question. A refresh that runs on time and publishes
# half an index passes every check there was — see the second half below.
set -uo pipefail

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
NOTIFY="$SELF_DIR/../bugscan/notify.sh"
# Cache-busted, and asking the edge not to serve from cache either. The API
# is sent with `max-age=3600, stale-while-revalidate=86400`, so a Cloudflare
# node may keep answering with a day-old copy while it refreshes in the
# background — which is how this check mailed "37 hours" about an index that
# had been refreshed fourteen hours earlier (2026-09-27). A freshness check
# that reads a cache is checking the cache.
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
  sep='?'; case "$API" in *\?*) sep='&' ;; esac
  body=$(curl -fsS --max-time 20 -H 'Cache-Control: no-cache' -H 'Pragma: no-cache' \
    "$API${sep}_cb=$(date +%s)$i" 2>/dev/null) && break
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

刷新那一环没跑,或者跑了没推上去。主刷新在 GitHub Actions(每天两次),本机每晚 23:00 兜底。按顺序看:

1. \`gh run list -R PublicAI01/publicai-index --workflow refresh.yml -L 6\` —— Actions 最近几次成功还是失败;失败就 \`gh run view <id> --log-failed\` 看挂在哪一步
2. \`tail -20 ~/.local/state/publicai-refresh/agent.log\` —— 本机兜底跑没跑、跑到哪一步(Actions 24 小时内成功过它会让路)
3. \`crontab -l | grep refresh\` —— 兜底任务还在不在;这台机器昨晚 23:00 是不是关着的

两边都挂在同一步,多半是代码的问题(比如某个榜的解析),修代码;只有一边挂,多半是那边的环境。
手动补一次:\`~/homepage/scripts/refresh/daily.sh --force\`。"
  exit 1
fi

# ── 口径闸:数字有没有悄悄塌掉一块 ──────────────────────────────────────────
#
# 新鲜度拦不住"按时更新了一份缺了一半的"。2026-10-28 构成 Overall 的两个大榜
# 各只报了一半的行(Artificial Analysis 88→38,LiveBench 51→30),能排名的模型
# 从 65 掉到 41 —— 文件是当天新抓的、管线的三道闸全过、这个 watchdog 说"没事",
# 24 个模型静默丢了公开排名,挂了三天才被人翻快照翻出来。
#
# 读的就是上面那一次请求里的 scopeTotal(Overall 作用域下 = 能排名的模型数),
# 跟上次记下的比,不额外发请求。线划在 20%:历史上全部四次下跌是 -57.7%
# (两出版方规则收紧)、-46.0%(覆盖门槛上线)、-36.9%(这次榜缩水)、-13.6%
# (LiveBench 2.0 换代,人干的、有记录),20% 正落在后两者之间 —— 三次该响的
# 都响,换代那次不吵。规则是人改的那几次也会响一声,这是对的:那也该有人确认。
STATE="${REFRESH_STATE:-$HOME/.local/state/publicai-refresh}"
MARK="$STATE/ranked"
DROP="${INDEX_MAX_DROP:-20}"
mkdir -p "$STATE"

ranked=$(printf '%s' "$body" | tr ',' '\n' \
  | sed -n 's/^"scopeTotal":\([0-9]\{1,\}\)$/\1/p' | head -1)
if [ -z "$ranked" ]; then
  say "线上榜单的排名数读不出来" \
"取到了数据,时间戳也解析出来了,但读不出 scopeTotal —— Overall 作用域下它就是
能排名的模型数。

这多半是 API 的字段改了名,不是刷新出了事。但在它修好之前,「榜单悄悄缺了一块」
这件事没人盯着,所以这封信值得看一眼:

  curl -s '$API' | head -c 300

要是字段真改了名,把这个脚本里的 scopeTotal 跟着改。"
  exit 1
fi

prev=$(cat "$MARK" 2>/dev/null || echo '')
case "$prev" in ''|*[!0-9]*) prev='' ;; esac
# 先记下,再判。留着旧值的话,规则真的改了之后它会天天重复同一句话,而没人
# 会连着读第三天 —— 一次事件只响一声。
printf '%s\n' "$ranked" >"$MARK"

if [ -n "$prev" ] && [ "$prev" -gt 0 ]; then
  fell=$(( (prev - ranked) * 100 / prev ))
  if [ "$fell" -ge "$DROP" ]; then
    say "能排名的模型少了 $fell%($prev → $ranked)" \
"线上 Overall 能排名的模型从 $prev 个掉到 $ranked 个,跌了 $fell%,超过 $DROP% 的线。
快照本身是新的(抓于 $age 小时前),所以不是没刷新 —— 是刷出来的东西少了一块。

两种可能,先分清是哪一种。

一、某个榜这次只报了一半的行。最常见,也最容易没人发现。构成 Overall 的五个榜
各抓到多少行,数一下就知道(五个 id 依次换进去跑):

  cd ~/homepage
  grep -c '\"benchmarkId\": \"artificial-analysis\"' src/app/model-index/data/index.json

  五个 id:lmarena / artificial-analysis / livebench / terminal-bench / arc-agi-2

跟上一份快照比:

  git log --oneline -5 -- src/app/model-index/data/index.json
  git show <上一个 commit>:src/app/model-index/data/index.json | grep -c '\"benchmarkId\": \"livebench\"'

对半砍的那个就是解析挂了 —— 页面改版、换了分页、列变了。修管线仓那个 parser,
别等它自己好:在修好之前,线上的排名是缺的。

二、是人改了排名规则或权重。那这封信知悉即可,新值已经记下,下一次不会再响。"
    exit 1
  fi
fi

echo "watchdog: 榜单 $age 小时前更新过,能排名 $ranked 个(上次 ${prev:-首次}),没事"
