import type { Metadata } from 'next';

import { cn } from '@/utils';

import IndexConsole from './components/index-console';
import { benchmarks, excluded, models, scores } from './data/benchmarks';

export const metadata: Metadata = {
  title: 'PublicAI Index — Weighted aggregate of public model leaderboards',
  description:
    'One score from four public leaderboards. Z-scored per board, confidence-weighted by published error bars, re-weightable for your use case. Every figure links back to the publisher.',
  keywords:
    'LLM leaderboard aggregate, model evaluation index, LMArena, Terminal-Bench, ARC-AGI, LiveBench, benchmark normalization, PublicAI',
};

const PANEL =
  'rounded-xl border border-[#2C2C31] bg-white/[0.045] backdrop-blur-sm';
const SECTION = 'border-t border-white/8 py-14 lg:py-16';
const READABLE = 'max-w-4xl';
const MEASURE = 'max-w-[68ch]';

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
      <p className={cn('text-g2 text-lede mb-8', MEASURE)}>{lede}</p>
    ) : null}
  </>
);

const method = [
  {
    title: 'Standardize per board',
    text: 'Each leaderboard is z-scored across the models on it, then mapped to a 0–100 scale where 50 is that board’s average. An Elo of 1504 and a 57.9% resolution rate become comparable, and a board with a narrow spread stops being drowned out by one with a wide spread.',
  },
  {
    title: 'Weight by published confidence',
    text: 'Where a publisher reports an error bar, the score is discounted in proportion to how wide that bar is relative to the board’s own spread. Where no error bar is published, the score is taken at face value — absence of an error bar is not treated as evidence of a wide one.',
  },
  {
    title: 'Never impute a missing score',
    text: 'A model absent from a board is excluded from that term, not filled in with a zero or a board average. Both would be inventions, and both would change the ranking. Coverage is printed on every row so a thin result looks thin.',
  },
  {
    title: 'Map entities explicitly',
    text: 'The same model is written four different ways across these boards — claude-fable-5.1-max, Fable 5.1(max), Claude Fable 5.1 (Max), Claude Fable 5.1 Max Effort. Each score keeps the publisher’s original string, shown when you expand a row, so any alignment we made can be checked.',
  },
];

const limits = [
  {
    title: 'Reasoning-effort tiers are not always matched',
    text: 'Boards report different effort tiers for the same model, and the gap between tiers can exceed the gap between models. Where a row mixes tiers, the tier is visible in the expanded source labels. Treat those rows as weaker evidence.',
  },
  {
    title: 'Some boards score a scaffold, not a model',
    text: 'Terminal-Bench results are a model plus an agent framework — Codex, Claude Code, Grok Build. The framework is part of the number. The scaffold is recorded alongside each score.',
  },
  {
    title: 'A snapshot, not a live feed',
    text: 'Figures were read from each publisher on the date shown and are static until refreshed. Leaderboards move; check the source before making a decision on a stale number.',
  },
  {
    title: 'Small sample of boards',
    text: 'Four boards is enough to show that single-leaderboard rankings do not survive aggregation. It is not enough to be a definitive ranking of model capability, and this page does not claim to be one.',
  },
];

export default function ModelIndex() {
  return (
    <div className="container mx-auto max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
      {/* ===================== HERO ===================== */}
      <header className="pt-10 pb-12 lg:pt-16 lg:pb-14">
        <p className="text-p1 text-micro mb-4 tracking-[0.14em] uppercase">
          PublicAI Index
        </p>
        <h1 className={cn('text-display mb-5 font-bold text-white', MEASURE)}>
          One score from four public leaderboards.
        </h1>
        <p className={cn('text-lede mb-6 text-[#D9D7E0]', MEASURE)}>
          A single benchmark is easy to target and easy to overfit. This page
          normalizes four independent public leaderboards onto one scale,
          weights them by the uncertainty their publishers report, and lets you
          re-weight the whole thing for the work you actually do.
        </p>
        <p className={cn('text-g2 text-body-sm', MEASURE)}>
          Aggregated from public leaderboards. Scores belong to their
          publishers; PublicAI only normalizes and weights them. Every figure
          links back to the page it was read from.
        </p>
      </header>

      {/* ===================== CONSOLE + TABLE ===================== */}
      <section
        className="border-t border-white/8 py-12 lg:py-14"
        id="index">
        <IndexConsole
          models={models}
          benchmarks={benchmarks}
          scores={scores}
        />
      </section>

      {/* ===================== SOURCES ===================== */}
      <section
        className={SECTION}
        id="sources">
        <div className={READABLE}>
          <SectionHeading
            title="Where the numbers come from"
            lede="Four first-party leaderboards. Secondary trackers were not used: while building this, three of them reported three different leaders for the same benchmark, including one that contradicted itself in a single sentence."
          />
          <div className="flex flex-col gap-3">
            {benchmarks.map((b) => (
              <div
                key={b.id}
                className={cn(PANEL, 'p-4')}>
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body font-semibold text-white underline underline-offset-2">
                    {b.name}
                  </a>
                  <span className="text-caption text-p1">{b.domain}</span>
                  <span className="text-caption ml-auto text-[#78758A]">
                    read {b.retrievedAt}
                  </span>
                </div>
                {b.snapshot ? (
                  <p className="text-caption text-g2 mb-1">{b.snapshot}</p>
                ) : null}
                {b.caveat ? (
                  <p className="text-caption text-[#78758A]">{b.caveat}</p>
                ) : null}
              </div>
            ))}
          </div>

          {excluded.map((e) => (
            <div
              key={e.name}
              className="mt-5 border-l-2 border-[#F5C86B]/50 py-1 pl-4">
              <p className="text-body-sm text-white">
                <b className="font-semibold">Excluded — {e.name}.</b>{' '}
                <span className="text-g2">{e.reason}</span>{' '}
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-p1 underline underline-offset-2">
                  source
                </a>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== METHODOLOGY ===================== */}
      <section
        className={SECTION}
        id="methodology">
        <div className={READABLE}>
          <SectionHeading
            title="How the score is computed"
            lede="Four steps, each one a decision that changes the ranking. They are stated here so you can disagree with them."
          />
          <ol className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {method.map(({ title, text }, i) => (
              <li
                key={title}
                className="border-t border-white/8 py-5">
                <span className="text-micro text-p1 mb-1 block font-mono">
                  0{i + 1}
                </span>
                <b className="text-body mb-1 block font-semibold text-white">
                  {title}
                </b>
                <p className="text-g2 text-body-sm">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================== LIMITS ===================== */}
      <section
        className={SECTION}
        id="limits">
        <div className={READABLE}>
          <SectionHeading
            title="What this index cannot tell you"
            lede="An aggregate hides the disagreements that produced it. These are the ones worth knowing about before you cite this page."
          />
          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {limits.map(({ title, text }) => (
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
        </div>
      </section>
    </div>
  );
}
