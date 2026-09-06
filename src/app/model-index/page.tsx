import type { Metadata } from 'next';

import { cn } from '@/utils';

import IndexTable, { SourceBadge } from './components/index-table';
import { benchmarks, excluded, generatedAt, models, scores } from './data';
import { domainLabel, WEIGHTING } from './lib/weights';

export const metadata: Metadata = {
  title: 'PublicAI Index — Weighted aggregate of public model leaderboards',
  description:
    'One score from independent public leaderboards. Z-scored per board, confidence-weighted by published error bars, weighted by a published scheme. Every figure links back to the publisher.',
  keywords:
    'LLM leaderboard aggregate, model evaluation index, LMArena, Terminal-Bench, ARC-AGI, LiveBench, benchmark normalization, PublicAI',
};

const PANEL =
  'rounded-xl border border-[#2C2C31] bg-white/[0.045] backdrop-blur-sm';
const MEASURE = 'max-w-[68ch]';

const updated = new Date(generatedAt).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const benchById = new Map(benchmarks.map((b) => [b.id, b]));

const method = [
  {
    title: 'Standardize per board',
    text: 'Each leaderboard is z-scored across the models on it and mapped to 0–100 with 50 as that board’s average. An Elo of 1504 and a 57.9% resolution rate become comparable, and a narrow-spread board is not drowned out by a wide one.',
  },
  {
    title: 'Discount by published uncertainty',
    text: 'Where a publisher reports an error bar, the score is discounted in proportion to how wide it is relative to the board’s spread. No error bar means face value — absence is not treated as evidence of a wide one.',
  },
  {
    title: 'Never impute',
    text: 'A model absent from a board is excluded from that term, not filled in with a zero or an average. Both would be inventions. Coverage is shown on every row.',
  },
  {
    title: 'Weight by a published scheme',
    text: 'Each source carries a fixed share, set by PublicAI and stated beside the table with its reason. Domain columns apply the same shares within one domain.',
  },
];

const limits = [
  {
    title: 'Reasoning-effort tiers are not always matched',
    text: 'Boards report different effort tiers for the same model, and the gap between tiers can exceed the gap between models. The tier is visible in each expanded source label. Treat mixed rows as weaker evidence.',
  },
  {
    title: 'Some boards score a scaffold, not a model',
    text: 'Terminal-Bench results are a model plus an agent framework — Codex, Claude Code, Grok Build. The framework is part of the number and is recorded beside each score.',
  },
  {
    title: 'A snapshot, not a live feed',
    text: 'Figures were read from each publisher on the date shown. Leaderboards move; check the source before acting on a number.',
  },
  {
    title: 'Few boards, so far',
    text: 'Enough to show that single-leaderboard rankings do not survive aggregation; not enough to be a definitive ranking of model capability. This page does not claim to be one.',
  },
];

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className={cn(PANEL, 'p-4')}>
    <h2 className="text-micro text-g2 mb-3 tracking-[0.14em] uppercase">
      {title}
    </h2>
    {children}
  </section>
);

