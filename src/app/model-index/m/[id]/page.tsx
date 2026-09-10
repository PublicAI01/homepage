import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { cn } from '@/utils';

import BadgeCopy from '../../components/badge-copy';
import { modelStandings, type Standing } from '../../lib/query';

const INDEX_URL = 'https://publicai.io/model-index';
const ONE_LINER =
  'The LLM benchmark aggregator — the world’s most comprehensive and robust LLM index.';

const PANEL = 'rounded-xl border border-[#2C2C31] bg-white/[0.045]';
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
    <div className="truncate text-sm leading-tight text-[#D9D7E0]" title={s.scope}>
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

/** One scope, one line: the shape of a model across everything it was measured on. */
const ProfileRow = ({ s }: { s: Standing }) => (
  <div className="flex items-center gap-3 border-t border-white/6 py-1.5 first:border-0">
    <span
      className="w-40 shrink-0 truncate text-[13px] text-[#D9D7E0] sm:w-52"
      title={s.scope}>
      {s.scope}
      {s.level === 'category' ? (
        <span className="text-[#6E6C7A]"> · cat</span>
      ) : null}
    </span>
    <span className="min-w-0 flex-1">
      <Bar score={s.score} subject />
    </span>
    <span className="w-10 shrink-0 text-right font-mono text-xs text-white">
      {s.score}
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

/** A scope in full: the leader for scale, then the models either side. */
const Board = ({ s }: { s: Standing }) => (
  <div className={cn(PANEL, 'px-3.5 py-3')}>
    <div className="mb-2 flex items-baseline gap-2">
      <span
        className="truncate text-sm font-semibold text-white"
        title={s.scope}>
        {s.scope}
      </span>
      <span className="ml-auto shrink-0 font-mono text-xs text-[#8E8BA0]">
        #{s.position} of {s.total}
        {!s.rankedInScope ? <span className="text-[#E8A9F0]"> ✱</span> : null}
      </span>
    </div>
    {s.peers.map((p, i) => (
      <div key={p.id}>
        {i > 0 && p.position > s.peers[i - 1].position + 1 ? (
          <div className="py-0.5 pl-5 font-mono text-[11px] leading-none text-[#5E5C6A]">
            ⋮
          </div>
        ) : null}
        <div className="flex items-center gap-2 py-px">
          <span
            className={cn(
              'w-5 shrink-0 text-right font-mono text-[11px]',
              p.isSubject ? 'text-[#B08BFF]' : 'text-[#6E6C7A]',
            )}>
            {p.position}
          </span>
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-[13px]',
              p.isSubject ? 'font-semibold text-white' : 'text-[#B9B7C4]',
            )}
            title={`${p.name} — ${p.org}`}>
            {p.name}
          </span>
          <span className="hidden w-24 shrink-0 sm:block">
            <Bar score={p.score} subject={p.isSubject} />
          </span>
          <span
            className={cn(
              'w-9 shrink-0 text-right font-mono text-[11px]',
              p.isSubject ? 'text-white' : 'text-[#8E8BA0]',
            )}>
            {p.score}
          </span>
        </div>
      </div>
    ))}
  </div>
);

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
    rs.slice(0, n).map((r) => r.name).join(' and ');

  const ends = [
    ...standings.slice(0, 3),
    ...standings.slice(-3).filter((s) => !standings.slice(0, 3).includes(s)),
  ];
  const day = generatedAt.slice(0, 10);
  const starred = standings.some((s) => !s.rankedInScope);
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
        <header className="pt-10 pb-8 lg:pt-14">
          <Link
            href="/model-index"
            className={cn(LABEL, 'hover:text-[#B08BFF]')}>
            PublicAI Index
          </Link>
          <p className="text-lede mt-1 max-w-[60ch] text-[#B9B7C4]">
            {ONE_LINER}
          </p>

          <h1 className="text-display mt-8 font-bold text-white">
            {model.name}
          </h1>
          <p className="text-lede mt-2 text-[#D9D7E0]">
            {model.org}
            {model.size ? ` · ${model.size.label}` : ''}
            {model.catalog?.openWeights ? ' · open weights' : ''}
          </p>
          {best ? (
            <p className="text-lede mt-5 max-w-[72ch] text-[#D9D7E0]">
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
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm">
            {model.index !== null ? (
              <span className="text-white">
                Overall <b className="text-[#B08BFF]">{model.index}</b>
                {model.rank ? (
                  <span className="text-[#8E8BA0]"> · rank #{model.rank}</span>
                ) : null}
              </span>
            ) : (
              <span className="text-[#E0B341]">
                Provisional — fewer than 2 independent publishers
                {model.estimatedIndex
                  ? `, estimated ~${model.estimatedIndex.score}✱`
                  : ''}
              </span>
            )}
            <span className="text-[#8E8BA0]">
              {model.covered} of {model.coverable} boards
              {model.reports ? ` · ${model.reports} reports ✱` : ''}
            </span>
          </p>
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
                Across {standings.length}{' '}
                {standings.length === 1 ? 'scope' : 'scopes'}, best first
              </h2>
              <p className="text-caption mb-4 max-w-[68ch] text-[#9C9AA8]">
                Bars run from 50 — the average of the models each source lists
                — so right of the line is above par and left is below.
              </p>
              <div className={cn(PANEL, 'px-4 py-2')}>
                {standings.map((s) => (
                  <ProfileRow key={`${s.level}:${s.scope}`} s={s} />
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
                  The same models turn up scope after scope. Counted once:
                  where both were placed, who finished higher. Bars run right
                  for {model.name}, left for the other.
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
                              won > r.ahead ? 'text-[#B08BFF]' : 'text-[#8E8BA0]'
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

            {/* Detail last: by here a reader knows what to look at. Both ends
                named as such, because showing only the best three would be a
                brochure. */}
            <section className="pb-10">
              <p className={cn(LABEL, 'mb-2')}>§ 3 · Best and weakest</p>
              <h2 className="text-heading mb-1 font-bold text-white">
                Who it sits beside
              </h2>
              <p className="text-caption mb-4 max-w-[68ch] text-[#9C9AA8]">
                The leader of each scope for scale, then the models immediately
                above and below.
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {ends.map((s) => (
                  <Board key={`${s.level}:${s.scope}`} s={s} />
                ))}
              </div>
            </section>
          </>
        )}

        <section className="pb-10">
          <p className={cn(LABEL, 'mb-2')}>§ 4 · Sources</p>
          <h2 className="text-heading mb-4 font-bold text-white">
            {bySource.length} {bySource.length === 1 ? 'source' : 'sources'},{' '}
            {model.figures.length} figures
          </h2>
          {/* One block per publication, not one row per number. Seventeen
              measures from a single launch post are one source that published
              seventeen times — listing it seventeen times says the opposite. */}
          <div className="flex flex-col gap-3">
            {bySource.map(([source, figures]) => (
              <div key={source} className={cn(PANEL, 'px-4 py-3')}>
                <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <a
                    href={figures[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-white hover:text-[#B08BFF]">
                    {figures[0].kind === 'report' ? (
                      <span className="text-[#E8A9F0]">✱ </span>
                    ) : null}
                    {source} ↗
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
          <p className={cn(LABEL, 'mb-2')}>§ 5 · Badge</p>
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
              <span className="text-[#E8A9F0]">✱</span> Placed by report figures
              — a launch post or blog, not a recognised board that re-ran the
              model. Scores are 0–100 on the PublicAI Index scale, 50 = the
              average of the models each source lists. Scores belong to their
              publishers.
            </p>
          ) : null}
          <p>
            Snapshot {day} ·{' '}
            <Link href="/model-index" className="hover:text-[#B08BFF]">
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
