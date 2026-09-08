#!/bin/bash
#
# One alert out, subject as $1 and body on stdin:
#
#   printf '%s' "$body" | scripts/bugscan/notify.sh "subject"
#
# Called by run.sh and, for its own skipped-item mail, by the unattended fix
# session. Sending is the only outward action that session is allowed, so this
# never exits non-zero: a mail server having a bad day must not be able to fail
# a run that already did its work.
set -uo pipefail

subject="${1:-[bugscan] (no subject)}"
body="$(cat)"

CONF="${BUGSCAN_ENV:-$HOME/.config/publicai/bugscan.env}"
[ -f "$CONF" ] && { set -a; . "$CONF"; set +a; }

if [ -z "${RESEND_API_KEY:-}" ] || [ -z "${BUGSCAN_MAIL_TO:-}" ]; then
  echo "notify: 没有 RESEND_API_KEY / BUGSCAN_MAIL_TO,信没发出去" >&2
  exit 0
fi

payload=$(
  SUBJ="$subject" BODY="$body" \
  FROM="${BUGSCAN_MAIL_FROM:-PublicAI bugscan <bugscan@publicai.io>}" \
  TO="$BUGSCAN_MAIL_TO" python3 -c '
import json, os
print(json.dumps({
    "from": os.environ["FROM"],
    "to": [t.strip() for t in os.environ["TO"].split(",") if t.strip()],
    "subject": os.environ["SUBJ"],
    "text": os.environ["BODY"],
}))'
) || { echo "notify: 组装 payload 失败" >&2; exit 0; }

code=$(curl -sS -o /tmp/bugscan-notify.out -w '%{http_code}' \
  --max-time 30 \
  -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H 'Content-Type: application/json' \
  -d "$payload" 2>/dev/null) || code=000

if [ "$code" = "200" ]; then
  echo "notify: 已发 — $subject"
else
  echo "notify: 发送失败 HTTP $code — $(head -c 300 /tmp/bugscan-notify.out 2>/dev/null)" >&2
fi
exit 0
