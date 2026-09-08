# 每日自动 bug 扫描

每天中午 12:00,本机 cron 跑 `run.sh`:扫一遍代码,把 P0/P1 里**有把握**的直接修掉、
过闸后推上 main(推 main 即部署,所以这是直接上线);没把握的不修,发邮件给人。
P2 只记在报告里,不修。

方法论不在这个仓 —— 在 `~/claude-skills`(独立仓 `qinwang-ai/auto-bugfix`),
经 `~/.claude/skills/` 符号链接对本机所有项目可见。这里只有**本仓的闸门**。

## 三段

| 阶段 | 会话 | 权限 | 产出 |
|---|---|---|---|
| 1 扫描 `/bugscan` | 新会话 | 只读 | `SUMMARY: P0=n P1=n P2=n` |
| 2 修复 `/bugfix` | **resume 扫描那个会话** | 可写 | `FIXED: n SKIPPED: n` |
| 3 复审 `/bugreview` | **全新会话** | 只读 | `REVIEW: PASS` / `FAIL` |

第 2 段 resume,是因为找到 bug 的推理就该是修它的推理。第 3 段必须换新会话,
是因为一个带着修复方前提的复审等于没复审。

## 闸(任何一道不过 = 整批回滚,不留半成品)

1. **工作区必须干净、必须在 main** —— 否则直接跳过,不碰你手上的活
2. **禁改路径** `FORBID_RE`:`.github/` `scripts/bugscan/` `.claude/`
   `model-index/data/` `weights.ts` `public/` `.env*` `.gitignore`
   `package.json` `pnpm-lock.yaml` `next.config.*`
3. **规模闸** 400 行(added+deleted,含新增测试)
4. **lint / tsc --noEmit / vitest** —— 脚本自己重跑一遍,修复方说过了不算
5. **独立对抗复审** 判 FAIL 即回滚

判决域(`weights.ts` 里的权重与口径、榜单条数、文案配色)不是 bug,是人定的参数 ——
信心 100% 也不改,只报告 + 走邮件。清单写在 `.claude/bugscan.md`。

## 什么时候会收到邮件

- 有 P0/P1 被**跳过**(信心 <95% / 属判决域)—— 修复会话自己发,正文是大白话
- 任何一道闸拦下了整批 —— 脚本发,附修复方自述
- 扫描/修复/复审跑挂了或无产物 —— 脚本发
- **一切正常、修好推上去了 → 不发信**。安静就是没事。

## 日志与产物

`~/.local/state/bugscan/homepage/YYYY-MM-DD.{scan,fix,review}.md` 和 `.log`。
想接着人工修:`claude --resume <扫描的 session id>`(id 在当天的 `.log` 里)。

## 手动

    scripts/bugscan/run.sh --scan-only   # 只扫,不改任何东西
    scripts/bugscan/run.sh --dry-run     # 走完全部闸,过了也不提交,diff 留在工作区
    scripts/bugscan/run.sh               # 完整流程(会推)

## 关掉

    crontab -e   # 删掉那一行

## 机器侧配置

`~/.config/publicai/bugscan.env`(600,不在仓库里):Resend key、收件人、cron 用的 PATH。
