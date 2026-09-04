import type { Metadata } from 'next';

import Computer from '@/assets/svg/computer.svg?react';
import Flag from '@/assets/svg/flag.svg?react';
import Term from '@/assets/svg/term.svg?react';
import TodoCheck from '@/assets/svg/todo-check.svg?react';
import Button from '@/components/Button';
import { cn } from '@/utils';

export const metadata: Metadata = {
  title: 'Trajector for labs — Real-world training signals for coding agents',
  description:
    'Trajector licenses consented coding-agent sessions from live codebases — prompts, tool calls, diffs, human corrections, and the commits that record what survived.',
  keywords:
    'agent trajectory data, coding agents, outcome-labeled trajectories, human correction data, AI training data, Claude Code sessions, PublicAI, Trajector',
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
        text: 'Extracted as events, quality-scored, in the developer’s own words',
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
      { mark: 'yes', text: 'Kept and labeled' },
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

const LABELS = [
  'accepted',
  'overwritten',
  'test_passed',
  'committed',
  'reverted',
  'human_correction',
  'reasoning_retained',
  'decision_supervised',
];

interface View {
  name: string;
  text: string;
  unit: string;
  /** Only the corrections view carries the worked example. */
  example?: boolean;
}

const views: View[] = [
  {
    name: 'SFT-ready',
    text: 'Frontier-model sessions with retained lines and linked commits.',
    unit: 'per session',
  },
  {
    name: 'Human corrections',
    text: 'Events where a developer rejected an agent action and a later attempt was accepted. Quality-scored, any model.',
    unit: 'per event',
    example: true,
  },
  {
    name: 'Preference pairs',
    text: 'Rejected and preferred actions from correction events, aligned.',
    unit: 'per pair',
  },
  {
    name: 'Failure recovery',
    text: 'Sessions containing a failed test or error followed by a passing fix.',
    unit: 'per session',
  },
  {
    name: 'Verified outcomes',
    text: 'Sessions with a passing test run and a linked commit.',
    unit: 'per session',
  },
];

const CorrectionExample = () => (
  <div className="text-code rounded-lg border border-[#2C2C31] bg-[#161618] p-4 font-mono">
    <dl className="flex flex-col gap-2.5">
      <div>
        <dt className={cn('text-micro mb-0.5', REJECT)}>rejected</dt>
        <dd className="text-[#D9D7E0]">Persist counter state in Redis.</dd>
      </div>
      <div>
        <dt className="text-micro mb-0.5 text-[#D9D7E0]">human</dt>
        <dd className="text-white">
          “No, that’s not it. Refill uses wall clock. Clamp it instead.”
        </dd>
      </div>
      <div>
        <dt className={cn('text-micro mb-0.5', ACCEPT)}>preferred</dt>
        <dd className="text-[#D9D7E0]">
          Clamp elapsed time to the window on first tick.
        </dd>
      </div>
    </dl>
    <p className="text-micro mt-3 border-t border-white/8 pt-3 text-[#78758A]">
      reason: wrong root-cause diagnosis · outcome: tests passed, patch retained
      · quality: 84/100
    </p>
  </div>
);

const PILL =
  'text-caption self-start rounded-full border px-3 py-1 font-medium whitespace-nowrap';

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
    text: 'Sessions from a model version’s first 30 days carry a premium.',
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
    text: 'Automated labels by default. Human-audited subsets as paid upgrades.',
  },
  {
    title: 'Reasoning coverage',
    text: 'Sessions with original reasoning preserved carry a premium. Generated decision rationale is an optional enrichment, labeled as such.',
  },
];

