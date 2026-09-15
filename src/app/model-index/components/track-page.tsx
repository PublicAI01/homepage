import Link from 'next/link';
import { Suspense } from 'react';

import { cn } from '@/utils';

import { groupBoards } from '../lib/boards';
import type { TrackInfo } from '../lib/tracks';
import { domainLabel } from '../lib/weights';
import IndexTable, { SourceBadge } from './index-table';

/**
 * The listing page for a generation track — image, video — on the text
 * index's table with the track's own snapshot and Overall. Leaner than the
 * text page on purpose: no method essay, no weekly, no MCP card. Those
 * belong to the index as a whole, and the text page says them once.
 */
const PANEL = 'rounded-xl border border-[#2C2C31] bg-white/[0.045]';
const LABEL = 'text-micro tracking-[0.14em] text-[#78758A] uppercase';
const MEASURE = 'max-w-[68ch]';

const shortDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function TrackPage({ track }: { track: TrackInfo }) {
  const { index } = track;
  const { counts, overallWeighting, generatedAt } = index.describeIndex();
  const data = index.data;
  const boards = groupBoards(data.benchmarks).filter(
    (s) => s.kind !== 'report',
  );

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <header className="grid grid-cols-1 gap-8 pt-10 pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:pt-14">
          <div className="min-w-0">
            <Link
              href="/model-index"
              className={cn(LABEL, 'hover:text-[#B08BFF]')}>
              ‹ PublicAI Index
            </Link>
            <h1 className="text-display mt-2 font-bold text-white">
              {track.title}
            </h1>
            <p className={cn('text-g2 text-lede mt-3', MEASURE)}>
              {track.lede}
            </p>
            <p className={cn('text-caption mt-4 text-[#9C9AA8]', MEASURE)}>
              Every figure is a blind human vote a publisher collected and
              printed; PublicAI standardizes and weights them. Overall ranks a{' '}
              {track.noun} once both arenas have scored it; a column ranks any{' '}
              {track.noun} a recognised arena measured there.
            </p>
          </div>
          <aside className={cn(PANEL, 'self-start p-4')}>
            <p className={cn(LABEL, 'mb-3')}>This snapshot</p>
            <dl className="text-caption grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-[#78758A]">Updated</dt>
              <dd className="font-mono text-white">
                {shortDay(generatedAt.slice(0, 10))}
              </dd>
              <dt className="text-[#78758A]">Models</dt>
              <dd className="font-mono text-white">{counts.models}</dd>
              <dt className="text-[#78758A]">Ranked</dt>
              <dd className="font-mono text-white">{counts.ranked}</dd>
              <dt className="text-[#78758A]">Arenas</dt>
              <dd className="font-mono text-white">{counts.boards}</dd>
            </dl>
            <p className={cn(LABEL, 'mt-4 mb-2')}>Overall weighting</p>
            <ul className="text-caption flex flex-col gap-1">
              {overallWeighting.map((w) => (
                <li
                  key={w.source}
                  className="flex items-baseline justify-between gap-3"
                  title={w.rationale}>
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-[#D9D7E0] underline underline-offset-2">
                    {w.source}
                  </a>
                  <span className="font-mono text-white">{w.weight}%</span>
                </li>
              ))}
            </ul>
          </aside>
        </header>

        <div
          className="border-t border-white/8 pt-8"
          id="index">
          <p className={cn(LABEL, 'mb-3')}>§ 1 · Ranking</p>
          <Suspense>
            <IndexTable
              models={data.models}
              benchmarks={data.benchmarks}
              scores={data.scores}
              catalogs={data.catalogs}
              generatedAt={generatedAt}
              newcomers={{ ids: [], from: '', until: '' }}
              headline={index.headlineTaxonomy()}
              track={{ base: track.base, weighting: track.weighting }}
            />
          </Suspense>
        </div>

        <section
          className="border-t border-white/8 py-12 lg:py-14"
          id="sources">
          <p className={cn(LABEL, 'mb-2')}>§ 2</p>
          <h2 className="text-heading mb-2 font-bold text-white">Sources</h2>
          <p className={cn('text-g2 text-lede mb-6', MEASURE)}>
            Blind-vote arenas, each run by its publisher. Every figure links to
            the page it was read from.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {boards.map((b) => (
              <article
                key={b.id}
                className={cn(PANEL, 'p-4')}>
                <div className="mb-1 flex items-center gap-2">
                  <SourceBadge
                    source={b}
                    present
                  />
                  <a
                    href={b.headline.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm font-semibold text-white underline underline-offset-2">
                    {b.name}
                  </a>
                  <span className="text-micro ml-auto text-[#78758A]">
                    read {b.headline.retrievedAt}
                  </span>
                </div>
                <p className="text-micro text-p1 mb-1">
                  {[
                    ...new Set(b.measures.map((m) => domainLabel(m.domain))),
                  ].join(' · ')}
                </p>
                {b.headline.caveat ? (
                  <p
                    className="text-micro mt-1 line-clamp-3 text-[#78758A]"
                    title={b.headline.caveat}>
                    {b.headline.caveat}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <footer className="text-micro border-t border-white/8 py-8 text-[#6E6C7A]">
          <p>
            Scores are 0–100 on the PublicAI Index scale, 50 = the average of
            the models each arena lists; standardized the same way as the text
            index, method on{' '}
            <Link
              href="/model-index#method"
              className="hover:text-[#B08BFF]">
              the index page
            </Link>
            . Scores belong to their publishers.
          </p>
        </footer>
      </div>
    </div>
  );
}
