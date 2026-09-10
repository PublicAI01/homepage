import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { cn } from '@/utils';

import BadgeCopy from '../../components/badge-copy';
import {
  describeIndex,
  modelStandings,
  type Standing,
} from '../../lib/query';

const INDEX_URL = 'https://publicai.io/model-index';
const ONE_LINER =
  'The LLM benchmark aggregator — the world’s most comprehensive and robust LLM index.';

const PANEL = 'rounded-xl border border-[#2C2C31] bg-white/[0.045]';

/** "2026-09-10" → "10 Sep 2026". A card is read, not parsed. */
const shortDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
const LABEL = 'text-micro tracking-[0.14em] text-[#78758A] uppercase';

const load = async (params: Promise<{ id: string }>) => {
  const { id } = await params;
  const found = modelStandings(decodeURIComponent(id));
  return 'error' in found ? null : found;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const found = await load(params);
  if (!found) return { title: 'Model not found — PublicAI Index' };
  const { model, standings } = found;
  const best = standings[0];
  const title = `${model.name} — PublicAI Index`;
  const description = best
    ? `${model.name} (${model.org}) across ${standings.length} domains on the PublicAI Index: #${best.position} of ${best.total} in ${best.scope}. Every figure traceable to its publisher.`
    : `${model.name} (${model.org}) on the PublicAI Index.`;
  return {
    title,
    description,
    alternates: { canonical: `${INDEX_URL}/m/${model.id}` },
    openGraph: {
      title,
      description,
      url: `${INDEX_URL}/m/${model.id}`,
      siteName: 'PublicAI',
      type: 'article',
    },
  };
}

/** Where a model sits, at a glance. The number is the point; the rest is caption. */
const Placement = ({ s }: { s: Standing }) => (
  <div className={cn(PANEL, 'flex flex-col gap-0.5 px-3 py-2.5')}>
    <div className="flex items-baseline gap-1.5">
      <span
        className={cn(
          'font-mono text-xl leading-none font-bold',
          s.position <= 3 ? 'text-[#B08BFF]' : 'text-white',
        )}>
        #{s.position}
      </span>
      <span className="font-mono text-xs text-[#8E8BA0]">of {s.total}</span>
      <span className="ml-auto font-mono text-xs text-[#8E8BA0]">
        {s.score}
        {!s.rankedInScope ? <span className="text-[#E8A9F0]"> ✱</span> : null}
      </span>
    </div>
    <div
      className="truncate text-sm leading-tight text-[#D9D7E0]"
      title={s.scope}>
      {s.scope}
      {s.level === 'category' ? (
        <span className="text-[#78758A]"> · category</span>
      ) : null}
    </div>
  </div>
);

/**
 * Distance from par, not distance from zero.
 *
 * Every score on this scale lands between about 40 and 75, so a 0–100 bar
 * left every model looking half full and told a reader nothing — the chart
 * was decoration. 50 is not an arbitrary axis crop: it is the definition of
 * the scale, the average of the models each source lists. Measuring from it
 * turns a 15-point spread into the width of the panel, and the direction
 * carries the meaning a length alone could not.
 */
const SPAN = 30;

const Bar = ({ score, subject }: { score: number; subject: boolean }) => {
  const d = Math.max(-SPAN, Math.min(SPAN, score - 50));
  return (
    <span className="relative block h-2 w-full overflow-hidden rounded-sm bg-[#17171B]">
      <span
        className={cn(
          'absolute inset-y-0 rounded-sm',
          subject
            ? 'bg-gradient-to-r from-[#7C5CFF] to-[#B08BFF]'
            : d >= 0
              ? 'bg-[#3E3E48]'
              : 'bg-[#332F3A]',
        )}
        style={
          d >= 0
            ? { left: '50%', width: `${(d / SPAN) * 50}%` }
            : { right: '50%', width: `${(-d / SPAN) * 50}%` }
        }
      />
      <span className="absolute inset-y-0 left-1/2 w-px bg-white/30" />
    </span>
  );
};

/**
 * One scope, one line.
 *
 * `#14 of 45` does not say whether that is close. The gap to the leader does:
 * twelve points back is out of reach, half a point is a coin toss. That was
 * the one thing the six neighbour panels knew that nothing else did, and it
 * fits here in a single column.
 */
