#!/bin/bash
#
# 合进 main 才扫。
#
#   BUGSCAN_REPO=~/tansu-main on-merge.sh
#
# 每天全量扫一遍的代价是实打实的:一次二十分钟,而大多数日子 main 根本没动,
# 扫出来的还是昨天那份。这个脚本只在 **main 真的往前走了** 的时候才叫 run.sh,
# 并且把注意力放在这一段的改动上 —— 不是「只读这几个文件」,而是「从这几个文件
# 出发,跟着它们影响到的地方走」。两者差很多:前者会漏掉「改动本身没错,
# 但它让别处的假设不成立了」那一类,而那一类正是最贵的。
#
# 没动就安静退出。**安静退出和扫完没问题必须能分辨** —— 所以日志里两句话不一样。
set -u
CONF="${BUGSCAN_ENV:-$HOME/.config/publicai/bugscan.env}"
[ -f "$CONF" ] && { set -a; . "$CONF"; set +a; }
export PATH="${BUGSCAN_PATH:-$HOME/.local/bin:$HOME/.local/node/bin:/usr/local/bin:/usr/bin:/bin}"

REPO="${BUGSCAN_REPO:?要指定 BUGSCAN_REPO}"
SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$REPO" || { echo "进不去 $REPO" >&2; exit 1; }

label=$(basename "$REPO")
STATE="${BUGSCAN_DAILY_STATE:-$HOME/.local/state/bugscan}/$label"
mkdir -p "$STATE"
MARK="$STATE/.last-scanned"
LOG="$STATE/on-merge.log"
say() { printf '%s  %s\n' "$(date +%H:%M:%S)" "$*" >>"$LOG"; }

git fetch -q origin main 2>>"$LOG" || { say "fetch 失败"; exit 1; }
now=$(git rev-parse origin/main)
was=$(cat "$MARK" 2>/dev/null || true)

if [ "$now" = "$was" ]; then say "main 没动($(git rev-parse --short origin/main)),不扫"; exit 0; fi

# 工作区拨到那一刻。run.sh 见到非 main 会直接跳过,所以这一步也是它能跑的前提。
git switch -q main 2>>"$LOG"; git reset -q --hard origin/main 2>>"$LOG"

if [ -n "$was" ]; then
  changed=$(git diff --name-only "$was" "$now" 2>/dev/null | head -60)
  span="$(git rev-parse --short "$was")..$(git rev-parse --short "$now")"
else
  changed=''; span="第一次(没有上次扫到哪儿的记录)"
fi

if [ -n "$changed" ]; then
  export BUGSCAN_APPENDIX="## 这一轮的范围($span)

上一次扫过之后,main 上动了下面这些文件。**从它们出发**,而不是只读它们:
一个改动本身没错、却让别处的假设不成立了,是最贵的那一类,只盯着 diff 会漏掉。

$changed

仓库其余部分上一轮扫过了,除非这些改动牵连到,否则不用重读。"
  say "main 走到 $(git rev-parse --short "$now"),$(wc -l <<<"$changed" | tr -d ' ') 个文件变了,开扫"
else
  say "main 走到 $(git rev-parse --short "$now"),第一次扫,全量"
fi

BUGSCAN_REPO="$REPO" "$SELF_DIR/run.sh" "$@"
rc=$?
# **扫成了才记。** 记早了的话,一次失败的扫描会让那一段改动永远没人看过。
[ "$rc" = 0 ] && echo "$now" > "$MARK" && say "记下 $(git rev-parse --short "$now")"
exit "$rc"
