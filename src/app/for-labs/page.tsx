import type { Metadata } from 'next';

import Computer from '@/assets/svg/computer.svg?react';
import Flag from '@/assets/svg/flag.svg?react';
import Term from '@/assets/svg/term.svg?react';
import TodoCheck from '@/assets/svg/todo-check.svg?react';
import Button from '@/components/Button';
import { cn } from '@/utils';

export const metadata: Metadata = {
  title:
    'Trajector for labs — Real coding-agent trajectories, with the corrections',
  description:
    'Trajector licenses consented coding-agent sessions from live codebases — prompts, tool calls, diffs, human corrections, and the commits that record what survived. SFT data, preference data, and RL environments for AI labs.',
  keywords:
    'agent trajectory data, coding agents, SFT data, preference data, RL environments, AI training data, Claude Code sessions, PublicAI, Trajector',
};

const PANEL =
  'rounded-xl border border-[#2C2C31] bg-white/[0.045] backdrop-blur-sm';

const SECTION = 'border-t border-white/8 py-16 lg:py-20';

const ACCEPT = 'text-[#6EE7A0]';
const REJECT = 'text-[#F08A8A]';

type Tone = 'plain' | 'user' | 'reject' | 'commit';

interface TranscriptEvent {
  t: string;
  k: string;
  tone?: Tone;
  body: React.ReactNode;
}

const transcript: TranscriptEvent[] = [
  {
    t: '00:00',
    k: 'user',
    tone: 'user',
    body: <>rate limiter lets bursts through right after a restart</>,
  },
  { t: '00:07', k: 'tool_use', body: <>read src/ratelimit/bucket.go</> },
  {
    t: '00:24',
    k: 'tool_use',
    body: (
      <>
        edit bucket.go <span className={ACCEPT}>+11</span>{' '}
        <span className={REJECT}>−3</span>{' '}
        <span className="text-[#78758A]">
          persist counters to redis on shutdown
        </span>
      </>
    ),
  },
  { t: '00:39', k: 'assistant', body: <>Counters now survive restarts.</> },
  {
    t: '00:58',
    k: 'user',
    tone: 'reject',
    body: (
      <>
        no, that&apos;s not it. refill uses wall clock, so after a restart it
        thinks a whole window passed. clamp the refill instead.
      </>
    ),
  },
  {
    t: '01:16',
    k: 'tool_use',
    body: (
      <>
        edit bucket.go <span className={ACCEPT}>+5</span>{' '}
        <span className={REJECT}>−9</span>{' '}
        <span className="text-[#78758A]">
          clamp elapsed to window on first tick
        </span>
      </>
    ),
  },
  { t: '01:29', k: 'tool_use', body: <>bash go test ./...</> },
  { t: '01:52', k: 'tool_result', body: <>ok ratelimit 0.41s</> },
  {
    t: '02:10',
    k: 'commit',
    tone: 'commit',
    body: <>7d21f4a fix: clamp token refill after restart</>,
  },
];

const toneRow: Record<Tone, string> = {
  plain: 'border-transparent',
  user: 'border-transparent bg-white/4',
  reject: 'border-[#E5695E] bg-[#E5695E]/10',
  commit: 'border-[#6EE7A0] bg-[#6EE7A0]/10',
};

const toneKey: Record<Tone, string> = {
  plain: 'text-[#78758A]',
  user: 'text-[#D9D7E0]',
  reject: REJECT,
  commit: ACCEPT,
};

type Mark = 'yes' | 'no' | 'part' | null;

interface CompareCell {
  mark: Mark;
  text: string;
}

interface CompareRow {
  label: string;
  /** One cell per entry in `compareColumns`, in order. */
  cells: CompareCell[];
}

const compareColumns = [
  { label: 'Public research datasets', us: false },
  { label: 'Vendor-staged tasks', us: false },
  { label: 'Trajector', us: true },
];

