'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/utils';

import type { Benchmark, Catalog, Model, Score } from '../data/types';
import {
  type Channel,
  channelsOf,
  contextLabel,
  priceLabel,
} from '../lib/access';
import { aggregate, type AggregateRow, compareScores } from '../lib/aggregate';
import { type BoardView, groupBoards } from '../lib/boards';
import { downloadChart } from '../lib/export-chart';
import {
  categoryRank,
  domainLabel,
  FALLBACK_BADGE,
  MIN_SOURCES,
  OVERALL,
  PRIOR_FRACTION,
  REPORT_BADGE,
  SOURCE_BADGE,
  weightsFor,
} from '../lib/weights';

const PANEL = 'rounded-xl border border-[#2C2C31] bg-white/[0.045]';
const INDEX_TONE = 'text-white';
const CONTROL =
  'text-caption h-8 rounded-md border border-white/12 bg-transparent px-2.5 text-white outline-none transition-colors hover:border-white/25 focus:border-primary';
const CHIP =
  'text-caption rounded-md border px-2.5 py-1 font-medium transition-colors';
const CHIP_ON = 'border-white/40 bg-white/10 text-white';
const CHIP_OFF =
  'text-g2 border-transparent hover:border-white/15 hover:text-white';
const LABEL = 'text-micro tracking-[0.14em] text-[#78758A] uppercase';
const PAGE = 100;

interface Props {
  models: Model[];
  benchmarks: Benchmark[];
  scores: Score[];
  catalogs: Catalog[];
  generatedAt: string;
}

const CHART_ROWS = 10;
/** Must-include key standing for "any report ✱". */
const REPORT_ANY = '✱';
const INDEX_URL = 'https://publicai.io/model-index';

/** What the table is ranked by: the overall index, a category, or a domain inside one. */
type RankKey =
  | { level: 'overall' }
  | { level: 'category'; category: string }
  | { level: 'domain'; category: string; domain: string };

const fmt = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : n.toFixed(1);

/** Raw scores print in their own units, so a reader can check them against the source. */
function rawLabel(metric: Benchmark['metric'], raw: number) {
  if (metric === 'elo') return String(Math.round(raw));
  if (metric === 'percent') return `${raw}%`;
  return String(raw);
}

/** Wide disagreement between boards is a caveat on the aggregate, so it is shown. */
function agreement(d: number) {
  if (d >= 18) return { label: 'boards disagree', tone: 'text-[#F08A8A]' };
  if (d >= 9) return { label: 'mixed', tone: 'text-[#F5C86B]' };
  return { label: 'consistent', tone: 'text-[#9C9AA8]' };
}

const keyOf = (row: AggregateRow, k: RankKey): number | null => {
  if (k.level === 'overall') return row.score;
  if (k.level === 'category') return row.byCategory[k.category] ?? null;
  return row.byDomain[k.domain] ?? null;
};

/**
 * Overall ranks on independent publishers; a category or domain ranks any
 * model a recognised board has measured in that scope, on that measurement.
 * Reports alone never rank anywhere.
 */
const eligible = (row: AggregateRow, k: RankKey): boolean =>
  k.level === 'overall'
    ? row.ranked
    : k.level === 'category'
      ? (row.boardsByCategory[k.category] ?? 0) > 0
      : (row.boardsByDomain[k.domain] ?? 0) > 0;

const rankLabel = (k: RankKey) =>
  k.level === 'overall'
    ? 'Overall'
    : k.level === 'category'
      ? domainLabel(k.category)
      : domainLabel(k.domain);

