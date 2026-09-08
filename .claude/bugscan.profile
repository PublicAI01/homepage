# homepage 的扫描边界。run.sh 读这个文件;缺了就拒扫。
# 静态项目知识(高危区、优先级条款)在 .claude/bugscan.md,那是给模型读的;
# 这里是给脚本读的硬闸。

BUGSCAN_LABEL='homepage'

# 机器写入的数据、人定的常数、部署管线,和闸门脚本自己。
FORBID_RE='^(\.github/|scripts/bugscan/|\.claude/|src/app/model-index/data/|src/app/model-index/lib/weights\.ts$|public/|\.env|\.gitignore$|package\.json$|pnpm-lock\.yaml$|next\.config)'

MAX_LINES=400

GATE_STEPS=(
  'lint|pnpm lint'
  '类型检查|pnpm exec tsc --noEmit'
  '测试|pnpm test'
)

FIX_NOTES='**执行闸**:本仓不设资金/交易执行闸 —— 这是官网,没有下单、支付、资金转移。
但下列是**判决域**(人定的参数与产品口径,不是 bug;信心 100% 也不改,只报告 + 走邮件):
  · src/app/model-index/lib/weights.ts 里的任何常数(各榜权重、域划分、board 元数据、
    哪个源算 report ✱、SOURCE_LOGO)
  · 产品口径:榜单展示条数、导出图行数、卡片信息取舍
  · 文案、一句话定位、配色、排版'

REVIEW_NOTES='仓库:publicai.io 官网。推 main 即自动构建镜像并部署到生产 —— **你放行 = 今天上线**,
你之后没有任何人会再看这份 diff。

本仓没有资金/交易路径,skill 里的「失败方向检查」在这里这样读:
  · 公开榜单的数字宁可**不显示或报错**,也不能显示一个算错的数;
  · 限流 / 输入校验 / reCAPTCHA 宁可拦错,也不能放过;
  · report ✱ 的隔离宁可过严,也不能漏进默认排名。
把任何失败路径从「拦住/报错/不显示」改成「继续/静默/沿用旧值」的,一律 FAIL。

判决域(改了就 FAIL,与修得对不对无关):weights.ts 里的权重与口径常数、榜单展示
条数、文案与配色。'