export default function ModelIndex() {
  return (
    <div className="container mx-auto max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
      {/* ===================== HEADER ===================== */}
      <header className="pt-10 pb-8 lg:pt-14 lg:pb-10">
        <p className="text-p1 text-micro mb-3 tracking-[0.14em] uppercase">
          PublicAI Index
        </p>
        <h1 className={cn('text-display mb-4 font-bold text-white', MEASURE)}>
          One score from {benchmarks.length} public leaderboards.
        </h1>
        <p className={cn('text-lede mb-5 text-[#D9D7E0]', MEASURE)}>
          A single benchmark is easy to target and easy to overfit. This index
          normalizes independent public leaderboards onto one scale, discounts
          each score by the uncertainty its publisher reports, and weights them
          by a scheme published beside the table.
        </p>
        <dl className="text-caption flex flex-wrap gap-x-6 gap-y-1 text-[#78758A]">
          <div>
            <dt className="inline">Updated </dt>
            <dd className="inline text-[#D9D7E0]">{updated}</dd>
          </div>
          <div>
            <dt className="inline">Sources </dt>
            <dd className="inline text-[#D9D7E0]">{benchmarks.length}</dd>
          </div>
          <div>
            <dt className="inline">Models </dt>
            <dd className="inline text-[#D9D7E0]">{models.length}</dd>
          </div>
          <div>
            <dt className="sr-only">Attribution</dt>
            <dd className="inline">
              Scores belong to their publishers; PublicAI only normalizes and
              weights them.
            </dd>
          </div>
        </dl>
      </header>

      {/* ===================== TABLE + SIDEBAR ===================== */}
      <div
        className="grid grid-cols-1 gap-8 border-t border-white/8 pt-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10"
        id="index">
        <main>
          <IndexTable
            models={models}
            benchmarks={benchmarks}
            scores={scores}
          />
        </main>

        <aside className="flex flex-col gap-4">
          <Card title="Weighting">
            <ol className="flex flex-col gap-3">
              {WEIGHTING.map((w) => {
                const b = benchById.get(w.benchmarkId);
                if (!b) return null;
                return (
                  <li key={w.benchmarkId}>
                    <div className="mb-1 flex items-center gap-2">
                      <SourceBadge
                        benchmark={b}
                        present
                      />
                      <b className="text-body-sm font-semibold text-white">
                        {b.name}
                      </b>
                      <span className="text-caption text-p1 ml-auto font-mono">
                        {w.weight}%
                      </span>
                    </div>
                    <p className="text-caption text-g2">{w.rationale}</p>
                  </li>
                );
              })}
            </ol>
            <p className="text-micro mt-3 border-t border-white/8 pt-3 text-[#78758A]">
              Set by PublicAI. Shares are stated so they can be disagreed with.
            </p>
          </Card>

          <Card title="Sources">
            <ul className="flex flex-col gap-3">
              {benchmarks.map((b) => (
                <li key={b.id}>
                  <div className="mb-0.5 flex flex-wrap items-baseline gap-x-2">
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-sm font-semibold text-white underline underline-offset-2">
                      {b.name}
                    </a>
                    <span className="text-caption text-p1">
                      {domainLabel(b.domain)}
                    </span>
                    <span className="text-micro ml-auto text-[#78758A]">
                      read {b.retrievedAt}
                    </span>
                  </div>
                  {b.snapshot ? (
                    <p className="text-micro text-g2">{b.snapshot}</p>
                  ) : null}
                  {b.caveat ? (
                    <p className="text-micro text-[#78758A]">{b.caveat}</p>
                  ) : null}
                </li>
              ))}
            </ul>
            {excluded.length ? (
              <div className="mt-3 border-t border-white/8 pt-3">
                {excluded.map((e) => (
                  <p
                    key={e.name}
                    className="text-micro text-[#78758A]">
                    <b className="font-semibold text-[#F5C86B]">
                      Excluded — {e.name}.
                    </b>{' '}
                    {e.reason}{' '}
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-p1 underline underline-offset-2">
                      source
                    </a>
                  </p>
                ))}
              </div>
            ) : null}
          </Card>

          <Card title="How the score is computed">
            <ol className="flex flex-col gap-2.5">
              {method.map(({ title, text }, i) => (
                <li key={title}>
                  <b className="text-caption block font-semibold text-white">
                    <span className="text-p1 mr-1.5 font-mono">0{i + 1}</span>
                    {title}
                  </b>
                  <p className="text-micro text-g2">{text}</p>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>

      {/* ===================== LIMITS ===================== */}
      <section
        className="border-t border-white/8 py-12 lg:py-14"
        id="limits">
        <h2 className="text-heading mb-2 font-bold text-white">
          What this index cannot tell you
        </h2>
        <p className={cn('text-g2 text-lede mb-6', MEASURE)}>
          An aggregate hides the disagreements that produced it. These are the
          ones worth knowing before you cite this page.
        </p>
        <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {limits.map(({ title, text }) => (
            <div
              key={title}
              className="border-t border-white/8 py-4">
              <b className="text-body mb-1 block font-semibold text-white">
                {title}
              </b>
              <p className="text-g2 text-body-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
