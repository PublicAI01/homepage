# Shared by run.sh and daily.sh. Sourced, never executed.

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

json_field() { python3 -c '
import json, sys
d = json.load(open(sys.argv[1]))
v = d.get(sys.argv[2])
sys.stdout.write("" if v is None else (v if isinstance(v, str) else json.dumps(v)))' "$1" "$2" 2>/dev/null; }

# Sets PICKED_MODEL to the first model that answers, or leaves it empty and
# puts why in PICK_REASON. Best model first; the rest are the fallbacks.
PICKED_MODEL=''; PICK_REASON=''
pick_model() {
  local models=$1 scratch=$2 m probe
  PICKED_MODEL=''; PICK_REASON=''
  for m in $models; do
    probe="$scratch/.probe.json"
    run_capped 120 claude -p 'reply with exactly: OK' --model "$m" --output-format json \
      >"$probe" 2>/dev/null
    if [ "$(json_field "$probe" is_error)" = false ]; then PICKED_MODEL=$m; return 0; fi
    PICK_REASON=$(json_field "$probe" result | head -c 200)
    [ -n "$PICK_REASON" ] || PICK_REASON="(claude 没有回话)"
  done
  return 1
}

# What a failed probe actually means. Saying "no model available" when the
# answer was "not logged in" sends someone to check their quota, which is the
# one place the problem is not (2026-09-09: it did exactly that).
pick_diagnosis() {
  case "$1" in
    *"Not logged in"*|*"/login"*|*"Invalid API key"*|*"authentication"*|*"Unauthorized"*)
      printf '本机的 claude CLI **没有登录凭据可用**。\n\n凭据存在 macOS 钥匙串里,而 cron 跑在够不着登录钥匙串的后台上下文里 —— 这跟额度无关,\n图形会话里 `claude` 是好的。修法是让任务跑在用户会话中(LaunchAgent),或者改用 API key。' ;;
    *"Credit balance"*|*"quota"*|*"rate limit"*|*"usage limit"*)
      printf '账号额度不够了,所有候选模型都拒绝服务。' ;;
    *) printf '所有候选模型都调不通。' ;;
  esac
}