export function SourceBadge({
  source,
  present,
  detail,
}: {
  source: BoardView;
  present: boolean;
  detail?: string;
}) {
  const badge =
    source.kind === 'report'
      ? REPORT_BADGE
      : (SOURCE_BADGE[source.id] ?? FALLBACK_BADGE);
  const name = source.name;
  const label = present
    ? `${name}${detail ? ` — ${detail}` : ''}`
    : `${name} — not listed`;
  return (
    <span
      title={label}
      aria-label={label}
      className={cn(
        'text-micro inline-flex h-5 min-w-6 items-center justify-center rounded border px-0.5 font-mono font-semibold tracking-wide',
        present
          ? badge.tone
          : 'border-dashed border-white/12 text-white/25 opacity-70',
      )}>
      {badge.code}
    </span>
  );
}

export default function IndexTable({
  models,
  benchmarks,
  scores,
  catalogs,
  generatedAt,
}: Props) {
  const [rankKey, setRankKey] = useState<RankKey>({ level: 'overall' });
  const [query, setQuery] = useState('');
  const [org, setOrg] = useState('all');
  // Everything a recognised board has scored is listed; ranked rows come
  // first, provisional ones after, so a model on one board is visible
  // without being ranked on that one board's word.
  const [minBoards, setMinBoards] = useState(1);
  const [mustHave, setMustHave] = useState<Set<string>>(new Set());
  const [openModel, setOpenModel] = useState<string | null>(null);
  // Reports ✱ — launch posts, blogs, write-ups — are in by default and can
  // be switched off, which drops their figures from every score and hides
  // models nothing else has measured.
  const [includeReports, setIncludeReports] = useState(true);

  const weights = useMemo(() => {
    const w = weightsFor(benchmarks);
    if (!includeReports)
      for (const b of benchmarks) if (b.kind === 'report') w[b.id] = 0;
    return w;
  }, [benchmarks, includeReports]);
  const sources = useMemo(() => groupBoards(benchmarks), [benchmarks]);
  const boards = useMemo(
    () => sources.filter((s) => s.kind !== 'report'),
    [sources],
  );
  const reports = useMemo(
    () => sources.filter((s) => s.kind === 'report'),
    [sources],
  );

  /** category → its domains, in first-seen order; categories in display order. */
  const taxonomy = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const b of benchmarks) {
      const list = m.get(b.category) ?? [];
      if (!list.includes(b.domain)) list.push(b.domain);
      m.set(b.category, list);
    }
    return [...m.entries()].sort(
      (a, b) =>
        categoryRank(a[0]) - categoryRank(b[0]) || a[0].localeCompare(b[0]),
    );
  }, [benchmarks]);

  const orgs = useMemo(
    () => [...new Set(models.map((m) => m.org))].sort(),
    [models],
  );

  const rows = useMemo(
    () =>
      aggregate({
        models,
        benchmarks,
        scores,
        weights,
        overall: OVERALL,
        priorFraction: PRIOR_FRACTION,
        minSources: MIN_SOURCES,
      }),
    [models, benchmarks, scores, weights],
  );

  const rankOf = useMemo(() => {
    const m = new Map<string, number>();
    let n = 0;
    for (const r of rows) if (r.ranked) m.set(r.model.id, ++n);
    return m;
  }, [rows]);

  const sourcesScoring = useMemo(() => {
    const groupOf = new Map(benchmarks.map((b) => [b.id, b.group]));
    const m = new Map<string, Set<string>>();
    for (const r of rows) {
      m.set(
        r.model.id,
        new Set(r.perBenchmark.map((s) => groupOf.get(s.benchmarkId)!)),
      );
    }
    return m;
  }, [rows, benchmarks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (r.covered < minBoards) return false;
      if (!includeReports && r.covered === 0) return false;
      if (org !== 'all' && r.model.org !== org) return false;
      if (q && !`${r.model.name} ${r.model.org}`.toLowerCase().includes(q))
        return false;
      const has = sourcesScoring.get(r.model.id)!;
      for (const b of mustHave) {
        if (b === REPORT_ANY ? r.reports === 0 : !has.has(b)) return false;
      }
      return true;
    });
    if (rankKey.level !== 'overall') {
      const by = compareScores<AggregateRow>((r) => keyOf(r, rankKey));
      out = [...out]
        // A model with no figure in this scope is not "last": it is absent.
        .filter((r) => keyOf(r, rankKey) !== null)
        // With reports in, a row sits where its figure puts it and carries
        // a ✱ instead of a number if no board measured it here. With
        // reports out, only board-measured rows remain in this scope.
        .filter((r) => includeReports || eligible(r, rankKey))
        .sort(by);
    }
    return out;
  }, [
    rows,
    query,
    org,
    minBoards,
    mustHave,
    rankKey,
    sourcesScoring,
    includeReports,
  ]);

  const rankedCount = rows.filter((r) => r.ranked).length;
  const shown = filtered.slice(0, PAGE);
  // Position in the list on screen, for rows eligible in this scope. On
  // Overall that is the model's rank; in a scope it is its place there.
  const positionOf = useMemo(() => {
    const m = new Map<string, number>();
    if (rankKey.level === 'overall') return rankOf;
    let n = 0;
    for (const r of filtered) if (eligible(r, rankKey)) m.set(r.model.id, ++n);
    return m;
  }, [filtered, rankKey, rankOf]);
  const coverable = rows[0]?.coverable ?? boards.length;
  const catalogDate = catalogs[0]?.retrievedAt;

  const toggleSource = (id: string) =>
    setMustHave((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const activeCategory = rankKey.level === 'overall' ? null : rankKey.category;
  const activeDomains = activeCategory
    ? (taxonomy.find(([c]) => c === activeCategory)?.[1] ?? [])
    : [];

  const exportChart = () => {
    const top = filtered
      .filter((r) => keyOf(r, rankKey) !== null)
      .slice(0, CHART_ROWS);
    const scope = rankLabel(rankKey);
    downloadChart(
      {
        title: `Top ${top.length} models — ${scope}`,
        scope,
        // Position within this scope, not the Overall rank: a chart titled
        // "Coding" numbered 1, 3, 4, 8 would read as an error.
        rows: top.map((r) => ({
          rank: positionOf.get(r.model.id) ?? null,
          name: r.model.name,
          org: r.model.org,
          score: keyOf(r, rankKey) ?? 0,
          covered: r.covered,
          coverable: r.coverable,
        })),
        generatedAt,
        url: INDEX_URL,
      },
      `publicai-index-${scope.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${generatedAt.slice(0, 10)}.png`,
    );
  };

  return (
    <div>
      {/* ---------------- rank by: category, then domain ---------------- */}
      <div
        role="tablist"
        aria-label="Rank by category"
        className="flex flex-wrap items-center gap-1">
        <span className={cn(LABEL, 'mr-2')}>Rank by</span>
        <button
          type="button"
          role="tab"
          aria-selected={rankKey.level === 'overall'}
          onClick={() => setRankKey({ level: 'overall' })}
          className={cn(
            CHIP,
            rankKey.level === 'overall' ? CHIP_ON : CHIP_OFF,
          )}>
          Overall
        </button>
        {taxonomy.map(([category, domains]) => {
          const on = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setRankKey({ level: 'category', category })}
              className={cn(CHIP, on ? CHIP_ON : CHIP_OFF)}>
              {domainLabel(category)}
              <span className="ml-1.5 font-mono text-[10px] opacity-50">
                {domains.length}
              </span>
            </button>
          );
        })}
      </div>

      {activeCategory ? (
        <div
          role="tablist"
          aria-label={`Rank by domain within ${activeCategory}`}
          className="border-primary/40 mt-1.5 flex flex-wrap items-center gap-1 border-l-2 pl-3">
          <button
            type="button"
            role="tab"
            aria-selected={rankKey.level === 'category'}
            onClick={() =>
              setRankKey({ level: 'category', category: activeCategory })
            }
            className={cn(
              CHIP,
              rankKey.level === 'category' ? CHIP_ON : CHIP_OFF,
            )}>
            All {domainLabel(activeCategory).toLowerCase()}
          </button>
          {activeDomains.map((domain) => {
            const on = rankKey.level === 'domain' && rankKey.domain === domain;
            return (
              <button
                key={domain}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() =>
                  setRankKey({
                    level: 'domain',
                    category: activeCategory,
                    domain,
                  })
                }
                className={cn(CHIP, on ? CHIP_ON : CHIP_OFF)}>
                {domainLabel(domain)}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* ---------------- filters ---------------- */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search model or organisation"
          aria-label="Search"
          className={cn(CONTROL, 'w-60 placeholder:text-[#78758A]')}
        />
        <select
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          aria-label="Organisation"
          className={CONTROL}>
          <option value="all">All organisations</option>
          {orgs.map((o) => (
            <option
              key={o}
              value={o}>
              {o}
            </option>
          ))}
        </select>
        <select
          value={minBoards}
          onChange={(e) => setMinBoards(Number(e.target.value))}
          aria-label="Minimum recognised boards"
          className={CONTROL}>
          <option value={0}>Any coverage (incl. report-only)</option>
          {Array.from({ length: coverable }, (_, i) => i + 1).map((n) => (
            <option
              key={n}
              value={n}>
              {n === 1 ? 'At least 1 board' : `Scored by ${n}+ boards`}
            </option>
          ))}
        </select>
        <label
          className="text-caption flex cursor-pointer items-center gap-1.5 text-[#D9D7E0] select-none"
          title="Launch posts, blogs and write-ups. Off: their figures leave every score and models nothing else measured are hidden.">
          <input
            type="checkbox"
            checked={includeReports}
            onChange={(e) => setIncludeReports(e.target.checked)}
            className="accent-primary size-3.5"
          />
          Include reports{' '}
          <span className={cn('font-mono', REPORT_BADGE.tone.split(' ').pop())}>
            ✱
          </span>
        </label>
        <span className="ml-auto flex items-center gap-1.5">
          <span className={cn(LABEL, 'mr-1')}>Must include</span>
          {/* Boards one by one; every report shares the one ✱, so the ✱
              button means "measured by at least one report". */}
          {[...boards, ...(reports.length ? [reports[0]] : [])].map((s) => {
            const id = s.kind === 'report' ? REPORT_ANY : s.id;
            const on = mustHave.has(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleSource(id)}
                title={
                  s.kind === 'report'
                    ? `Any report ✱ (${reports.map((r) => r.name).join(' · ')})`
                    : s.name
                }
                className={cn(
                  'rounded-md border p-0.5 transition-colors',
                  on
                    ? 'border-primary/70'
                    : 'border-transparent hover:border-white/20',
                )}>
                <SourceBadge
                  source={s}
                  present
                />
              </button>
            );
          })}
        </span>
      </div>

      <div className="text-caption mt-3 mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[#78758A]">
        <p>
          <span className="text-[#D9D7E0]">{rankedCount}</span> ranked ·{' '}
          <span className="text-[#D9D7E0]">{rows.length - rankedCount}</span>{' '}
          provisional · showing{' '}
          <span className="text-[#D9D7E0]">
            {shown.length}
            {filtered.length > shown.length ? ` of ${filtered.length}` : ''}
          </span>
          {rankKey.level !== 'overall' ? (
            <>
              {' '}
              · ranked by{' '}
              <span className="text-[#D9D7E0]">{rankLabel(rankKey)}</span>
            </>
          ) : null}
        </p>
        <button
          type="button"
          onClick={exportChart}
          disabled={filtered.length === 0}
          className="text-caption ml-auto inline-flex h-7 items-center gap-1.5 rounded-md border border-white/12 px-2.5 text-[#D9D7E0] transition-colors hover:border-white/30 hover:text-white disabled:opacity-40"
          title={`Download a PNG bar chart of the top ${CHART_ROWS} rows as filtered and ranked here`}>
          <span aria-hidden>↓</span> Export chart
        </button>
      </div>

      {/* ---------------- table ---------------- */}
      <div className={cn(PANEL, 'overflow-x-auto')}>
        <table className="text-body-sm w-full border-collapse text-left whitespace-nowrap">
          <thead>
            <tr className="text-micro bg-white/4 tracking-[0.1em] text-[#78758A] uppercase">
              <th className="w-10 px-2.5 py-3 font-medium">#</th>
              <th className="px-2.5 py-3 font-medium">Model</th>
              <th
                className={cn(
                  'px-2.5 py-3 text-right font-medium',
                  rankKey.level === 'overall' && 'text-white',
                )}>
                Index
              </th>
              {rankKey.level !== 'overall' ? (
                <th className="max-w-28 px-2.5 py-3 text-right leading-tight font-medium whitespace-normal text-white">
                  {rankLabel(rankKey)}
                </th>
              ) : null}
              <th className="px-2.5 py-3 font-medium">Sources</th>
              <th className="w-8 px-2.5 py-3" />
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <Row
                key={row.model.id}
                row={row}
                rank={rankOf.get(row.model.id)}
                position={positionOf.get(row.model.id)}
                inScope={eligible(row, rankKey)}
                rankKey={rankKey}
                taxonomy={taxonomy}
                boards={boards}
                reports={reports}
                catalogDate={catalogDate}
                open={openModel === row.model.id}
                onToggle={() =>
                  setOpenModel(openModel === row.model.id ? null : row.model.id)
                }
              />
            ))}
            {shown.length === 0 ? (
              <tr className="border-t border-white/8">
                <td
                  colSpan={6}
                  className="text-g2 px-3 py-6 text-center">
                  Nothing matches these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="text-caption text-g2 mt-3 max-w-[76ch]">
        Scores are 0–100 standardized: 50 is average across the models listed,
        not an absolute grade. Thin evidence is pulled toward 50. Overall ranks
        a model once {MIN_SOURCES} independent publishers’ boards have scored
        it; until then it is provisional, without a rank. A category or domain
        ranks any model a recognised board has measured there; figures from
        reports ✱ shape those columns but never rank a model on their own. A
        filled badge means that source scored the model; hover for the figure.
        Open a row for the model card: scores by domain, how to call it, and
        every source figure.
        {filtered.length > shown.length
          ? ` The first ${PAGE} of ${filtered.length} are shown; narrow the filters to see the rest.`
          : ''}
      </p>
    </div>
  );
}

function Row({
  row,
  rank,
  position,
  inScope,
  rankKey,
  taxonomy,
  boards,
  reports,
  catalogDate,
  open,
  onToggle,
}: {
  row: AggregateRow;
  rank: number | undefined;
  position: number | undefined;
  inScope: boolean;
  rankKey: RankKey;
  taxonomy: [string, string[]][];
  boards: BoardView[];
  reports: BoardView[];
  catalogDate: string | undefined;
  open: boolean;
  onToggle: () => void;
}) {
  const thin = row.ranked && row.covered < row.coverable;
  const scored = new Map(row.perBenchmark.map((s) => [s.benchmarkId, s]));
  const reportsScoring = reports.filter((r) =>
    r.measures.some((m) => scored.has(m.id)),
  );

  return (
    <>
      <tr
        className={cn(
          'cursor-pointer border-t border-white/8 align-middle transition-colors hover:bg-white/4',
          open && 'bg-white/[0.06]',
        )}
        onClick={onToggle}
        aria-expanded={open}>
        <td className="text-g2 px-2.5 py-2.5 font-mono">
          {position ?? (
            <span
              className={cn(rankKey.level !== 'overall' && 'text-[#E8A9F0]')}
              title={
                rankKey.level === 'overall'
                  ? `Provisional — fewer than ${MIN_SOURCES} independent publishers`
                  : 'Placed by report ✱ figures only; no recognised board measures this model here'
              }>
              {rankKey.level === 'overall' ? '—' : '✱'}
            </span>
          )}
        </td>
        {/* Names wrap; the table never scrolls sideways because one label is long. */}
        <td className="min-w-52 px-2.5 py-2.5 whitespace-normal">
          <b
            className={cn(
              'font-semibold',
              inScope ? 'text-white' : 'text-[#B9B7C4]',
            )}>
            {row.model.name}
          </b>
          <span className="text-g2 ml-2 text-xs">{row.model.org}</span>
          {!inScope ? (
            <span className="text-micro ml-2 rounded border border-white/12 px-1 py-px text-[#78758A]">
              {rankKey.level === 'overall' ? 'provisional' : 'report only'}
            </span>
          ) : null}
        </td>
        <td
          className={cn(
            'px-2.5 py-2.5 text-right font-mono font-semibold',
            row.ranked ? INDEX_TONE : 'text-[#78758A]',
          )}>
          {fmt(row.score)}
        </td>
        {rankKey.level !== 'overall' ? (
          <td className="px-2.5 py-2.5 text-right font-mono text-white">
            {fmt(keyOf(row, rankKey))}
          </td>
        ) : null}
        <td className="px-2.5 py-2.5">
          <span className="flex items-center gap-0.5">
            {boards.map((b) => {
              const s = scored.get(b.headline.id);
              return (
                <SourceBadge
                  key={b.id}
                  source={b}
                  present={Boolean(s)}
                  detail={s ? rawLabel(b.headline.metric, s.raw) : undefined}
                />
              );
            })}
            {reportsScoring.length > 0 ? (
              <span
                title={reportsScoring.map((r) => r.name).join(' · ')}
                className={cn(
                  'text-micro inline-flex h-5 min-w-6 items-center justify-center rounded border px-0.5 font-mono font-semibold',
                  REPORT_BADGE.tone,
                )}>
                ✱{reportsScoring.length > 1 ? reportsScoring.length : ''}
              </span>
            ) : null}
            <span
              className={cn(
                'text-caption ml-1.5 font-mono',
                thin ? 'text-[#F5C86B]' : 'text-[#78758A]',
              )}>
              {row.covered}/{row.coverable}
            </span>
          </span>
        </td>
        <td className="text-g2 px-2.5 py-2.5">
          <span
            aria-hidden
            className="inline-block transition-transform duration-200"
            style={{ transform: open ? 'rotate(90deg)' : 'none' }}>
            ›
          </span>
          <span className="sr-only">
            {open ? 'Hide' : 'Show'} details for {row.model.name}
          </span>
        </td>
      </tr>

      {open ? (
        <tr className="border-t border-white/8 bg-[#141416]">
          <td
            colSpan={6}
            className="p-0 whitespace-normal">
            {/* The table scrolls sideways on small screens; the card must not.
                Sticky at the left edge and capped at the viewport, it stays
                readable while the rows behind it scroll. */}
            <div className="sticky left-0 max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
              <ModelCard
                row={row}
                rank={rank}
                taxonomy={taxonomy}
                boards={boards}
                reports={reports}
                catalogDate={catalogDate}
              />
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

/**
 * The card a row opens into. Three things a reader wants, in order: what
 * this model is and how it scores, how to call it, and where every figure
 * came from. Nothing here is prose about the model; every line is a fact the
 * index holds, and every number links back.
 */
function ModelCard({
  row,
  rank,
  taxonomy,
  boards,
  reports,
  catalogDate,
}: {
  row: AggregateRow;
  rank: number | undefined;
  taxonomy: [string, string[]][];
  boards: BoardView[];
  reports: BoardView[];
  catalogDate: string | undefined;
}) {
  const agree = agreement(row.dispersion);
  const scored = new Map(row.perBenchmark.map((s) => [s.benchmarkId, s]));
  const access = row.model.access;
  const or = access?.openrouter;
  const channels = channelsOf(access);
  const [recommended, ...alternatives] = channels;

  // A best domain gives the "about" line something a reader can act on.
  const best = Object.entries(row.byDomain)
    .filter((e): e is [string, number] => typeof e[1] === 'number')
    .sort((a, b) => b[1] - a[1])[0];

  const facts: string[] = [
    row.model.org,
    access?.weights
      ? 'open weights'
      : or
        ? 'weights not published'
        : catalogDate
          ? `not in the catalog as of ${catalogDate}`
          : '',
    contextLabel(or?.contextLength)
      ? `${contextLabel(or?.contextLength)} context`
      : '',
    or?.modalities?.length ? `${or.modalities.join(' + ')} in` : '',
    or?.listedAt ? `listed ${or.listedAt}` : '',
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ---- about + scores ---- */}
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <b className="text-body font-semibold text-white">{row.model.name}</b>
          <span className="text-caption text-[#9C9AA8]">
            {facts.join(' · ')}
          </span>
        </div>
        <p className="text-caption mb-4 text-[#9C9AA8]">
          {rank ? (
            <>
              Ranked <b className="font-medium text-[#D9D7E0]">#{rank}</b>{' '}
              overall
              {best ? (
                <>
                  ; strongest in{' '}
                  <b className="font-medium text-[#D9D7E0]">
                    {domainLabel(best[0])} {fmt(best[1])}
                  </b>
                </>
              ) : null}
              .{' '}
            </>
          ) : (
            <span className="text-[#F5C86B]">
              Provisional — fewer than {MIN_SOURCES} independent
              publishers.{' '}
            </span>
          )}
          Scored by{' '}
          <b className="font-medium text-[#D9D7E0]">
            {row.covered} of {row.coverable}
          </b>{' '}
          boards
          {row.reports > 0 ? (
            <>
              {' '}
              and <b className="font-medium text-[#D9D7E0]">
                {row.reports}
              </b>{' '}
              report
              {row.reports > 1 ? 's' : ''} ✱
            </>
          ) : null}
          ; evidence{' '}
          <b className="font-medium text-[#D9D7E0]">
            {Math.round(row.evidence * 100)}%
          </b>{' '}
          of available weight
          {row.covered > 1 ? (
            <>
              ; boards <span className={agree.tone}>{agree.label}</span>
            </>
          ) : null}
          .
        </p>

        <h4 className={cn(LABEL, 'mb-2')}>Scores by domain</h4>
        <div className="flex flex-col gap-1.5">
          {taxonomy.map(([category, domains]) => {
            const c = row.byCategory[category] ?? null;
            const present = domains.filter(
              (d) => (row.byDomain[d] ?? null) !== null,
            );
            if (c === null && present.length === 0) return null;
            // A category with one domain of the same name would print twice.
            const chips =
              present.length === 1 &&
              domainLabel(present[0]) === domainLabel(category)
                ? []
                : present;
            return (
              <div
                key={category}
                className="text-caption flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="w-28 shrink-0 text-white">
                  {domainLabel(category)}
                  <span className="text-g2 ml-1.5 font-mono">{fmt(c)}</span>
                </span>
                {chips.map((d) => (
                  <span
                    key={d}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5">
                    <span className="text-g2">{domainLabel(d)}</span>{' '}
                    <span className="font-mono text-white">
                      {fmt(row.byDomain[d])}
                    </span>
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- access ---- */}
      <div className="min-w-0">
        <h4 className={cn(LABEL, 'mb-2')}>How to call it</h4>
        {recommended ? (
          <div className="flex flex-col gap-2">
            <ChannelCard
              channel={recommended}
              recommended
              price={priceLabel(or?.inputPerM, or?.outputPerM)}
            />
            {alternatives.map((ch) => (
              <ChannelCard
                key={ch.kind}
                channel={ch}
              />
            ))}
            <p className="text-micro text-[#78758A]">
              One rule for every model: the OpenRouter id through its
              OpenAI-compatible endpoint first — one key, every listed model,
              ids stable across vendors — the vendor’s own API for first-party
              features, the weights for self-hosting. Prices are the router’s
              {catalogDate ? ` on ${catalogDate}` : ''} and move; nothing here
              is an endorsement.
            </p>
          </div>
        ) : (
          <p className="text-caption text-[#9C9AA8]">
            No access channel on file
            {catalogDate ? ` as of ${catalogDate}` : ''}. The catalog does not
            list this model under this name; it may be reachable under a dated
            or regional id.
          </p>
        )}
      </div>

      {/* ---- provenance ---- */}
      <div className="min-w-0 lg:col-span-2">
        <h4 className={cn(LABEL, 'mb-2')}>
          Every figure and where it came from
        </h4>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          {[...boards, ...reports].map((src) => {
            const present = src.measures.filter((m) => scored.has(m.id));
            if (present.length === 0) return null;
            const first = scored.get(present[0].id)!;
            const h = src.headline;
            return (
              <div
                key={src.id}
                className={cn(present.length > 2 && 'md:col-span-2')}>
                <div className="text-caption mb-1 flex flex-wrap items-center gap-2">
                  <SourceBadge
                    source={src}
                    present
                  />
                  <b className="font-medium text-white">{src.name}</b>
                  {src.kind === 'report' ? (
                    <span className="text-[#E8A9F0]">
                      report by {h.publisher}
                      {h.publishedAt ? `, ${h.publishedAt}` : ''}
                    </span>
                  ) : null}
                  <span className="text-[#78758A]">
                    as{' '}
                    <span className="font-mono">
                      &quot;{first.sourceLabel}&quot;
                    </span>
                    {first.scaffold ? ` via ${first.scaffold}` : ''}
                  </span>
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-p1 ml-auto underline underline-offset-2">
                    source
                  </a>
                </div>
                <dl
                  className={cn(
                    'text-caption grid grid-cols-1 gap-x-6 gap-y-0.5 pl-9',
                    present.length > 2 && 'sm:grid-cols-2 lg:grid-cols-3',
                  )}>
                  {present.map((m) => {
                    const s = scored.get(m.id)!;
                    return (
                      <div
                        key={m.id}
                        className="flex items-baseline gap-2"
                        title={`${m.category} › ${m.domain}`}>
                        <dt className="text-g2 w-40 shrink-0 truncate">
                          {m.name.replace(/^.*· /, '')}
                        </dt>
                        <dd className="font-mono text-[#D9D7E0]">
                          {rawLabel(m.metric, s.raw)}
                          {s.stderr !== undefined ? (
                            <span className="text-[#78758A]">
                              {' '}
                              ± {s.stderr}
                            </span>
                          ) : null}
                        </dd>
                        <dd className="text-g2 font-mono">
                          → {fmt(s.normalized)}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChannelCard({
  channel,
  recommended = false,
  price,
}: {
  channel: Channel;
  recommended?: boolean;
  price?: string | null;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-2.5 py-2.5',
        recommended
          ? 'border-primary/50 bg-primary/[0.08]'
          : 'border-white/10 bg-white/[0.03]',
      )}>
      <div className="text-caption flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {recommended ? (
          <span className="text-micro border-primary/60 rounded border px-1 py-px font-semibold tracking-wide text-white uppercase">
            Recommended
          </span>
        ) : null}
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-medium text-white underline underline-offset-2">
          {channel.name}
        </a>
        <span className="text-[#9C9AA8]">{channel.note}</span>
      </div>
      {channel.model ? (
        <div className="text-caption mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-0.5">
          <span>
            <span className="text-[#78758A]">model </span>
            <code
              className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[#D9D7E0] select-all"
              onClick={(e) => e.stopPropagation()}>
              {channel.model}
            </code>
          </span>
          {channel.baseUrl ? (
            <span>
              <span className="text-[#78758A]">base </span>
              <code
                className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[#D9D7E0] select-all"
                onClick={(e) => e.stopPropagation()}>
                {channel.baseUrl}
              </code>
            </span>
          ) : null}
          {price ? <span className="text-[#9C9AA8]">{price}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
