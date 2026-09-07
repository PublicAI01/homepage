import type { Metadata } from 'next';
import { Suspense } from 'react';

import { cn } from '@/utils';

import IndexTable, { SourceBadge } from './components/index-table';
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
  MIN_SOURCES,
  PRIOR_FRACTION,
  REPORT_WEIGHT,
  WEIGHTING,
} from './lib/weights';

const INDEX_URL = 'https://publicai.io/model-index';

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
    : 'The most comprehensive and robust model index, built from everyone’s benchmarks and none of our own. Scores from recognised public leaderboards, standardized onto one scale, with launch-post figures marked ✱. Queryable by agents over MCP.';
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
    title: 'Standardize per measure',
    text: 'Each figure a source publishes is z-scored across the models on it and mapped to 0–100 with 50 as that measure’s average. An Elo of 1504 and a 57.9% resolution rate become comparable, and a narrow-spread board is not drowned out by a wide one.',
  },
  {
    title: 'Discount by published uncertainty',
    text: 'Where a publisher reports an error bar, the score is discounted in proportion to how wide it is relative to the board’s spread. No error bar means face value — absence is not treated as evidence of a wide one.',
  },
  {
    title: 'Never impute; shrink instead',
    text: `A model absent from a source is excluded from that term, not filled in. But thin evidence is pulled toward 50 by a prior worth ${Math.round(PRIOR_FRACTION * 100)}% of the weight available, so one generous board cannot put a barely-tested model at the top. Overall ranks a model once boards from ${MIN_SOURCES} independent publishers have scored it; until then it is provisional. A category or domain ranks any model a recognised board has measured there, on that measurement.`,
  },
  {
    title: 'Weight by a published scheme',
    text: 'Each recognised board’s headline figure carries a fixed share of the Overall index, stated beside the table with its reason. A board’s category figures shape only the domain they measure, so no board is counted twice.',
  },
  {
    title: 'Mark reports ✱ and keep them out of the headline',
    text: `A launch post or a blog is evidence of a different grade: the publisher chose the benchmarks, the settings and the comparison set. Its figures are indexed for domain and category columns at ${REPORT_WEIGHT}% of a board’s share, never enter the Overall index, and never make a model rankable.`,
  },
  {
    title: 'Estimate the rest, and say so',
    text: 'A model no Overall board has scored still sits in tables beside models that have an index. On each such measure its figure is placed among theirs and their Overall index read at that position; beyond their range the nearest anchor is a bound, shown as ≤ or ≥, not a point. Placements are averaged by measure weight. Shown as ~55✱, never ranked, gone the day a real score arrives.',
  },
];

const limits = [
  {
    title: 'Reasoning-effort tiers are matched by rule',
    text: 'Sources report several effort tiers per model. The highest published tier is indexed, and the exact label is kept beside each score. Where a source only published a lower tier, that row is weaker evidence than it looks.',
  },
  {
    title: 'Some sources score a scaffold, not a model',
    text: 'Terminal-Bench results are a model plus an agent framework — Codex, Claude Code, Grok Build. The framework is part of the number and is recorded beside each score.',
  },
  {
    title: 'Model identity is inferred from names',
    text: 'Five sources spell the same model five ways. They are matched by name after tier and vendor words are removed. The rule is tested against hand-checked cases and every merge is logged, but a wrong merge is possible; the model card shows the exact source labels.',
  },
  {
    title: 'Report figures are the publisher’s',
    text: 'A launch post does not always say whether competitor figures were re-run or copied, and its columns can mix effort tiers. They are shown with their mark and their publisher so the reader can weigh them, not laundered into board figures.',
  },
  {
    title: 'Size classes are what makers disclose',
    text: 'Small ≤ 15B, medium 15–100B, large 100B–1T, very large > 1T by total parameters: counted from the weights on Hugging Face for open models, read from the name otherwise. A closed model is undisclosed, not small; within a class, positions are simply the ranking filtered to it, on the same scores.',
  },
  {
    title: 'Access facts are a catalog’s, not a test',
    text: 'Ids, context windows and prices are read from a public catalog on the date shown and move often. Vendor sites are curated pointers. None of it is an endorsement, and none of it touches a score.',
  },
  {
    title: 'A snapshot, not a live feed',
    text: 'Figures were read from each publisher on the date shown. Leaderboards move; check the source before acting on a number.',
  },
];