const compare: CompareRow[] = [
  {
    label: 'Where sessions come from',
    cells: [
      { mark: null, text: 'Open-source repos, opt-in' },
      { mark: null, text: 'Tasks written by the vendor, performed for pay' },
      {
        mark: null,
        text: 'Live codebases, including private ones, work that would have happened anyway',
      },
    ],
  },
  {
    label: 'Human corrections',
    cells: [
      { mark: 'part', text: 'Present, unlabeled' },
      { mark: 'no', text: 'Rare — tasks are designed to be completed' },
      {
        mark: 'yes',
        text: 'Labeled, with the developer’s own reason where they gave one',
      },
    ],
  },
  {
    label: 'Outcome verification',
    cells: [
      { mark: 'part', text: 'Commit-linked' },
      { mark: 'part', text: 'Grader-scored' },
      { mark: 'yes', text: 'Commit-linked, line-level survival, test results' },
    ],
  },
  {
    label: 'Dead ends and abandoned sessions',
    cells: [
      { mark: 'part', text: 'Present, unfiltered' },
      { mark: 'no', text: 'Filtered out' },
      { mark: 'yes', text: 'Kept and labeled as their own product' },
    ],
  },
  {
    label: 'Freshness',
    cells: [
      { mark: 'part', text: 'Continuous, public' },
      { mark: 'no', text: 'Batch, on delivery' },
      { mark: 'yes', text: 'Continuous, with model-version slices on request' },
    ],
  },
  {
    label: 'License',
    cells: [
      { mark: 'part', text: 'Research terms' },
      { mark: 'yes', text: 'Commercial' },
      {
        mark: 'yes',
        text: 'Commercial training and evaluation, consent chain attached',
      },
    ],
  },
];

const markDot: Record<NonNullable<Mark>, string> = {
  yes: 'bg-[#6EE7A0]',
  part: 'bg-[#F5C86B]',
  no: 'bg-[#78758A]',
};

const markText: Record<NonNullable<Mark>, string> = {
  yes: 'text-[#D9D7E0]',
  part: 'text-[#D9D7E0]',
  no: 'text-[#78758A]',
};

const compareLegend: [NonNullable<Mark>, string][] = [
  ['yes', 'Full'],
  ['part', 'Partial'],
  ['no', 'Missing'],
];

const CompareValue = ({ mark, text }: CompareCell) => (
  <span className="flex items-start gap-2">
    {mark ? (
      <span
        className={cn('mt-1.5 size-2 shrink-0 rounded-full', markDot[mark])}
        aria-hidden
      />
    ) : null}
    <span className={mark ? markText[mark] : 'text-[#D9D7E0]'}>{text}</span>
  </span>
);

interface Product {
  stage: string;
  title: string;
  plain: string;
  points: string[];
  pitch: string;
  unit: string;
  unitNote: string;
  /** Top rule and price pill colors for this product. */
  accent: { rule: string; pill: string };
}

const products: Product[] = [
  {
    stage: 'For SFT and mid-training',
    title: 'SFT data',
    plain:
      'The same recording, with a label on every line the agent wrote: it survived to the commit, or it was thrown away.',
    points: [
      'Nothing removed. Wrong attempts, failing test runs, and retries stay in, because the loop is what the model has to learn.',
      'Survival label on every agent edit: kept, rewritten, or discarded, at line level.',
      'Session outcome attached: test results and the linked commit where present.',
      'Slice by label: accepted lines only, whole sessions, or the error-and-recovery loop on its own.',
    ],
    pitch: 'Raw data you have to grade yourself. This arrives graded.',
    unit: 'Priced per session',
    unitNote:
      'Volume tiers. Filterable by language, repo visibility, agent, and model version.',
    accent: {
      rule: 'border-t-p1',
      pill: 'border-p1/40 bg-p1/10 text-p1',
    },
  },
  {
    stage: 'For preference training and reward models',
    title: 'Preference data',
    plain:
      'The moment the agent said “done” and the developer said “no”, cut out and placed side by side.',
    points: [
      'Rejected attempt and accepted attempt, aligned as one pair.',
      'The developer’s own words, plus a labeled reason. In the session above: misdiagnosed root cause, persistence vs. refill math.',
      'Rejections from developers on their own projects, on their own deadlines. Not paid raters on staged tasks.',
      'Teaches the model which plans a real person turns down, and when it should have asked.',
    ],
    pitch:
      'Others sell ratings. We sell the moment a real person said no on a real project.',
    unit: 'Priced per pair',
    unitNote:
      'Human-audited subset available at a premium, with reported label accuracy.',
    accent: {
      rule: 'border-t-[#E5695E]',
      pill: 'border-[#E5695E]/40 bg-[#E5695E]/10 text-[#F08A8A]',
    },
  },
  {
    stage: 'For reinforcement learning',
    title: 'RL environments',
    plain:
      'The same recording, turned into a level the model can play again and again.',
    points: [
      'Repo reset to the commit before the agent touched it, in a container that builds.',
      'The developer’s original prompt as the task statement.',
      'The tests that gated the real commit as the verifier: pass scores, fail does not.',
      'Resettable and repeatable. Each environment hand-checked for a clear task and a verifier that actually covers the change.',
    ],
    pitch:
      'Other environments are invented problems. Ours are bugs that actually happened.',
    unit: 'Priced per environment, plus per rollout',
    unitNote:
      'One-time license for the task set; usage fee for managed rollouts.',
    accent: {
      rule: 'border-t-[#6EE7A0]',
      pill: 'border-[#6EE7A0]/40 bg-[#6EE7A0]/10 text-[#6EE7A0]',
    },
  },
];

