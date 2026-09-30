#!/bin/bash
#
# 把攒下来的那一摞,每天发成一封。
#
#   BUGSCAN_REPO=~/tansu-main flush-digest.sh
#
# ── 为什么要拆成「扫」和「发」两件事 ──────────────────────────────────────
#
# `on-merge.sh` 按 main 的移动扫,时间不固定;而 `run.sh` 独立跑的时候是**扫完
# 立刻发**。2026-09-28 那天 main 连着动,扫了 11 轮,于是一天四封信。用户的原话:
# 「一天给我发三四封邮件很烦,每天不是只跑一次吗」。
#
# 所以改成:扫的时候只往 digest 里追加(`BUGSCAN_DIGEST`,run.sh 本来就支持),
# 由这个脚本每天下午两点发一封**总结性质的**出去。
#
# ── 没事就不发,但「自己坏了」要发 ───────────────────────────────────────
#
# 第一版是没内容也发一行报平安,理由是「今天没事」和「这套东西坏了」在收件箱里
# 长得一样。2026-09-29 用户看到那封「扫了 0 轮」之后说:没有就别发。
#
# 他是对的 —— 一封「今天 0 轮 0 回滚」对人没有任何用处,而**没用的信会训练人
# 不看这个发件人**,那比少一条通知贵得多。
#
# 但那个担心本身还成立,所以换一个更准的判据:不是「有没有事」,而是
# **「有活没干成」** —— main 往前走了,却两天都没扫成。那是故障,不是清静。
# main 本来就没动的时候不吭声,才是对的安静。
set -u
CONF="${BUGSCAN_ENV:-$HOME/.config/publicai/bugscan.env}"
[ -f "$CONF" ] && { set -a; . "$CONF"; set +a; }
export PATH="${BUGSCAN_PATH:-$HOME/.local/bin:$HOME/.local/node/bin:/usr/local/bin:/usr/bin:/bin}"

REPO="${BUGSCAN_REPO:?要指定 BUGSCAN_REPO}"
SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
NOTIFY="$SELF_DIR/notify.sh"
# **按 profile 里的 label 找,不是按目录名。** 这套东西有两个状态目录:
# basename 那个(tansu-main/)放 on-merge 自己的记号,label 那个(tansu/)放
# run.sh 写的报告和日志。digest 和日志都在后者 —— 按 basename 找会永远是空的,
# 而空的结果是「今天没事」,和真的没事长得一模一样。
label=$(sed -n "s/^BUGSCAN_LABEL='\\(.*\\)'/\\1/p" "$REPO/.claude/bugscan.profile" 2>/dev/null)
label="${label:-$(basename "$REPO")}"
STATE="${BUGSCAN_DAILY_STATE:-$HOME/.local/state/bugscan}/$label"
mkdir -p "$STATE"

DIGEST="$STATE/pending.digest.md"
LOG="$STATE/$(date +%F).log"
FLUSHLOG="$STATE/flush.log"
say() { printf '%s  %s\n' "$(date +%H:%M:%S)" "$*" >>"$FLUSHLOG"; }

# 今天这一天的账。从日志里数,不从 digest 里数 —— digest 只有「要你拍板的」,
# 而「扫了几轮、有没有回滚」同样是你想知道的,它们不进 digest。
rounds=$(grep -c '═══ bugscan' "$LOG" 2>/dev/null || echo 0)
rolled=$(grep -c '已回滚到' "$LOG" 2>/dev/null || echo 0)
pushed=$(grep -c 'PR\|已推' "$LOG" 2>/dev/null || echo 0)
head_note=$(printf '今天扫了 %s 轮 · 回滚 %s 次 · 日志 %s\n' "$rounds" "$rolled" "$LOG")

if [ -s "$DIGEST" ]; then
  subject=$(sed -E 's/^【bugscan\/?([^】]*)】/\1:/' "$DIGEST.subjects" 2>/dev/null \
    | awk -F: '{ n++ } END { printf "%d 件要你看", n }')
  { printf '%s\n\n' "$head_note"; cat "$DIGEST"; } \
    | "$NOTIFY" "【bugscan/$label】$subject" >>"$FLUSHLOG" 2>&1
  say "已发一封:$subject"
  rm -f "$DIGEST" "$DIGEST.subjects"
else
  # 没有要拍板的事。默认闭嘴 —— 除非这套东西自己卡住了。
  #
  # 「卡住」= main 已经往前走了(有活),而最近一次扫成距今超过 STUCK_AFTER。
  # 两个条件缺一不可:只看时间的话,main 几天没动也会误报;只看 SHA 的话,
  # 刚合完还没到扫描窗口也会误报。
  STUCK_AFTER="${BUGSCAN_STUCK_AFTER_SECONDS:-172800}"   # 48 小时
  BASE_STATE="${BUGSCAN_DAILY_STATE:-$HOME/.local/state/bugscan}/$(basename "$REPO")"
  # 取不到远端也算「有活」:连着两天 fetch 不成,本身就是这套东西没在工作。
  # 默默当没事的话,一个坏掉的 remote 可以永远不被发现 —— 而那正是这封信要防的。
  pending=1; why_pending='取不到 origin/main'
  if git -C "$REPO" fetch -q origin main 2>/dev/null; then
    now_sha=$(git -C "$REPO" rev-parse origin/main 2>/dev/null || echo '')
    mark=$(cat "$BASE_STATE/.last-scanned" 2>/dev/null || echo '')
    if [ -n "$now_sha" ] && [ "$now_sha" != "$mark" ]; then
      why_pending="main 走到 $(git -C "$REPO" rev-parse --short origin/main)"
    else
      pending=0
    fi
  fi
  last_at=$(cat "$BASE_STATE/.last-scanned-at" 2>/dev/null || echo 0)
  age=$(( $(date +%s) - last_at ))

  if [ "$pending" = 1 ] && [ "$age" -gt "$STUCK_AFTER" ]; then
    { printf '%s\n\n' "$head_note"
      printf '%s,而最近一次扫成是 %s 小时以前 —— 这一段没人看过。\n\n' \
        "$why_pending" "$((age/3600))"
      printf '这封信不是「发现了 bug」,是**这套东西自己没跑起来**:\n'
      printf '  · agent 还在吗   launchctl list | grep bugscan\n'
      printf '  · 它说了什么     %s\n' "$BASE_STATE/on-merge.log"
      printf '  · 扫描日志       %s\n' "$LOG"
    } | "$NOTIFY" "【bugscan/$label】两天没扫成,而 main 往前走了" >>"$FLUSHLOG" 2>&1
    say "卡住了(有活 $((age/3600))h 没扫成),发了一封"
  else
    say "没内容,不发信($rounds 轮;待扫=$pending,距上次扫成 $((age/3600))h)"
  fi
fi
