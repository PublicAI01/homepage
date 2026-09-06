import type { Metadata } from 'next';

import { cn } from '@/utils';

import IndexTable, { SourceBadge } from './components/index-table';
import { benchmarks, excluded, generatedAt, models, scores } from './data';
import { groupBoards } from './lib/boards';
import {
  domainLabel,
  MIN_SOURCES,
  PRIOR_FRACTION,
  WEIGHTING,
} from './lib/weights';

export const metadata: Metadata = {
  title: 'PublicAI Index — Weighted aggregate of public model leaderboards',
  description:
    'One score from independent public leaderboards, and a score per domain. Z-scored per board, discounted by published error bars, shrunk on thin evidence, weighted by a published scheme. Every figure links back to the publisher.',
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

const boards = groupBoards(benchmarks);
const boardById = new Map(boards.map((b) => [b.id, b]));
const domains = [...new Set(benchmarks.map((b) => b.domain))];

const method = [
  {
    title: 'Standardize per measure',
    text: 'Each figure a board publishes is z-scored across the models on it and mapped to 0–100 with 50 as that measure’s average. An Elo of 1504 and a 57.9% resolution rate become comparable, and a narrow-spread board is not drowned out by a wide one.',
  },
  {
    title: 'Discount by published uncertainty',
    text: 'Where a publisher reports an error bar, the score is discounted in proportion to how wide it is relative to the board’s spread. No error bar means face value — absence is not treated as evidence of a wide one.',
  },
  {
    title: 'Never impute; shrink instead',
    text: `A model absent from a board is excluded from that term, not filled in. But thin evidence is pulled toward 50 by a prior worth ${Math.round(PRIOR_FRACTION * 100)}% of the weight available, so one generous board cannot put a barely-tested model at the top. Scored by fewer than ${MIN_SOURCES} boards, a model is listed as provisional and not ranked.`,
  },
  {
    title: 'Weight by a published scheme',
    text: 'Each board’s headline figure carries a fixed share of the Overall index, stated beside the table with its reason. A board’s category figures shape only the domain they measure, so no board is counted twice.',
  },
];

const limits = [
  {
    title: 'Reasoning-effort tiers are matched by rule',
    text: 'Boards report several effort tiers per model. The highest published tier is indexed, and the exact label is kept beside each score. Where a board only published a lower tier, that row is weaker evidence than it looks.',
  },
  {
    title: 'Some boards score a scaffold, not a model',
    text: 'Terminal-Bench results are a model plus an agent framework — Codex, Claude Code, Grok Build. The framework is part of the number and is recorded beside each score.',
  },
  {
    title: 'Model identity is inferred from names',
    text: 'Four boards spell the same model four ways. They are matched by name after tier and vendor words are removed. The rule is tested against hand-checked cases and every merge is logged, but a wrong merge is possible; the expanded row shows the exact source labels.',
  },
  {
    title: 'A snapshot, not a live feed',
    text: 'Figures were read from each publisher on the date shown. Leaderboards move; check the source before acting on a number.',
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
          {models.length} models, {boards.length} public leaderboards, one
          scale.
        </h1>
        <p className={cn('text-lede mb-5 text-[#D9D7E0]', MEASURE)}>
          A single benchmark is easy to target and easy to overfit. This index
          normalizes independent public leaderboards onto one scale, discounts
          each score by the uncertainty its publisher reports, shrinks thin
          evidence, and weights the rest by a scheme published beside the table
          — overall, and per domain.
        </p>
        <dl className="text-caption flex flex-wrap gap-x-6 gap-y-1 text-[#78758A]">
          <div>
            <dt className="inline">Updated </dt>
            <dd className="inline text-[#D9D7E0]">{updated}</dd>
          </div>
          <div>
            <dt className="inline">Boards </dt>
            <dd className="inline text-[#D9D7E0]">{boards.length}</dd>
          </div>
          <div>
            <dt className="inline">Measures </dt>
            <dd className="inline text-[#D9D7E0]">{benchmarks.length}</dd>
          </div>
          <div>
            <dt className="inline">Domains </dt>
            <dd className="inline text-[#D9D7E0]">{domains.length}</dd>
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
        <main className="min-w-0">
          <IndexTable
            models={models}
            benchmarks={benchmarks}
            scores={scores}
          />
        </main>

        <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-24">
          <Card title="Weighting — Overall index">
            <ol className="flex flex-col gap-3">
              {WEIGHTING.filter((w) => w.overall).map((w) => {
                const b = boardById.get(w.benchmarkId);
                if (!b) return null;
                return (
                  <li key={w.benchmarkId}>
                    <div className="mb-1 flex items-center gap-2">
                      <SourceBadge
                        board={b}
                        present
                      />
                      <b className="text-body-sm font-semibold text-white">
                        {b.headline.name}
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
              Set by PublicAI; stated so it can be disagreed with. A board’s
              category figures (LiveBench publishes seven) shape only their own
              domain column.
            </p>
          </Card>

          <Card title="Sources">
            <ul className="flex flex-col gap-3">
              {boards.map((b) => (
                <li key={b.id}>
                  <div className="mb-0.5 flex flex-wrap items-baseline gap-x-2">
                    <a
                      href={b.headline.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-sm font-semibold text-white underline underline-offset-2">
                      {b.headline.name}
                    </a>
                    <span className="text-micro ml-auto text-[#78758A]">
                      read {b.headline.retrievedAt}
                    </span>
                  </div>
                  <p className="text-micro text-p1">
                    {[
                      ...new Set(b.measures.map((m) => domainLabel(m.domain))),
                    ].join(' · ')}
                  </p>
                  {b.headline.snapshot ? (
                    <p className="text-micro text-g2">{b.headline.snapshot}</p>
                  ) : null}
                  {b.headline.caveat ? (
                    <p className="text-micro text-[#78758A]">
                      {b.headline.caveat}
                    </p>
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