const PILL =
  'text-caption self-start rounded-full border px-3 py-1 font-medium whitespace-nowrap';

const ladder = [
  ['Raw sessions', 'You see the process, not what was right.'],
  ['SFT data', 'You know what was right.'],
  ['Preference data', 'You know why a person said no.'],
  ['RL environments', 'The model tries it and is scored automatically.'],
];

const levers = [
  {
    title: 'Distribution scarcity',
    text: 'Private repos over public. Uncommon languages and stacks over mainstream. Enterprise-scale monorepos over side projects.',
  },
  {
    title: 'Signal density',
    text: 'Sessions with corrections over clean runs. Failure-and-recovery over first-try success. Abandoned sessions priced on their own.',
  },
  {
    title: 'Freshness',
    text: 'Sessions on a model version from its first 30 days carry a premium: that is when labs most want to see real behavior.',
  },
  {
    title: 'License scope',
    text: 'Non-exclusive by default. Time-boxed exclusivity on a slice, or full exclusivity, priced accordingly.',
  },
  {
    title: 'Targeted collection',
    text: 'Name the distribution you need. We raise contributor incentives on it and deliver a scoped batch. Quoted per project.',
  },
  {
    title: 'Verification depth',
    text: 'Automated labels by default. Human-audited subsets and hand-verified environments as paid upgrades.',
  },
];

const pipeline = [
  {
    title: 'Capture',
    text: 'Uploads signed with per-device keys from reproducible CLI builds.',
  },
  {
    title: 'Scrub',
    text: 'Keys, tokens, env vars, and internal hosts removed on the contributor’s machine, checked again server-side.',
  },
  {
    title: 'Validate',
    text: 'Schema, event ordering, and timing checked against real API latency.',
  },
  {
    title: 'Dedupe',
    text: 'Exact and near-duplicate detection across the whole corpus.',
  },
  {
    title: 'Score',
    text: 'Every session scored for resolution; a sampled subset human-reviewed and the accuracy reported.',
  },
];

const rights = [
  {
    Icon: TodoCheck,
    title: 'Explicit, per-project consent',
    text: 'Capture is opt-in for each repository. Nothing is collected from a project the contributor hasn’t enabled.',
  },
  {
    Icon: Term,
    title: 'Rights attestation at onboarding',
    text: 'Contributors attest that shared sessions cover code they own or that is open source. Recorded and attached to every delivery.',
  },
  {
    Icon: Flag,
    title: 'Perpetual commercial license',
    text: 'Delivered datasets carry a perpetual license for model training and evaluation. Deliveries are not recalled.',
  },
  {
    Icon: Computer,
    title: 'Contributor control, going forward',
    text: 'Contributors can pause capture, exclude repositories, and delete local buffers at any time. This stops future collection; it does not unwind delivered data.',
  },
];

const Key = ({ children }: { children: React.ReactNode }) => (
  <span className="text-p1">{children}</span>
);

const Comment = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#78758A]">{children}</span>
);