const ProfileRow = ({ s, nested }: { s: Standing; nested?: boolean }) => {
  const gap = Math.round((s.leader.score - s.score) * 10) / 10;
  return (
    <div
      className={cn(
        'flex items-center gap-3 border-t border-white/6 py-1.5',
        nested ? 'pl-3 sm:pl-5' : 'font-semibold',
      )}>
      <span
        className={cn(
          'w-36 shrink-0 truncate text-[13px] sm:w-48',
          nested ? 'text-[#B9B7C4]' : 'text-white',
        )}
        title={s.scope}>
        {s.scope}
      </span>
      <span className="min-w-0 flex-1">
        <Bar
          score={s.score}
          subject
        />
      </span>
      <span className="w-10 shrink-0 text-right font-mono text-xs text-white">
        {s.score}
      </span>
      <span
        className="hidden w-16 shrink-0 text-right font-mono text-xs text-[#6E6C7A] sm:block"
        title={`Leader: ${s.leader.name} at ${s.leader.score}`}>
        {gap > 0 ? `−${gap}` : 'leads'}
      </span>
      <span
        className={cn(
          'w-20 shrink-0 text-right font-mono text-xs',
          s.position <= 3 ? 'text-[#B08BFF]' : 'text-[#8E8BA0]',
        )}>
        #{s.position}
        <span className="text-[#6E6C7A]">/{s.total}</span>
        {!s.rankedInScope ? <span className="text-[#E8A9F0]">✱</span> : null}
      </span>
    </div>
  );
};

