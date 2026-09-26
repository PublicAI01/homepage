# refresh — the daily snapshot, run here instead of in Actions

The pipeline's own workflow refreshes the index at 06:00 UTC and does it
better: it archives every capture, mails the unknown rows, runs the
discovery sweep. Use it whenever it works.

This is the stand-in. The pipeline lives in a private repository, the
account's Actions minutes have been unpaid since 2026-09-23, and the
billing will not be fixed until next month — two refreshes were skipped
before anyone noticed the index had gone stale.

```
scripts/refresh/daily.sh              # what the LaunchAgent runs
scripts/refresh/daily.sh --dry-run    # fetch, build, gate; touch nothing
scripts/refresh/daily.sh --force      # run even if Actions is working
```

Installed as `~/Library/LaunchAgents/io.publicai.refresh.plist`, 23:00
local — the same instant as the workflow's 06:00 UTC.

**It stands down on its own.** Before doing anything it asks GitHub
whether `refresh.yml` has succeeded in the last 24 hours; if it has, the
workflow is back and this job exits. Nobody has to remember to turn it
off. It also skips while a bugscan run holds a lock on either
repository, because that job's rollback reverts whatever tree it finds.

**It ships nothing the gates refused.** Same three gates as the
workflow: the text snapshot failing leaves the site untouched and mails
a person; a generation track failing is held back alone, the text index
ships, and one notice says which.

State and logs: `~/.local/state/publicai-refresh/`.

## watchdog.sh

`daily.sh` 会在刷新跑挂时发信。**没跑**是另一回事:机器关着、LaunchAgent
被卸了、launchd 没触发——这些不会发出任何声音。原来这一层由 Actions 自己的
失败通知兜着,而失踪的正是 Actions。

`watchdog.sh` 只做一件事:读线上 API 的 `generatedAt`,超过 36 小时就说话。
它挂在中午 12 点的 bugscan 上跑——那个任务不依赖刷新有没有跑成。

```
scripts/refresh/watchdog.sh [--hours 36]
```

有 `BUGSCAN_DIGEST` 时写进当天的摘要(一天还是一封信),没有时自己发一封。
三次取不到才报"取不到",一次超时算网络不算陈旧。
