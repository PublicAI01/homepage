import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { cn } from '@/utils';

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
  <div className={cn(PANEL, 'flex flex-col gap-1.5 p-4')}>
    <div className="flex items-baseline gap-2">
      <span
        className={cn(
          'font-mono text-3xl leading-none font-bold',
          s.position <= 3 ? 'text-[#B08BFF]' : 'text-white',
        )}>
        #{s.position}
      </span>
      <span className="font-mono text-sm text-[#8E8BA0]">of {s.total}</span>
      {!s.rankedInScope ? (
        <span
          className="ml-auto text-[#E8A9F0]"
          title="Placed by report ✱ figures — a launch post or blog, not a board that re-ran the model">
          ✱
        </span>
      ) : null}
    </div>
    <div className="text-base leading-tight font-semibold text-white">
      {s.scope}
    </div>
    <div className="font-mono text-xs text-[#8E8BA0]">
      score {s.score}
      {s.level === 'category' ? ' · category' : ''}
    </div>
  </div>
);

/** The head of a scope, and the model in it. Bars are the 0–100 index scale. */
const Board = ({ s }: { s: Standing }) => (
  <div className={cn(PANEL, 'p-4')}>
    <div className="mb-2 flex items-baseline gap-2">
      <span className="text-base font-semibold text-white">{s.scope}</span>
      <span className="ml-auto font-mono text-xs text-[#8E8BA0]">
        #{s.position} of {s.total}
        {!s.rankedInScope ? <span className="text-[#E8A9F0]"> ✱</span> : null}
      </span>
    </div>
    {s.peers.map((p, i) => (
      <div key={p.id}>
        {i > 0 && p.position > s.peers[i - 1].position + 1 ? (
          <div className="pl-6 font-mono text-xs text-[#4A4A52]">…</div>
        ) : null}
        <div className="flex items-center gap-2.5 py-0.5">
          <span
            className={cn(
              'w-6 font-mono text-xs',
              p.isSubject ? 'text-[#B08BFF]' : 'text-[#6E6C7A]',
            )}>
            {p.position}
          </span>
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-sm',
              p.isSubject ? 'font-semibold text-white' : 'text-[#B9B7C4]',
            )}>
            {p.name}
          </span>
          <span className="hidden h-[7px] w-20 shrink-0 overflow-hidden rounded-full bg-[#232329] sm:block">
            <span
              className={cn(
                'block h-full rounded-full',
                p.isSubject
                  ? 'bg-gradient-to-r from-[#7C5CFF] to-[#B08BFF]'
                  : 'bg-[#3A3A42]',
              )}
              style={{ width: `${Math.max(6, Math.min(100, p.score))}%` }}
            />
          </span>
          <span
            className={cn(
              'w-10 shrink-0 text-right font-mono text-xs',
              p.isSubject ? 'text-white' : 'text-[#B9B7C4]',
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
  const { model, standings, generatedAt } = found;
  const day = generatedAt.slice(0, 10);
  const starred = standings.some((s) => !s.rankedInScope);

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
            <section className="pb-10">
              <p className={cn(LABEL, 'mb-2')}>§ 1 · Where it ranks</p>
              <h2 className="text-heading mb-5 font-bold text-white">
                {standings.length}{' '}
                {standings.length === 1 ? 'domain' : 'domains'} with a published
                figure
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {standings.map((s) => (
                  <Placement key={`${s.level}:${s.scope}`} s={s} />
                ))}
              </div>
            </section>

            <section className="pb-10">
              <p className={cn(LABEL, 'mb-2')}>§ 2 · Domain by domain</p>
              <h2 className="text-heading mb-5 font-bold text-white">
                Who it sits beside
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {standings.map((s) => (
                  <Board key={`${s.level}:${s.scope}`} s={s} />
                ))}
              </div>
            </section>
          </>
        )}

        <section className="pb-10">
          <p className={cn(LABEL, 'mb-2')}>§ 3 · Sources</p>
          <div className={cn(PANEL, 'divide-y divide-white/8')}>
            {model.figures.map((f, i) => (
              <a
                key={`${f.source}:${f.measure}:${i}`}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 hover:bg-white/4">
                <span className="text-sm text-white">
                  {f.kind === 'report' ? (
                    <span className="text-[#E8A9F0]">✱ </span>
                  ) : null}
                  {f.source}
                </span>
                <span className="text-sm text-[#8E8BA0]">{f.measure}</span>
                <span className="ml-auto font-mono text-sm text-[#B9B7C4]">
                  {f.rawLabel}
                </span>
              </a>
            ))}
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