const SectionHeading = ({
  title,
  lede,
}: {
  title: string;
  lede?: React.ReactNode;
}) => (
  <>
    <h2 className="text-heading mb-3 font-bold text-white">{title}</h2>
    {lede ? (
      <p className="text-g2 text-lede mb-8 max-w-[60ch]">{lede}</p>
    ) : null}
  </>
);

export default function ForLabs() {
  return (
    <div className="container mx-auto max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
      {/* ===================== HERO ===================== */}
      <header className="grid grid-cols-1 items-start gap-12 pt-10 pb-16 lg:grid-cols-[1.05fr_1fr] lg:pt-16 lg:pb-20">
        <div>
          <p className="text-p1 text-micro mb-4 tracking-[0.14em] uppercase">
            Trajectory data for AI labs
          </p>
          <h1 className="text-display mb-5 font-bold text-white">
            Coding-agent sessions from real work, including every time the
            developer said no.
          </h1>
          <p className="text-lede mb-7 max-w-[48ch] text-[#D9D7E0]">
            Complete, consented trajectories from live codebases: prompts, tool
            calls, diffs, the human corrections, and the commits that record
            what survived.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              className="w-auto px-4 text-base"
              theme="primary"
              href="/business"
              aria-label="request a pilot">
              Request a pilot
            </Button>
            <Button
              className="w-auto px-4 text-base shadow-none"
              href="#products"
              aria-label="see what we license">
              See what we license
            </Button>
          </div>
          <p className="text-g2 text-body-sm mt-7">
            <b className="font-medium text-white">Coverage today:</b> Claude
            Code. Codex, Cursor, Gemini CLI and OpenCode are captured through
            the same layer and added as they pass acceptance.
          </p>
        </div>

        <div
          className="text-code overflow-hidden rounded-2xl border border-[#2C2C31] bg-[#161618] font-mono shadow-[0_24px_60px_rgba(8,4,20,0.5)]"
          aria-label="Example trajectory">
          <div className="text-micro flex flex-wrap items-center justify-between gap-2 bg-[#1E1E22] px-4 py-2.5 text-[#78758A]">
            <span>
              <b className="font-medium text-[#D9D7E0]">session_9c2e.jsonl</b> ·
              claude-code · claude-sonnet-4-6
            </span>
            <span>repo: private · go</span>
          </div>
          <ol className="py-3">
            {transcript.map((ev, i) => {
              const tone = ev.tone ?? 'plain';
              return (
                <li
                  key={i}
                  className={cn(
                    'grid grid-cols-[40px_1fr] gap-x-2.5 border-l-[3px] px-4 py-1.5 sm:grid-cols-[44px_84px_1fr]',
                    toneRow[tone],
                  )}>
                  <span className="text-[#78758A] max-sm:row-span-2">
                    {ev.t}
                  </span>
                  <span className={toneKey[tone]}>{ev.k}</span>
                  <span className="text-[#D9D7E0] max-sm:col-start-2">
                    {ev.body}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="text-micro flex flex-wrap gap-x-4 gap-y-1 border-t border-white/8 px-4 py-3 text-[#78758A]">
            <span>
              <b className={cn('font-medium', REJECT)}>1 correction turn</b>,
              labeled
            </span>
            <span>
              <b className={cn('font-medium', ACCEPT)}>5 of 16</b> agent lines
              survived to commit
            </span>
            <span>commit linked</span>
          </div>
        </div>
      </header>

      {/* ===================== WHY ===================== */}
      <section
        className={SECTION}
        id="why">
        <SectionHeading
          title="What you can’t get from a public dataset or a vendor’s task farm"
          lede="Free research corpora prove the demand. Staged-task vendors prove the budget. Neither can hand you the moment a developer rejects the agent’s plan inside a codebase that matters to them."
        />
        {/* Desktop: one table. Mobile: one card per dimension, no sideways scroll. */}
        <div className={cn(PANEL, 'overflow-hidden max-md:hidden')}>
          <table className="text-body-sm w-full border-collapse text-left">
            <thead>
              <tr className="text-micro bg-white/4 tracking-[0.1em] text-[#78758A] uppercase">
                <th className="w-[22%] px-5 py-4 font-medium" />
                {compareColumns.map((column) => (
                  <th
                    key={column.label}
                    className={cn(
                      'px-5 py-4 font-medium',
                      column.us &&
                        'bg-primary/15 border-l border-white/8 text-white',
                    )}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr
                  key={row.label}
                  className="border-t border-white/8 align-top">
                  <th
                    scope="row"
                    className="text-body px-5 py-4 text-left font-semibold text-white">
                    {row.label}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td
                      key={i}
                      className={cn(
                        'px-5 py-4',
                        compareColumns[i].us &&
                          'bg-primary/8 border-l border-white/8 font-medium',
                      )}>
                      <CompareValue {...cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 md:hidden">
          {compare.map((row) => (
            <div
              key={row.label}
              className={cn(PANEL, 'overflow-hidden')}>
              <h3 className="text-body border-b border-white/8 px-4 py-3 font-semibold text-white">
                {row.label}
              </h3>
              <dl className="text-body-sm">
                {row.cells.map((cell, i) => (
                  <div
                    key={i}
                    className={cn(
                      'px-4 py-3',
                      compareColumns[i].us
                        ? 'bg-primary/10 border-t border-white/8 font-medium'
                        : 'border-t border-white/6 first:border-t-0',
                    )}>
                    <dt
                      className={cn(
                        'text-micro mb-1 tracking-[0.1em] uppercase',
                        compareColumns[i].us ? 'text-p1' : 'text-[#78758A]',
                      )}>
                      {compareColumns[i].label}
                    </dt>
                    <dd>
                      <CompareValue {...cell} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <ul className="text-caption mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[#78758A]">
          {compareLegend.map(([mark, label]) => (
            <li
              key={mark}
              className="flex items-center gap-2">
              <span
                className={cn('size-2 rounded-full', markDot[mark])}
                aria-hidden
              />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* ===================== PRODUCTS ===================== */}
      <section
        className={SECTION}
        id="products">
        <SectionHeading
          title="What we license"
          lede="Three products, each built on the one below it. Buy the layer your pipeline needs."
        />

        <div
          className={cn(
            PANEL,
            'flex flex-col gap-4 border-l-4 border-l-white/40 px-5 py-5 md:flex-row md:items-center md:gap-8',
          )}>
          <div className="shrink-0 md:w-48">
            <span className="text-micro text-g2 mb-1 block tracking-[0.14em] uppercase">
              Base layer
            </span>
            <b className="text-subheading block font-semibold text-white">
              Raw sessions
            </b>
          </div>
          <p className="text-body-sm flex-1 text-[#D9D7E0]">
            The complete record of a developer working with a coding agent:
            every prompt, file read, edit, command, and output, in order.
            Consented, scrubbed, and deduplicated JSONL. Every product below is
            cut from this.
          </p>
          <span
            className={cn(
              PILL,
              'shrink-0 border-white/15 bg-white/5 text-white md:self-center',
            )}>
            Priced per token
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.title}
              className={cn(
                PANEL,
                'flex flex-col border-t-4 p-6 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-4',
                product.accent.rule,
              )}>
              <div>
                <span className="text-micro text-g2 mb-1 block tracking-[0.14em] uppercase">
                  {product.stage}
                </span>
                <h3 className="text-subheading mb-2 font-semibold text-white">
                  {product.title}
                </h3>
                <p className="text-body text-[#D9D7E0]">{product.plain}</p>
              </div>
              <ul className="mt-5 list-none lg:mt-0">
                {product.points.map((point) => (
                  <li
                    key={point}
                    className="text-g2 text-body-sm border-t border-white/6 py-2 first:border-t-0">
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-p1 text-body-sm mt-4 font-medium lg:mt-0">
                {product.pitch}
              </p>
              <div className="mt-5 flex flex-col gap-2.5 border-t border-white/8 pt-5 lg:mt-0">
                <span className={cn(PILL, product.accent.pill)}>
                  {product.unit}
                </span>
                <p className="text-g2 text-caption">{product.unitNote}</p>
              </div>
            </article>
          ))}
        </div>

        <ol className="mt-8 grid grid-cols-1 md:grid-cols-4">
          {ladder.map(([name, text], i) => {
            const last = i === ladder.length - 1;
            return (
              <li
                key={name}
                className="flex gap-4 pb-8 last:pb-0 md:flex-col md:gap-3 md:pr-6 md:pb-0">
                <div className="flex flex-col items-center md:w-full md:flex-row">
                  <span className="border-primary bg-b1 text-p1 text-caption flex size-7 shrink-0 items-center justify-center rounded-full border font-semibold">
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      'from-primary w-px flex-1 bg-linear-to-b md:h-px md:w-auto md:bg-linear-to-r',
                      last ? 'to-transparent max-md:hidden' : 'to-white/10',
                    )}
                    aria-hidden
                  />
                </div>
                <div>
                  <div
                    className="mb-3 flex items-end gap-1"
                    aria-hidden>
                    {ladder.map((_, level) => (
                      <span
                        key={level}
                        className={cn(
                          'w-1.5 rounded-sm',
                          level <= i ? 'bg-p1' : 'bg-white/10',
                        )}
                        style={{ height: `${6 + level * 4}px` }}
                      />
                    ))}
                  </div>
                  <b className="text-body mb-1 block font-semibold text-white">
                    {name}
                  </b>
                  <p className="text-g2 text-body-sm">{text}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="text-g2 text-body-sm mt-6">
          Each layer is one step closer to going straight into your training
          pipeline, and priced one step higher. Every product can be scoped by
          distribution: private repos only, a language or stack, sessions with
          at least one correction, or sessions on a named model version.
        </p>
      </section>

      {/* ===================== PRICING ===================== */}
      <section
        className={SECTION}
        id="pricing">
        <SectionHeading
          title="What moves the price"
          lede="Volume is the smallest lever. These are the ones that matter."
        />
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {levers.map(({ title, text }) => (
            <div
              key={title}
              className="border-t border-white/8 py-5">
              <b className="text-body mb-1 block font-semibold text-white">
                {title}
              </b>
              <p className="text-g2 text-body-sm">{text}</p>
            </div>
          ))}
        </div>
        <div className={cn(PANEL, 'text-body-sm mt-8 px-5 py-4')}>
          <b className="font-semibold text-white">
            No list prices, on purpose.
          </b>{' '}
          <span className="text-[#D9D7E0]">
            Pilot batches are quoted against the scope above. A pilot is
            typically a few thousand SFT sessions or a few hundred preference
            pairs in a distribution you choose, delivered in two weeks, with the
            option to extend to a standing subscription.
          </span>
        </div>
      </section>

      {/* ===================== SAMPLE ===================== */}
      <section
        className={cn(SECTION, 'grid grid-cols-1 gap-12 lg:grid-cols-2')}
        id="sample">
        <div>
          <SectionHeading
            title="Start with the sample"
            lede="300 preference pairs from public repos, fully scrubbed, under a research license. Run your own analysis before anyone books a call."
          />
          <Button
            className="w-auto px-4 text-base"
            theme="primary"
            href="/business"
            aria-label="request the sample">
            Request the sample
          </Button>
          <p className="text-g2 text-body-sm mt-6">
            If you publish on it, cite the dataset card. If you want the
            private-repo version, that is the pilot.
          </p>
        </div>
        <pre className="text-code overflow-auto rounded-2xl border border-[#2C2C31] bg-[#161618] p-5 font-mono text-[#D9D7E0]">
          {'{\n'}
          {'  '}
          <Key>&quot;pair_id&quot;</Key>: &quot;9c2e-t4&quot;,{'\n'}
          {'  '}
          <Key>&quot;session_id&quot;</Key>: &quot;9c2e&quot;,{'\n'}
          {'  '}
          <Key>&quot;agent&quot;</Key>: &quot;claude-code&quot;,{' '}
          <Key>&quot;model&quot;</Key>: &quot;claude-sonnet-4-6&quot;,{'\n'}
          {'  '}
          <Key>&quot;repo_visibility&quot;</Key>: &quot;public&quot;,{' '}
          <Key>&quot;language&quot;</Key>: &quot;go&quot;,{'\n'}
          {'  '}
          <Key>&quot;rejected&quot;</Key>:{'  { '}
          <Key>&quot;turn&quot;</Key>: 3, <Key>&quot;diff&quot;</Key>:
          &quot;...&quot;, <Key>&quot;survived_lines&quot;</Key>: 0{' },\n'}
          {'  '}
          <Key>&quot;accepted&quot;</Key>:{'  { '}
          <Key>&quot;turn&quot;</Key>: 5, <Key>&quot;diff&quot;</Key>:
          &quot;...&quot;, <Key>&quot;survived_lines&quot;</Key>: 5{' },\n'}
          {'  '}
          <Key>&quot;correction&quot;</Key>: {'{\n'}
          {'    '}
          <Key>&quot;user_text&quot;</Key>: &quot;no, that&apos;s not it. refill
          uses wall clock...&quot;,{'\n'}
          {'    '}
          <Key>&quot;stated_reason&quot;</Key>:{' '}
          <Comment>{'// contributor-supplied, optional'}</Comment>
          {'\n'}
          {'      '}&quot;the elapsed calc assumed continuous uptime&quot;,
          {'\n'}
          {'    '}
          <Key>&quot;inferred_reason&quot;</Key>: &quot;wrong root cause:
          persistence vs refill math&quot;,{'\n'}
          {'    '}
          <Key>&quot;confidence&quot;</Key>: 0.86,{'\n'}
          {'    '}
          <Key>&quot;failure_mode&quot;</Key>:
          &quot;misdiagnosed_root_cause&quot;,{'\n'}
          {'    '}
          <Key>&quot;intent&quot;</Key>: &quot;fix&quot;{'\n'}
          {'  },\n'}
          {'  '}
          <Key>&quot;outcome&quot;</Key>:{' { '}
          <Key>&quot;commit&quot;</Key>: &quot;7d21f4a&quot;,{' '}
          <Key>&quot;tests&quot;</Key>: &quot;pass&quot;{' },\n'}
          {'  '}
          <Key>&quot;audited&quot;</Key>: false{'\n'}
          {'}'}
        </pre>
      </section>

      {/* ===================== PIPELINE ===================== */}
      <section
        className={SECTION}
        id="pipeline">
        <SectionHeading
          title="Accepted before it reaches you"
          lede="Every session passes five gates. What fails, you never see and never pay for."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pipeline.map(({ title, text }, i) => (
            <div
              key={title}
              className={cn(PANEL, 'p-4')}>
              <span className="text-micro mb-1.5 block tracking-[0.08em] text-[#78758A]">
                0{i + 1}
              </span>
              <b className="text-body-sm mb-1 block font-medium text-white">
                {title}
              </b>
              <p className="text-g2 text-caption">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== RIGHTS ===================== */}
      <section
        className={SECTION}
        id="rights">
        <SectionHeading title="Rights you can build on" />
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {rights.map(({ Icon, title, text }) => (
            <div
              key={title}
              className={cn(PANEL, 'flex items-start gap-4 p-5')}>
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#6EE7A0]/30 bg-[#6EE7A0]/10',
                  ACCEPT,
                )}
                aria-hidden>
                <Icon className="size-5" />
              </span>
              <div>
                <b className="text-body mb-1 block font-semibold text-white">
                  {title}
                </b>
                <p className="text-g2 text-caption">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PILOT ===================== */}
      <section
        className="border-t border-white/8 pt-16 pb-20 lg:pt-20"
        id="pilot">
        <div className="border-primary from-primary/20 to-primary/6 rounded-20 flex flex-col items-center border bg-linear-135 p-11 text-center">
          <h2 className="text-heading mb-3 font-bold text-white">
            Start with a scoped pilot
          </h2>
          <p className="text-lede mb-6 max-w-[56ch] text-[#D9D7E0]">
            Tell us the distribution and the training stage. We come back with a
            batch size, a delivery date, and a quote.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              className="w-auto px-4 text-base"
              theme="primary"
              href="/business"
              aria-label="request a pilot">
              Request a pilot
            </Button>
            <Button
              className="w-auto px-4 text-base shadow-none"
              href="#sample"
              aria-label="see the sample first">
              See the sample first
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
