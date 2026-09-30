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
# 上一次**真的扫了**是什么时候(秒)。见下面 MIN_GAP。
WHEN="$STATE/.last-scanned-at"
#
# ── 两次扫描之间的最小间隔 ────────────────────────────────────────────────
#
# 「main 动了就扫」听起来对,但 main 一天能动很多次(几个 PR 连着合),而这个
# 管道**每扫一次就发一封信**。2026-09-28 实测:那天扫了 11 轮。用户的原话是
# 「一天给我发三四封邮件很烦,每天不是只跑一次吗」——「一天一次」正是他要的心智。
#
# 所以保留「按 main 的移动扫」,但加一道闸:离上次扫不到 MIN_GAP 就先不扫。
# **这不会漏掉任何改动** —— 下一轮的范围是从 `.last-scanned` 那个 SHA 起算的,
# 中间合进来的东西都在里面。少的是重复的信和重复的模型调用,不是覆盖。
#
# 默认 20 小时:比一天略短,这样「每天那一次」不会因为前一天跑得晚而被越推越晚。
MIN_GAP="${BUGSCAN_MIN_GAP_SECONDS:-72000}"
LOG="$STATE/on-merge.log"
say() { printf '%s  %s\n' "$(date +%H:%M:%S)" "$*" >>"$LOG"; }

git fetch -q origin main 2>>"$LOG" || { say "fetch 失败"; exit 1; }
now=$(git rev-parse origin/main)
was=$(cat "$MARK" 2>/dev/null || true)

if [ "$now" = "$was" ]; then say "main 没动($(git rev-parse --short origin/main)),不扫"; exit 0; fi

# main 动了,但离上次扫太近 —— 等下一个窗口。**这三种「不扫」在日志里各说各的**:
# 没动 / 太近 / 扫完了没问题。混成一句的话,查起来分不出是哪一种。
last_at=$(cat "$WHEN" 2>/dev/null || echo 0)
gap=$(( $(date +%s) - last_at ))
if [ "$last_at" != 0 ] && [ "$gap" -lt "$MIN_GAP" ]; then
  say "main 走到 $(git rev-parse --short "$now"),但离上次扫只有 $((gap/3600))h(闸是 $((MIN_GAP/3600))h),先不扫"
  exit 0
fi

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

# **扫完不发信,只往 digest 里追加。**
#
# `run.sh` 独立跑的时候是扫完立刻发(见它里面的 mail_out);设了 BUGSCAN_DIGEST
# 之后它改成追加,由别人统一发。这里的「别人」是 flush-digest.sh,每天 14:00 一封。
# 2026-09-28 之前没这一步:main 连着动的那天扫了 11 轮,收件箱里就是 11 次打扰。
# **放 label 目录,不是这里。** 这套东西有两个状态目录,别混:
#   $STATE(= basename,tansu-main/)  这个脚本自己的记号:.last-scanned 之类
#   LABEL_STATE(= profile 里的 BUGSCAN_LABEL,tansu/)  run.sh 写的扫描报告、日志
# digest 是人要读的,跟报告放一起。
LABEL=$(sed -n "s/^BUGSCAN_LABEL='\\(.*\\)'/\\1/p" "$REPO/.claude/bugscan.profile" 2>/dev/null)
LABEL_STATE="${BUGSCAN_DAILY_STATE:-$HOME/.local/state/bugscan}/${LABEL:-$label}"
mkdir -p "$LABEL_STATE"
export BUGSCAN_DIGEST="$LABEL_STATE/pending.digest.md"
started=$(date +%s)
BUGSCAN_REPO="$REPO" "$SELF_DIR/run.sh" "$@"
rc=$?
# **扫成了才记。** 记早了的话,一次失败的扫描会让那一段改动永远没人看过。
#
# 但「扫成了」不等于 `run.sh` 退出 0 —— 这是 2026-09-28 的事故:
# 修复批次没过闸被整批回滚时,run.sh 退出 1(见它里面 319/328/381 那几处),
# 而**回滚是正常结局**,不是扫描失败。原来这里写的是 `[ "$rc" = 0 ]`,于是记号
# 永远不前进,下一个小时又判定「main 动了」,再扫一遍 —— **通宵每 1.3 小时一轮,
# 一天 11 封信**。每轮都回滚到同一个基线,就是这个循环的指纹。
#
# 所以判据换成「这一轮**有没有产出扫描报告**」:报告在,就说明扫描那一段跑完了,
# 修复被不被回滚是另一回事。退出码照旧往外传,给调用者看。
scan_out="$LABEL_STATE/$(date +%F).scan.md"
if [ -f "$scan_out" ] && [ "$(stat -f %m "$scan_out" 2>/dev/null || echo 0)" -ge "$started" ]; then
  echo "$now" > "$MARK"; date +%s > "$WHEN"
  say "扫完了(退出码 $rc,回滚与否不影响)—— 记下 $(git rev-parse --short "$now")"
else
  say "这一轮没产出扫描报告(退出码 $rc),记号不前进,下次重扫这一段"
fi
exit "$rc"