export default async function ModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const found = await load(params);
  if (!found) notFound();
  const { model, standings, rivals, generatedAt } = found;
  // Three from each end, and never the same panel twice when there are few.
  const abovePar = standings.filter((s) => s.score > 50).length;
  const best = standings[0];
  const worst = standings[standings.length - 1];
  const beats = rivals.filter((r) => r.ahead / r.met < 0.5);
  const beaten = rivals.filter((r) => r.ahead / r.met > 0.5);
  const names = (rs: typeof rivals, n = 2) =>
    rs
      .slice(0, n)
      .map((r) => r.name)
      .join(' and ');

  const byCategory = new Map<string, Standing[]>();
  for (const s of standings) {
    const key = s.level === 'category' ? s.scope : (s.category ?? s.scope);
    byCategory.set(key, [...(byCategory.get(key) ?? []), s]);
  }
  const grouped = [...byCategory.entries()]
    .map(([c, rows]) => {
      const sorted = [...rows].sort(
        (a, b) =>
          Number(b.level === 'category') - Number(a.level === 'category') ||
          a.position - b.position,
      );
      return [c, sorted] as const;
    })
    .sort((a, b) => a[1][0].position - b[1][0].position);

  const day = generatedAt.slice(0, 10);
  const starred = standings.some((s) => !s.rankedInScope);
  const rankedTotal = describeIndex().counts.ranked;
  const badgeMarkdown = `[![PublicAI Index](${INDEX_URL}/badge?model=${model.id})](${INDEX_URL}/m/${model.id})`;
  const bySource = [
    ...model.figures
      .reduce(
        (m, f) => m.set(f.source, [...(m.get(f.source) ?? []), f]),
        new Map<string, typeof model.figures>(),
      )
      .entries(),
  ].sort(
    (a, b) =>
      Number(a[1][0].kind === 'report') - Number(b[1][0].kind === 'report'),
  );

  return (
    <div className="relative isolate before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-[#08080A]">
      <div className="container mx-auto max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
        {/* Branding, then the model. Nothing else competes for the top of a
            page someone opened to read one model's numbers. */}
        <header className="grid grid-cols-1 gap-8 pt-10 pb-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10 lg:pt-14">
          <div className="min-w-0">
            <Link
              href="/model-index"
              className={cn(LABEL, 'hover:text-[#B08BFF]')}>
              ‹ PublicAI Index
            </Link>
            <p className="text-caption mt-1 max-w-[60ch] text-[#9C9AA8]">
              {ONE_LINER}
            </p>

            <h1 className="text-display mt-6 font-bold text-white">
              {model.name}
            </h1>
            <p className="text-lede mt-2 text-[#D9D7E0]">
              {model.org}
              {model.size ? ` · ${model.size.label}` : ''}
              {model.catalog?.openWeights ? ' · open weights' : ''}
            </p>
            {best ? (
              <p className="text-lede mt-4 max-w-[72ch] text-[#D9D7E0]">
                Strongest in{' '}
                <b className="font-semibold text-white">{best.scope}</b> (#
                {best.position} of {best.total}), weakest in{' '}
                <b className="font-semibold text-white">{worst.scope}</b> (#
                {worst.position} of {worst.total}). Above par in {abovePar} of{' '}
                {standings.length} scopes.
                {beaten.length || beats.length ? (
                  <>
                    {' '}
                    Among the models it meets almost everywhere, it finishes
                    behind {beaten.length ? names(beaten) : 'none'}
                    {beats.length ? <> and ahead of {names(beats)}</> : null}.
                  </>
                ) : null}
              </p>
            ) : null}
          </div>

          {/* Counters do not explain themselves. "Scopes 34 · Figures 33"
              reads like a typo, "71" says nothing without a scale, and the
              number that decides whether to believe any of it — how many
              boards actually measured this model — was not on the card at
              all. Every line is a sentence now, and the evidence leads. */}
          <aside className={cn(PANEL, 'h-fit p-4')}>
            <p className={cn(LABEL, 'mb-3')}>This model</p>
            {model.index !== null ? (
              <>
                <p className="font-mono text-4xl leading-none font-bold text-[#B08BFF]">
                  {model.index}
                  <span className="text-xl text-[#4A4A52]"> / 100</span>
                </p>
                <p className="text-caption mt-1.5 text-[#9C9AA8]">
                  50 is average
                  {model.rank ? (
                    <>
                      {' · '}
                      <b className="font-semibold text-[#D9D7E0]">
                        #{model.rank}
                      </b>{' '}
                      of {rankedTotal}
                    </>
                  ) : null}
                </p>
              </>
            ) : (
              <>
                <p className="font-mono text-3xl leading-none font-bold text-white">
                  Not ranked
                </p>
                <p className="text-caption mt-1.5 text-[#E0B341]">
                  Only one publisher has scored it
                  {model.estimatedIndex
                    ? ` — looks like about ${model.estimatedIndex.score}`
                    : ''}
                </p>
              </>
            )}
            <dl className="text-caption mt-4 space-y-1.5 border-t border-white/8 pt-3">
              {[
                [
                  'Measured by',
                  `${model.covered} of ${model.coverable} boards`,
                ],
                ...(model.reports
                  ? ([
                      [
                        'Plus',
                        `${model.reports} one-off ${model.reports === 1 ? 'report' : 'reports'} ✱`,
                      ],
                    ] as const)
                  : []),
                ['Placed in', `${standings.length} domains`],
                ['Read on', shortDay(day)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-[#78758A]">{k}</dt>
                  <dd className="text-right text-[#D9D7E0]">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </header>

        {standings.length === 0 ? (
          <p className="text-lede pb-16 text-[#B9B7C4]">
            No source has published a figure for this model yet.
          </p>
        ) : (
          <>
            {/* The shape first. Twenty-three panels of equal weight gave a
                reader nowhere to start; one line per scope answers "what is
                this model good at" before anything asks for their attention. */}
            <section className="pb-10">
              <p className={cn(LABEL, 'mb-2')}>§ 1 · Profile</p>
              <h2 className="text-heading mb-1 font-bold text-white">
                What it is good at
              </h2>
              <p className="text-caption mb-4 max-w-[68ch] text-[#9C9AA8]">
                Bars run from 50 — the average of the models each source lists —
                so right of the line is above par. The middle column is the gap
                to whoever leads that scope.
              </p>
              {/* Categories are aggregates of the domains beneath them. A flat
                  list sorted by rank put "Coding · cat" between two of the
                  domains it is made of, which reads as though they were peers. */}
              <div className={cn(PANEL, 'px-4 py-2')}>
                {grouped.map(([category, rows]) => (
                  <div key={category}>
                    {rows.map((r) => (
                      <ProfileRow
                        key={`${r.level}:${r.scope}`}
                        s={r}
                        nested={r.level === 'domain'}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </section>

            {rivals.length ? (
              <section className="pb-10">
                <p className={cn(LABEL, 'mb-2')}>§ 2 · Head to head</p>
                <h2 className="text-heading mb-1 font-bold text-white">
                  What it beats, and what beats it
                </h2>
                <p className="text-caption mb-4 max-w-[68ch] text-[#9C9AA8]">
                  The same models turn up scope after scope. Counted once: where
                  both were placed, who finished higher. Bars run right for{' '}
                  {model.name}, left for the other.
                </p>
                <div className={cn(PANEL, 'px-4 py-2')}>
                  {[...rivals].reverse().map((r) => {
                    const won = r.met - r.ahead;
                    const pct = (won / r.met) * 100 - 50;
                    return (
                      <div
                        key={r.id}
                        className="flex items-center gap-3 border-t border-white/6 py-1.5 first:border-0">
                        <a
                          href={`/model-index/m/${r.id}`}
                          className="w-40 shrink-0 truncate text-[13px] text-[#D9D7E0] hover:text-[#B08BFF] sm:w-52"
                          title={`${r.name} — ${r.org}`}>
                          {r.name}
                        </a>
                        <span className="relative block h-2 min-w-0 flex-1 overflow-hidden rounded-sm bg-[#17171B]">
                          <span
                            className={cn(
                              'absolute inset-y-0 rounded-sm',
                              pct >= 0
                                ? 'bg-gradient-to-r from-[#7C5CFF] to-[#B08BFF]'
                                : 'bg-[#3E3E48]',
                            )}
                            style={
                              pct >= 0
                                ? { left: '50%', width: `${pct}%` }
                                : { right: '50%', width: `${-pct}%` }
                            }
                          />
                          <span className="absolute inset-y-0 left-1/2 w-px bg-white/30" />
                        </span>
                        <span className="w-32 shrink-0 text-right font-mono text-xs text-[#6E6C7A]">
                          <span
                            className={
                              won > r.ahead
                                ? 'text-[#B08BFF]'
                                : 'text-[#8E8BA0]'
                            }>
                            won {won}
                          </span>
                          {' · '}
                          <span className="text-[#8E8BA0]">lost {r.ahead}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </>
        )}

        <section className="pb-10">
          <p className={cn(LABEL, 'mb-2')}>§ 3 · Sources</p>
          <h2 className="text-heading mb-1 font-bold text-white">
            Where the numbers come from
          </h2>
          <p className="text-caption mb-4 max-w-[68ch] text-[#9C9AA8]">
            {bySource.length}{' '}
            {bySource.length === 1 ? 'publication' : 'publications'},{' '}
            {model.figures.length} figures. Every one links to the page it was
            read from.
          </p>
          {/* One block per publication, not one row per number. Seventeen
              measures from a single launch post are one source that published
              seventeen times — listing it seventeen times says the opposite. */}
          <div className="flex flex-col gap-3">
            {bySource.map(([source, figures]) => (
              <div
                key={source}
                className={cn(PANEL, 'px-4 py-3')}>
                <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <a
                    href={figures[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-white hover:text-[#B08BFF]">
                    {figures[0].kind === 'report' ? (
                      <span
                        className="text-[#E8A9F0]"
                        title={
                          figures[0].independent
                            ? 'A one-off publication by someone with no stake in the result'
                            : 'Published by the model’s own maker'
                        }>
                        {figures[0].independent ? '✱ ' : '✱✱ '}
                      </span>
                    ) : null}
                    {source} ↗
                    {figures[0].kind === 'report' && !figures[0].independent ? (
                      <span className="text-micro ml-2 font-normal text-[#E0B341]">
                        the model’s own publisher
                      </span>
                    ) : null}
                  </a>
                  <span className={LABEL}>
                    {figures.length}{' '}
                    {figures.length === 1 ? 'measure' : 'measures'}
                  </span>
                  <span className="text-micro ml-auto text-[#6E6C7A]">
                    read {figures[0].retrievedAt.slice(0, 10)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {figures.map((f, i) => (
                    <span
                      key={`${f.measure}:${i}`}
                      className="text-[13px] text-[#9C9AA8]">
                      {f.measure}{' '}
                      <b className="font-mono font-medium text-[#D9D7E0]">
                        {f.rawLabel}
                      </b>
                      {f.scaffold ? (
                        <span className="text-[#6E6C7A]"> ({f.scaffold})</span>
                      ) : null}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* For whoever publishes this model: the badge reads live, so a
            README pasted once stays current. */}
        <section className="pb-10">
          <p className={cn(LABEL, 'mb-2')}>Badge</p>
          <div
            className={cn(
              PANEL,
              'flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3',
            )}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/model-index/badge?model=${model.id}`}
              alt={`PublicAI Index badge for ${model.name}`}
              className="h-5"
            />
            <code className="text-micro min-w-0 flex-1 truncate font-mono text-[#8E8BA0]">
              {badgeMarkdown}
            </code>
            <BadgeCopy markdown={badgeMarkdown} />
          </div>
        </section>

        <footer className="text-micro border-t border-white/8 py-8 text-[#6E6C7A]">
          {starred ? (
            <p className="mb-2">
              <span className="text-[#E8A9F0]">✱</span> Placed by a one-off
              publication, not a board that re-ran the model.{' '}
              <span className="text-[#E8A9F0]">✱✱</span> marks a figure the
              model’s own publisher printed, which counts for less again. Scores are 0–100 on the PublicAI Index scale, 50 = the
              average of the models each source lists. Scores belong to their
              publishers.
            </p>
          ) : null}
          <p>
            Snapshot {day} ·{' '}
            <Link
              href="/model-index"
              className="hover:text-[#B08BFF]">
              the full index
            </Link>{' '}
            ·{' '}
            <a
              href={`${INDEX_URL}/api`}
              className="hover:text-[#B08BFF]"
              target="_blank"
              rel="noreferrer">
              JSON API
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
