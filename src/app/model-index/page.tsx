import type { Metadata } from 'next';
import { Suspense } from 'react';

import { INDEX_TWITTER_LINK, LINKEDIN_LINK } from '@/constant';
import { cn } from '@/utils';

import IndexTable, { SourceBadge } from './components/index-table';
import { LinkedInMark, XMark } from './components/social-marks';
import {
  benchmarks,
  catalogs,
  excluded,
  generatedAt,
  models,
  scores,
} from './data';
import { groupBoards } from './lib/boards';
import { API_URL, MCP_URL } from './lib/query';
import { SIZE_TIERS } from './lib/size';
import { decodeView, encodeView, rankName } from './lib/view-state';
import {
  categoryRank,
  domainLabel,
  REPORT_WEIGHT,
  SOURCE_LOGO,
  WEIGHTING,
} from './lib/weights';

const INDEX_URL = 'https://publicai.io/model-index';

/** Where to follow the Index. The site's floating rail and footer row stand aside on this page. */
const FOLLOW = [
  { label: 'X', href: INDEX_TWITTER_LINK, Icon: XMark },
  { label: 'LinkedIn', href: LINKEDIN_LINK, Icon: LinkedInMark },
];

/**
 * A shared link carries its filters; the title, description and card image
 * follow them, so a post about "Tool use · Large" previews that view.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const raw = await searchParams;
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(raw))
    if (typeof v === 'string') p.set(k, v);
  const view = decodeView(p);
  const filtered = p.toString().length > 0;
  const scope = rankName(view.rank);
  const tier = SIZE_TIERS.find((t) => t.id === view.size);
  const what = filtered
    ? `${scope}${tier ? ` · ${tier.label}` : ''}${view.family !== 'all' ? ` · ${view.family}` : ''}`
    : null;
  const title = what
    ? `${what} — PublicAI Index`
    : 'PublicAI Index — the LLM benchmark aggregator';
  const description = what
    ? `Top models by ${scope} on the PublicAI Index, a composite of recognised public leaderboards. Scores standardized onto one scale, every figure traceable to its publisher.`
    : 'The world’s most comprehensive and robust LLM index, built from everyone’s benchmarks and none of our own. Scores from recognised public leaderboards, standardized onto one scale, with launch-post figures marked ✱. Queryable by agents over MCP.';
  const query = encodeView(view).toString();
  const url = query ? `${INDEX_URL}?${query}` : INDEX_URL;
  const image = `${INDEX_URL}/og${query ? `?${query}` : ''}`;
  return {
    title,
    description,
    keywords:
      'LLM leaderboard aggregate, LLM benchmark aggregator, model evaluation index, LMArena, Artificial Analysis, Terminal-Bench, ARC-AGI, LiveBench, benchmark normalization, MCP server, PublicAI',
    openGraph: {
      title,
      description,
      url,
      siteName: 'PublicAI',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

const PANEL = 'rounded-xl border border-[#2C2C31] bg-white/[0.045]';
const MEASURE = 'max-w-[68ch]';
const LABEL = 'text-micro tracking-[0.14em] text-[#78758A] uppercase';

const updated = new Date(generatedAt).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const sources = groupBoards(benchmarks);
const boards = sources.filter((s) => s.kind !== 'report');
const reports = sources.filter((s) => s.kind === 'report');
const sourceById = new Map(sources.map((s) => [s.id, s]));
const domains = [...new Set(benchmarks.map((b) => b.domain))];
const categories = [...new Set(benchmarks.map((b) => b.category))].sort(
  (a, b) => categoryRank(a) - categoryRank(b),
);
const callable = models.filter((m) => m.access?.openrouter).length;

const method = [
  {
    title: 'Standardize, discount uncertainty',
    text: 'Every figure is z-scored across the models its source lists and mapped to 0–100, so an Elo and a pass rate share one scale. Where a publisher prints an error bar, the figure counts for less.',
  },
  {
    title: 'Shrink, never impute',
    text: 'A missing figure is left missing. Thin evidence is pulled toward 50, so one generous board cannot lift a barely-tested model.',
  },
  {
    title: 'Weight by a published scheme',
    text: 'Each board’s share of the Overall index is fixed and printed beside the table, with its reason.',
  },
  {
    title: 'Two publishers to rank',
    text: 'Overall ranks a model once boards from two independent publishers have scored it. A domain ranks on its own board evidence.',
  },
  {
    title: 'Reports ✱ stay out of the headline',
    text: 'Launch posts and blogs shape domain columns at a tenth of a board’s weight, never the Overall index.',
  },
  {
    title: 'Estimate the rest, and say so',
    text: 'A model with no Overall score is placed among models that have one and shown as ~55✱ — never ranked.',
  },
];

const limits = [
  {
    title: 'Effort tiers are matched by rule',
    text: 'The highest tier a source publishes is indexed; the exact label is kept beside the score.',
  },
  {
    title: 'Some boards score a scaffold',
    text: 'Terminal-Bench results are a model plus an agent framework; the framework is named beside the score.',
  },
  {
    title: 'Identity is inferred from names',
    text: 'Seven sources spell one model seven ways. Every merge is logged; a wrong one is possible.',
  },
  {
    title: 'Report figures are the publisher’s',
    text: 'Competitor numbers in a launch post may be copied, not re-run. They are marked, not laundered.',
  },
  {
    title: 'Sizes are what makers disclose',
    text: 'Counted from open weights or read from the name; a closed model is undisclosed, not small.',
  },
  {
    title: 'A snapshot, not a live feed',
    text: 'Read from each publisher on the date shown. Check the source before acting on a number.',
  },
];

const mcpConfig = `{ "mcpServers": { "publicai-index": { "url": "${MCP_URL}" } } }`;

const snapshotDate = generatedAt.slice(0, 10);
const citation = `PublicAI Foundation (${snapshotDate.slice(0, 4)}). PublicAI Index, snapshot ${snapshotDate}. https://publicai.io/model-index`;

const Card = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={cn(PANEL, 'p-4', className)}>
    <h2 className={cn(LABEL, 'mb-3')}>{title}</h2>
    {children}
  </section>
);

const SectionHead = ({
  n,
  title,
  lede,
}: {
  n: string;
  title: string;
  lede: React.ReactNode;
}) => (
  <>
    <p className={cn(LABEL, 'mb-2')}>§ {n}</p>
    <h2 className="text-heading mb-2 font-bold text-white">{title}</h2>
    <p className={cn('text-g2 text-lede mb-6', MEASURE)}>{lede}</p>
  </>
);

export default function ModelIndex() {
  return (
    // `isolate` + the full-bleed pseudo-element lay a solid ground over the
    // site's animated grid, so a page made of numbers reads like a paper,
    // not a poster.
    <div className="relative isolate before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-[#08080A]">
      <div className="container mx-auto max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
        {/* ===================== HEADER ===================== */}
        <header className="grid grid-cols-1 gap-8 pt-10 pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:pt-14 lg:pb-10">
          {/* Left: the name, the promise, the case. Right: the numbers, in a
              panel the width of the sidebar below, so the two columns line
              up and the page reads as one grid from the top. */}
          <div className="min-w-0">
            <h1 className="text-display mb-3 font-bold text-white">
              PublicAI Index
            </h1>
            <p className="text-subheading mb-5 max-w-[60ch] font-semibold text-[#B9B7C4]">
              The LLM benchmark aggregator — the world’s most comprehensive and
              robust LLM index, built from everyone’s benchmarks and none of our
              own.
            </p>
            <p className="text-lede max-w-[90ch] text-[#D9D7E0]">
              Model evaluation has fragmented into dozens of leaderboards, and a
              single benchmark is easy to target: topping one board says little
              about the next. PublicAI runs no evaluations of its own. It
              aggregates the public ones by statistical method — one scale,
              discounted by published uncertainty, shrunk where evidence is
              thin, weighted by a scheme printed beside the table — into an
              index no single benchmark can be tuned to, overall and by domain.
              Launch posts and blogs are indexed too, marked ✱ and kept out of
              the headline. Agents get the same answers over MCP and a JSON API,
              every score with its sources.
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className={LABEL}>Follow PublicAI Index</span>
              {FOLLOW.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="external noreferrer"
                  aria-label={`PublicAI on ${label}`}
                  title={label}
                  className="text-g1 inline-flex size-8 items-center justify-center rounded-md border border-white/12 transition-colors hover:border-white/30 hover:text-white">
                  <Icon className="size-4" />
                </a>
              ))}
            </p>
          </div>

          <aside className={cn(PANEL, 'self-start p-4 lg:mt-2')}>
            <h2 className={cn(LABEL, 'mb-3')}>This snapshot</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                ['Updated', updated],
                ['Models', models.length],
                ['Leaderboards', boards.length],
                ['Reports ✱', reports.length],
              ].map(([k, v]) => (
                <div
                  key={String(k)}
                  className="flex flex-col">
                  <dt className="text-micro text-[#78758A]">{k}</dt>
                  <dd className="text-body-sm font-mono font-semibold text-white">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-micro mt-3 border-t border-white/8 pt-3 text-[#78758A]">
              Scores belong to their publishers; PublicAI only normalizes and
              weights them.
            </p>
            <p className="text-micro mt-2 text-[#78758A]">
              <span className={cn(LABEL, 'mr-1.5')}>Cite</span>
              <code className="font-mono text-[#9C9AA8] select-all">
                {citation}
              </code>
            </p>
          </aside>
        </header>

        {/* ===================== TABLE + SIDEBAR ===================== */}
        <div
          className="grid grid-cols-1 gap-8 border-t border-white/8 pt-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10"
          id="index">
          <main className="min-w-0">
            <p className={cn(LABEL, 'mb-3')}>§ 1 · Ranking</p>
            <Suspense>
              <IndexTable
                models={models}
                benchmarks={benchmarks}
                scores={scores}
                catalogs={catalogs}
                generatedAt={generatedAt}
              />
            </Suspense>
          </main>

          <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-24">
            <Card title="Weighting — Overall index">
              <ol className="flex flex-col gap-3">
                {WEIGHTING.map((w) => {
                  const s = sourceById.get(w.benchmarkId);
                  if (!s) return null;
                  return (
                    <li key={w.benchmarkId}>
                      <div className="mb-1 flex items-center gap-2">
                        <SourceBadge
                          source={s}
                          present
                        />
                        <b className="text-body-sm font-semibold text-white">
                          {s.name}
                        </b>
                        <span className="text-caption text-p1 ml-auto font-mono">
                          {w.weight}%
                        </span>
                      </div>
                      <p className="text-micro text-g2">{w.rationale}</p>
                    </li>
                  );
                })}
              </ol>
              <p className="text-micro mt-3 border-t border-white/8 pt-3 text-[#78758A]">
                Fixed by PublicAI. Reports ✱ carry {REPORT_WEIGHT}% of a board’s
                share, in domain columns only.
              </p>
            </Card>

            <Card title="For agents — MCP">
              <p className="text-caption mb-2 text-[#D9D7E0]">
                The same answers, as tools:{' '}
                <code className="font-mono text-white">rank_models</code>,{' '}
                <code className="font-mono text-white">get_model</code>,{' '}
                <code className="font-mono text-white">describe_index</code>.
                Every score comes with its sources; every model with the
                recommended way to call it.
              </p>
              <pre className="text-micro overflow-x-auto rounded-md bg-black/40 px-2.5 py-2 font-mono whitespace-pre-wrap text-[#D9D7E0] select-all">
                {mcpConfig}
              </pre>
              <p className="text-micro mt-2 text-[#78758A]">
                Streamable HTTP, no key. Plain JSON at{' '}
                <a
                  href={`${API_URL}?scope=coding&limit=10`}
                  className="text-p1 underline underline-offset-2">
                  {API_URL.replace('https://', '')}
                </a>{' '}
                with <code className="font-mono">scope</code>,{' '}
                <code className="font-mono">org</code>,{' '}
                <code className="font-mono">minBoards</code>,{' '}
                <code className="font-mono">limit</code> or{' '}
                <code className="font-mono">model</code>.
              </p>
            </Card>
          </aside>
        </div>

        {/* ===================== SOURCES ===================== */}
        <section
          className="border-t border-white/8 py-12 lg:py-14"
          id="sources">
          <SectionHead
            n="2"
            title="Sources"
            lede="Leaderboards form the Overall index; reports ✱ widen the domain columns; catalogs say where a model can be called. Every figure links to its source."
          />
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
                {b.headline.snapshot ? (
                  <p className="text-micro text-g2">{b.headline.snapshot}</p>
                ) : null}
                {b.headline.caveat ? (
                  <p
                    className="text-micro mt-1 line-clamp-3 text-[#78758A]"
                    title={b.headline.caveat}>
                    {b.headline.caveat}
                  </p>
                ) : null}
              </article>
            ))}
            {reports.map((r) => (
              <article
                key={r.id}
                className={cn(PANEL, 'p-4')}>
                <div className="mb-1 flex items-center gap-2">
                  <SourceBadge
                    source={r}
                    present
                    logo
                  />
                  <a
                    href={r.headline.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm font-semibold text-white underline underline-offset-2">
                    {r.name}
                  </a>
                  <span className="text-micro ml-auto text-[#78758A]">
                    {r.headline.publishedAt
                      ? `published ${r.headline.publishedAt}`
                      : `read ${r.headline.retrievedAt}`}
                  </span>
                </div>
                <p className="text-micro mb-1 text-[#E8A9F0]">
                  Report by {r.headline.publisher} · {r.measures.length}{' '}
                  benchmarks across{' '}
                  {new Set(r.measures.map((m) => m.category)).size} categories ·
                  marked ✱ wherever it appears
                </p>
                {r.headline.caveat ? (
                  <p
                    className="text-micro line-clamp-3 text-[#78758A]"
                    title={r.headline.caveat}>
                    {r.headline.caveat}
                  </p>
                ) : null}
              </article>
            ))}
            {catalogs.map((c) => (
              <article
                key={c.id}
                className={cn(PANEL, 'p-4')}>
                <div className="mb-1 flex items-center gap-2">
                  {SOURCE_LOGO[c.id] ? (
                    <span className="inline-flex size-5 items-center justify-center rounded bg-white/[0.06]">
                      {/* eslint-disable-next-line @next/next/no-img-element -- a 16px mark */}
                      <img
                        src={SOURCE_LOGO[c.id]}
                        alt=""
                        width={16}
                        height={16}
                        className="size-4 object-contain"
                      />
                    </span>
                  ) : (
                    <span className="text-micro inline-flex h-5 min-w-7 items-center justify-center rounded border border-white/20 bg-white/10 px-1 font-mono font-semibold text-[#D9D7E0]">
                      CAT
                    </span>
                  )}
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm font-semibold text-white underline underline-offset-2">
                    {c.name}
                  </a>
                  <span className="text-micro ml-auto text-[#78758A]">
                    read {c.retrievedAt}
                  </span>
                </div>
                <p className="text-micro mb-1 text-[#D9D7E0]">
                  Catalog · {callable} of {models.length} models matched · ids,
                  context, prices, open weights · never scored
                </p>
                {c.caveat ? (
                  <p
                    className="text-micro line-clamp-3 text-[#78758A]"
                    title={c.caveat}>
                    {c.caveat}
                  </p>
                ) : null}
              </article>
            ))}
            {excluded.map((e) => (
              <article
                key={e.name}
                className={cn(PANEL, 'border-dashed p-4')}>
                <p className="text-micro text-[#78758A]">
                  <b className="text-body-sm block font-semibold text-[#F5C86B]">
                    Excluded — {e.name}
                  </b>
                  {e.reason}{' '}
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-p1 underline underline-offset-2">
                    source
                  </a>
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ===================== METHOD ===================== */}
        <section
          className="border-t border-white/8 py-12 lg:py-14"
          id="method">
          <SectionHead
            n="3"
            title="Method"
            lede="Six rules, each so that a number here traces to a number there, and so that thin or self-reported evidence cannot buy a rank."
          />
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {method.map(({ title, text }, i) => (
              <li
                key={title}
                className={cn(PANEL, 'p-5')}>
                <span className="text-p1 text-caption mb-2 block font-mono">
                  0{i + 1}
                </span>
                <b className="text-subheading mb-2 block font-semibold text-white">
                  {title}
                </b>
                <p className="text-body text-[#B9B7C4]">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ===================== LIMITS ===================== */}
        <section
          className="border-t border-white/8 py-12 lg:py-14"
          id="limits">
          <SectionHead
            n="4"
            title="Limitations"
            lede="An aggregate hides the disagreements that produced it. These are the ones worth knowing before you cite this page."
          />
          <div className="grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
            {limits.map(({ title, text }) => (
              <div
                key={title}
                className="border-t border-white/8 py-5">
                <b className="text-body mb-1.5 block font-semibold text-white">
                  {title}
                </b>
                <p className="text-body text-[#B9B7C4]">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