const mcpConfig = `{ "mcpServers": { "publicai-index": { "url": "${MCP_URL}" } } }`;

const snapshotDate = generatedAt.slice(0, 10);
const citation = `PublicAI Foundation (${snapshotDate.slice(0, 4)}). PublicAI Index: a weighted aggregate of public model leaderboards, snapshot ${snapshotDate}. https://publicai.io/model-index`;

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
        <header className="pt-10 pb-8 lg:pt-14 lg:pb-10">
          {/* The product's name is the headline; the counts are its subtitle. */}
          <h1 className="text-display mb-2 font-bold text-white">
            PublicAI Index
          </h1>
          <p
            className={cn(
              'text-subheading mb-4 font-semibold text-[#B9B7C4]',
              MEASURE,
            )}>
            The LLM benchmark aggregator — the most comprehensive and robust
            model index, built from everyone’s benchmarks and none of our own.
          </p>
          <p className={cn('text-lede mb-5 text-[#D9D7E0]', MEASURE)}>
            Model evaluation has fragmented into dozens of leaderboards, and a
            single benchmark is easy to target: topping one board says little
            about the next. PublicAI runs no evaluations of its own. It
            aggregates the public ones by statistical method — one scale,
            discounted by published uncertainty, shrunk where evidence is thin,
            weighted by a scheme printed beside the table — into an index no
            single benchmark can be tuned to, overall and by domain. Launch
            posts and blogs are indexed too, marked ✱ and kept out of the
            headline. Agents get the same answers over MCP and a JSON API, every
            score with its sources.
          </p>
          <dl className="text-caption flex flex-wrap gap-x-6 gap-y-1 text-[#78758A]">
            {[
              ['Updated', updated],
              ['Boards', boards.length],
              ['Reports ✱', reports.length],
              ['Measures', benchmarks.length],
              ['Categories', categories.length],
              ['Domains', domains.length],
              ['Models', models.length],
              ['With a callable id', callable],
            ].map(([k, v]) => (
              <div key={String(k)}>
                <dt className="inline">{k} </dt>
                <dd className="inline text-[#D9D7E0]">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="sr-only">Attribution</dt>
              <dd className="inline">
                Scores belong to their publishers; PublicAI only normalizes and
                weights them.
              </dd>
            </div>
          </dl>
          <p className="text-micro mt-4 flex flex-wrap items-baseline gap-x-2 text-[#78758A]">
            <span className={LABEL}>Cite</span>
            <code className="font-mono text-[#9C9AA8] select-all">
              {citation}
            </code>
          </p>
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
                Set by PublicAI; stated so it can be disagreed with. A board’s
                category figures shape only their own domain. Report figures ✱
                carry {REPORT_WEIGHT}% of a board’s share, in domain columns
                only.
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
            lede="Recognised leaderboards form the Overall index. Reports ✱ widen the domain columns. A catalog says where a model can be called. All first-party; every figure links to the page it was read from."
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
                  <p className="text-micro mt-1 text-[#78758A]">
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
                  <p className="text-micro text-[#78758A]">
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
                  <span className="text-micro inline-flex h-5 min-w-7 items-center justify-center rounded border border-white/20 bg-white/10 px-1 font-mono font-semibold text-[#D9D7E0]">
                    CAT
                  </span>
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
                  <p className="text-micro text-[#78758A]">{c.caveat}</p>
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
            lede="Five steps, each chosen so that a number here can be traced to a number there, and so that thin or self-reported evidence cannot buy a rank."
          />
          <ol className="grid grid-cols-1 gap-x-10 md:grid-cols-2 xl:grid-cols-5">
            {method.map(({ title, text }, i) => (
              <li
                key={title}
                className="border-t border-white/8 py-4">
                <b className="text-body mb-1 block font-semibold text-white">
                  <span className="text-p1 mr-2 font-mono">0{i + 1}</span>
                  {title}
                </b>
                <p className="text-g2 text-body-sm">{text}</p>
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
          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2 xl:grid-cols-3">
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
    </div>
  );
}
