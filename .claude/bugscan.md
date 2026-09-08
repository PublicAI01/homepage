# bugscan 项目上下文 —— /bugscan 必读

## 工程一句话

publicai.io 的官网(Next.js 16 App Router + React 19 + Tailwind v4),推 main 即由
GitHub Actions 构建镜像并 SSH 部署到自有服务器,**没有数据库** —— 榜单数据是构建时
烘进镜像的 `src/app/model-index/data/index.json`。站上有真实外发副作用:联系表单走
AWS SES 发信、订阅走 Resend 写 audience。没有资金、没有交易、没有支付。

主体是 **PublicAI Index**(`/model-index`):把 15 个公开榜单归一化后加权聚合成一份
排名,对外还有 API / RSS / badge / OG 卡 / MCP 五个消费面。它唯一的资产是"数字可信"。

## 本仓高危区(优先于 skill 的通用重点)

- **聚合口径** `src/app/model-index/lib/aggregate.ts` `normalize` `query.ts`:归一化、
  加权平均、并列名次、缺测量时的分母。这里算错**不会报错**,只会安静地把一份错的公开
  排名发出去 —— 本仓最怕的就是这一类。
- **report ✱ 隔离**:标了 ✱ 的来源(博客式、非第一方常设榜)默认**不得**进入排名与
  覆盖度统计,只在用户显式打开时出现。混进去 = 产品信誉直接归零。
- **作用域与"未列入"语义** `rankedInScope` / 覆盖度计数:"这个模型在这个域没被任何榜单
  测过"和"测了但分低"必须永远分得开,退化成 0 分参与平均就是静默错误。
- **快照与历史** `data/index.json` `data/history.json` `lib/changes.ts`:机器写入,人不改。
  两份快照做 diff 算涨跌,日期/时区/缺失字段的边界要经得起推敲。
- **对外输入面** `model-index/badge/route.ts` `og/route.tsx` `api/route.ts` `mcp/route.ts`:
  接 query 参数并拼进 SVG / HTML / JSON。未转义拼接、未校验枚举、参数注入是重点。
- **订阅与联系表单** `model-index/api/subscribe/route.ts` `src/server/contact.ts`
  `rate-limit.ts` `recaptcha.ts`:订阅者邮箱是隐私数据,绝不能出现在响应体、日志或
  任何公开产物里。限流与 reCAPTCHA 属于"平时无害、出事才发现没保护住"的典型。
- **配置读取** `src/server/config.ts`:环境变量缺失时静默回退成"看起来能跑"比直接报错更糟。

## 判决域(是人定的参数,不是 bug —— 发现可疑只报告,不改)

- `lib/weights.ts` 里的一切:各榜权重、域的划分与命名、board 元数据、哪个源算 report ✱、
  SOURCE_LOGO。
- 产品口径:榜单展示条数、导出图行数、卡片信息取舍、文案与一句话定位。
- UI 设计决定:配色、排版、动效有无。

## 优先级补充条款

- 会让**公开榜单数字算错、而系统不报错**的 → **P0**(静默错误 + 唯一资产)。
- 让 report ✱ 漏进默认排名/覆盖度的 → **P0**。
- 订阅者邮箱或任何密钥进入响应体、日志、构建产物、仓库文件 → **P0**。
- 限流 / reCAPTCHA / 输入校验"其实没生效" → **P1**。
- 对外接口把未转义的用户输入拼进 SVG / HTML → **P1**。
- 纯前端渲染瑕疵(错位、闪烁、暗色模式对比度)→ 不是本仓的 P0/P1,最多 P2。