const buying = [
  {
    title: 'Scope',
    text: 'You choose the view, the distribution, the batch size, and the acceptance criteria: schema validity, scrub pass, and label accuracy on a sample you draw. Optional enrichments are selected here.',
  },
  {
    title: 'Pilot',
    text: 'We deliver one batch. You run acceptance on it and pay only for the units that pass. Rejected units are replaced or excluded from the invoice.',
  },
  {
    title: 'Standing agreement',
    text: 'Recurring deliveries at the cadence you set, under the same acceptance terms and unit price. Fresh sessions and new model versions reach standing buyers first.',
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
    text: 'Sessions scored for resolution; correction events scored for quality. Audited subsets available.',
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
            Real developer work, transformed into training signals for coding
            agents.
          </h1>
          <p className="text-lede mb-7 max-w-[48ch] text-[#D9D7E0]">
            Trajector captures real-world coding-agent interactions and turns
            them into outcome-labeled trajectories with built-in training views.
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
            Code.
          </p>
        </div>

        <div>
          <div
            className="text-code overflow-hidden rounded-2xl border border-[#2C2C31] bg-[#161618] font-mono shadow-[0_24px_60px_rgba(8,4,20,0.5)]"
            aria-label="Example trajectory">
            <div className="text-micro flex flex-wrap items-center justify-between gap-2 bg-[#1E1E22] px-4 py-2.5 text-[#78758A]">
              <span>
                <b className="font-medium text-[#D9D7E0]">session_9c2e.jsonl</b>{' '}
                · claude-code · claude-sonnet-4-6
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
                <b className={cn('font-medium', REJECT)}>1 correction event</b>,
                extracted
              </span>
              <span>
                <b className={cn('font-medium', ACCEPT)}>5 of 16</b> agent lines
                retained
              </span>
              <span>commit linked · tests passed</span>
            </div>
          </div>
          <p className="text-g2 text-caption mt-3">
            One real interaction. Multiple training signals.
          </p>
        </div>
      </header>

      {/* ===================== WHY ===================== */}
      <section
        className={SECTION}
        id="why">
        <SectionHeading title="How Trajector data compares" />
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
          lede="One dataset. Cut the way your pipeline needs."
        />

        <p className="text-body-sm text-[#D9D7E0]">
          <b className="font-semibold text-white">Source:</b> permissioned
          real-world coding-agent trajectories — conversations, tool calls, code
          edits, commands, and execution results, scrubbed on the contributor’s
          machine.
        </p>

        <article className={cn(PANEL, 'border-t-p1 mt-6 border-t-4 p-6')}>
          <h3 className="text-subheading mb-2 font-semibold text-white">
            Outcome-Labeled Trajectories
          </h3>
          <p className="text-body mb-4 text-[#D9D7E0]">
            The complete work record, where every step knows what happened to
            it.
          </p>
          <p className="text-g2 text-body-sm max-w-[80ch]">
            Real coding-agent trajectories with acceptance, test, commit,
            retention, and human-correction labels on every turn. Nothing is
            cut: failed attempts, reverts, corrections, and abandoned sessions
            stay in, labeled. Original reasoning is preserved where the client
            kept it; generated decision rationale is available as an option,
            labeled separately.
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {LABELS.map((label) => (
              <li
                key={label}
                className="text-caption rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[#D9D7E0]">
                {label}
              </li>
            ))}
          </ul>

          <h4 className="text-micro text-g2 mt-8 mb-1 tracking-[0.14em] uppercase">
            Training views
          </h4>
          <dl>
            {views.map((view) => (
              <div
                key={view.name}
                className="border-t border-white/8 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="text-body font-semibold text-white">
                    {view.name}
                  </dt>
                  <span
                    className={cn(
                      PILL,
                      'border-p1/40 bg-p1/10 text-p1 font-mono',
                    )}>
                    {view.unit}
                  </span>
                </div>
                <dd className="text-g2 text-body-sm mt-1 max-w-[80ch]">
                  {view.text}
                </dd>
                {view.example ? (
                  <dd className="mt-3">
                    <CorrectionExample />
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        </article>

        <p className="text-body-sm mt-6 text-[#D9D7E0]">
          <b className="font-semibold text-white">
            Views are filters on the same dataset.
          </b>{' '}
          Full-dataset access includes all of them.
        </p>
      </section>

      {/* ===================== PRICING ===================== */}
      <section
        className={SECTION}
        id="pricing">
        <SectionHeading
          title="What moves the price"
          lede="Unit prices are quoted against the scope of each batch."
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
      </section>

      {/* ===================== HOW BUYING WORKS ===================== */}
      <section
        className={SECTION}
        id="buying">
        <SectionHeading
          title="How buying works"
          lede="Deliveries are billed per accepted unit."
        />
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {buying.map(({ title, text }, i) => (
            <li
              key={title}
              className={cn(PANEL, 'p-5')}>
              <span className="border-primary bg-b1 text-p1 text-caption mb-3 flex size-7 items-center justify-center rounded-full border font-semibold">
                {i + 1}
              </span>
              <b className="text-body mb-1 block font-semibold text-white">
                {title}
              </b>
              <p className="text-g2 text-body-sm">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===================== SAMPLE ===================== */}
      <section
        className={cn(SECTION, 'grid grid-cols-1 gap-12 lg:grid-cols-2')}
        id="sample">
        <div>
          <SectionHeading
            title="Start with the sample"
            lede="Ten correction events from public repos, fully scrubbed, under a research license. Enough to audit the schema and the labeling, not enough to train on."
          />
          <Button
            className="w-auto px-4 text-base"
            theme="primary"
            href="/business"
            aria-label="request the sample">
            Request the sample
          </Button>
          <p className="text-g2 text-body-sm mt-6">
            If you publish on it, cite the dataset card. Private-repo data is
            available through a pilot.
          </p>
        </div>
        <pre className="text-code overflow-auto rounded-2xl border border-[#2C2C31] bg-[#161618] p-5 font-mono text-[#D9D7E0]">
          {'{\n'}
          {'  '}
          <Key>&quot;event_id&quot;</Key>: &quot;9c2e-t4&quot;,{' '}
          <Key>&quot;session_id&quot;</Key>: &quot;9c2e&quot;,{'\n'}
          {'  '}
          <Key>&quot;task_context&quot;</Key>: {'{\n'}
          {'    '}
          <Key>&quot;task&quot;</Key>: &quot;rate limiter lets bursts through
          after a restart&quot;,{'\n'}
          {'    '}
          <Key>&quot;repo_visibility&quot;</Key>: &quot;public&quot;,{' '}
          <Key>&quot;language&quot;</Key>: &quot;go&quot;{'\n'}
          {'  },\n'}
          {'  '}
          <Key>&quot;trajectory_context&quot;</Key>: {'{\n'}
          {'    '}
          <Key>&quot;turn&quot;</Key>: 3, <Key>&quot;agent&quot;</Key>:
          &quot;claude-code&quot;, <Key>&quot;model&quot;</Key>:
          &quot;claude-sonnet-4-6&quot;{'\n'}
          {'  },\n'}
          {'  '}
          <Key>&quot;rejected_action&quot;</Key>:{'  { '}
          <Key>&quot;diff&quot;</Key>: &quot;...&quot;,{' '}
          <Key>&quot;retained_lines&quot;</Key>: 0{' },\n'}
          {'  '}
          <Key>&quot;human_feedback&quot;</Key>: &quot;no, that&apos;s not it.
          refill uses wall clock...&quot;,{'\n'}
          {'  '}
          <Key>&quot;preferred_action&quot;</Key>: {'{ '}
          <Key>&quot;diff&quot;</Key>: &quot;...&quot;,{' '}
          <Key>&quot;retained_lines&quot;</Key>: 5{' },\n'}
          {'  '}
          <Key>&quot;outcome&quot;</Key>:{' { '}
          <Key>&quot;commit&quot;</Key>: &quot;7d21f4a&quot;,{' '}
          <Key>&quot;tests&quot;</Key>: &quot;pass&quot;,{' '}
          <Key>&quot;patch_retained&quot;</Key>: true{' },\n'}
          {'  '}
          <Key>&quot;correction_reason&quot;</Key>:
          &quot;wrong_root_cause_diagnosis&quot;,{'\n'}
          {'  '}
          <Key>&quot;quality_score&quot;</Key>: 84,{'\n'}
          {'  '}
          <Key>&quot;reasoning_source&quot;</Key>: &quot;original&quot;,{' '}
          <Comment>{'// original | generated | none'}</Comment>
          {'\n'}
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
