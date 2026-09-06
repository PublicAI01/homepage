'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/utils';

import type { Benchmark, Model, Score } from '../data/types';
import { aggregate, type AggregateRow, compareScores } from '../lib/aggregate';
import { type BoardView, groupBoards } from '../lib/boards';
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

const PANEL =
  'rounded-xl border border-[#2C2C31] bg-white/[0.045] backdrop-blur-sm';
const INDEX_TONE = 'text-[#6EE7A0]';
const CONTROL =
  'text-caption rounded-md border border-white/12 bg-transparent px-2.5 py-1.5 text-white outline-none focus:border-primary';
const CHIP =
  'text-caption rounded-md border px-2.5 py-1 font-medium transition-colors';
const CHIP_ON = 'border-primary bg-primary/20 text-white';
const CHIP_OFF =
  'text-g2 border-white/12 hover:border-white/30 hover:text-white';
const PAGE = 100;

interface Props {
  models: Model[];
  benchmarks: Benchmark[];
  scores: Score[];
}

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
  return { label: 'consistent', tone: 'text-[#78758A]' };
}

const keyOf = (row: AggregateRow, k: RankKey): number | null => {
  if (k.level === 'overall') return row.score;
  if (k.level === 'category') return row.byCategory[k.category] ?? null;
  return row.byDomain[k.domain] ?? null;
};

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
        'text-micro inline-flex h-5 min-w-7 items-center justify-center rounded border px-1 font-mono font-semibold tracking-wide',
        present
          ? badge.tone
          : 'border-dashed border-white/12 text-white/25 opacity-70',
      )}>
      {badge.code}
    </span>
  );
}

export default function IndexTable({ models, benchmarks, scores }: Props) {
  const [rankKey, setRankKey] = useState<RankKey>({ level: 'overall' });
  const [query, setQuery] = useState('');
  const [org, setOrg] = useState('all');
  const [minBoards, setMinBoards] = useState(MIN_SOURCES);
  const [mustHave, setMustHave] = useState<Set<string>>(new Set());
  const [openModel, setOpenModel] = useState<string | null>(null);

  const weights = useMemo(() => weightsFor(benchmarks), [benchmarks]);
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
      if (org !== 'all' && r.model.org !== org) return false;
      if (q && !`${r.model.name} ${r.model.org}`.toLowerCase().includes(q))
        return false;
      const has = sourcesScoring.get(r.model.id)!;
      for (const b of mustHave) if (!has.has(b)) return false;
      return true;
    });
    if (rankKey.level !== 'overall') {
      const by = compareScores<AggregateRow>((r) => keyOf(r, rankKey));
      out = [...out]
        // A model with no figure in this scope is not "last": it is absent.
        .filter((r) => keyOf(r, rankKey) !== null)
        .sort((a, b) => Number(b.ranked) - Number(a.ranked) || by(a, b));
    }
    return out;
  }, [rows, query, org, minBoards, mustHave, rankKey, sourcesScoring]);

  const rankedCount = rows.filter((r) => r.ranked).length;
  const shown = filtered.slice(0, PAGE);
  const coverable = rows[0]?.coverable ?? boards.length;

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

  return (
    <div>
      {/* ---------------- filters ---------------- */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search model or organisation"
          aria-label="Search"
          className={cn(CONTROL, 'w-56 placeholder:text-[#78758A]')}
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
        <span className="text-micro text-g2 ml-1 tracking-[0.14em] uppercase">
          Must include
        </span>
        {sources.map((s) => {
          const on = mustHave.has(s.id);
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggleSource(s.id)}
              title={s.name}
              className={cn(
                'rounded-md border p-0.5 transition-colors',
                on
                  ? 'border-primary'
                  : 'border-transparent hover:border-white/20',
              )}>
              <SourceBadge
                source={s}
                present
              />
            </button>
          );
        })}
      </div>

      {/* ---------------- rank by: category, then domain ---------------- */}
      <div
        role="tablist"
        aria-label="Rank by category"
        className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="text-micro text-g2 mr-2 tracking-[0.14em] uppercase">
          Rank by
        </span>
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
              <span className="ml-1.5 font-mono text-[10px] opacity-60">
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
          className="mb-3 flex flex-wrap items-center gap-1.5 pl-1">
          <span className="text-micro mr-2 tracking-[0.14em] text-[#78758A] uppercase">
            {domainLabel(activeCategory)} ›
          </span>
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

      <p className="text-caption mb-2 text-[#78758A]">
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

      {/* ---------------- table ---------------- */}
      <div className={cn(PANEL, 'overflow-x-auto')}>
        <table className="text-body-sm w-full border-collapse text-left whitespace-nowrap">
          <thead>
            <tr className="text-micro bg-white/4 tracking-[0.1em] text-[#78758A] uppercase">
              <th className="w-10 px-3 py-3 font-medium">#</th>
              <th className="px-3 py-3 font-medium">Model</th>
              <th
                className={cn(
                  'px-3 py-3 text-right font-medium',
                  rankKey.level === 'overall' && 'text-white',
                )}>
                Index
              </th>
              {rankKey.level !== 'overall' ? (
                <th className="px-3 py-3 text-right font-medium text-white">
                  {rankLabel(rankKey)}
                </th>
              ) : null}
              <th className="px-3 py-3 font-medium">Sources</th>
              <th className="w-8 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <Row
                key={row.model.id}
                row={row}
                rank={rankOf.get(row.model.id)}
                rankKey={rankKey}
                taxonomy={taxonomy}
                boards={boards}
                reports={reports}
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
        not an absolute grade. Thin evidence is pulled toward 50. A model scored
        by fewer than {MIN_SOURCES} recognised boards is listed as provisional
        without a rank; figures from reports ✱ shape category and domain columns
        only. A filled badge means that source scored the model; hover for the
        source and its figure.
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
  rankKey,
  taxonomy,
  boards,
  reports,
  open,
  onToggle,
}: {
  row: AggregateRow;
  rank: number | undefined;
  rankKey: RankKey;
  taxonomy: [string, string[]][];
  boards: BoardView[];
  reports: BoardView[];
  open: boolean;
  onToggle: () => void;
}) {
  const thin = row.ranked && row.covered < row.coverable;
  const agree = agreement(row.dispersion);
  const scored = new Map(row.perBenchmark.map((s) => [s.benchmarkId, s]));
  const reportsScoring = reports.filter((r) =>
    r.measures.some((m) => scored.has(m.id)),
  );

  return (
    <>
      <tr
        className={cn(
          'cursor-pointer border-t border-white/8 align-middle transition-colors hover:bg-white/4',
          open && 'bg-white/4',
        )}
        onClick={onToggle}>
        <td className="text-g2 px-3 py-2.5 font-mono">
          {rank ?? (
            <span title="Provisional — not enough recognised boards">—</span>
          )}
        </td>
        <td className="px-3 py-2.5">
          <b
            className={cn(
              'font-semibold',
              row.ranked ? 'text-white' : 'text-[#B9B7C4]',
            )}>
            {row.model.name}
          </b>
          <span className="text-g2 ml-2 text-xs">{row.model.org}</span>
          {!row.ranked ? (
            <span className="text-micro ml-2 rounded border border-white/12 px-1 py-px text-[#78758A]">
              provisional
            </span>
          ) : null}
        </td>
        <td
          className={cn(
            'px-3 py-2.5 text-right font-mono font-semibold',
            row.ranked ? INDEX_TONE : 'text-[#78758A]',
          )}>
          {fmt(row.score)}
        </td>
        {rankKey.level !== 'overall' ? (
          <td className="px-3 py-2.5 text-right font-mono text-white">
            {fmt(keyOf(row, rankKey))}
          </td>
        ) : null}
        <td className="px-3 py-2.5">
          <span className="flex items-center gap-1">
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
                  'text-micro inline-flex h-5 min-w-7 items-center justify-center rounded border px-1 font-mono font-semibold',
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
        <td className="text-g2 px-3 py-2.5">
          <span
            aria-hidden
            className="inline-block transition-transform"
            style={{ transform: open ? 'rotate(90deg)' : 'none' }}>
            ›
          </span>
          <span className="sr-only">
            {open ? 'Hide' : 'Show'} details for {row.model.name}
          </span>
        </td>
      </tr>

      {open ? (
        <tr className="border-t border-white/8 bg-[#161618]">
          <td
            colSpan={6}
            className="px-4 py-4 whitespace-normal">
            <div className="text-caption mb-3 flex flex-wrap gap-x-5 gap-y-1 text-[#78758A]">
              <span>
                Scored by{' '}
                <b className="font-medium text-[#D9D7E0]">
                  {row.covered} of {row.coverable}
                </b>{' '}
                recognised boards
                {row.reports > 0 ? (
                  <>
                    {' '}
                    and{' '}
                    <b className="font-medium text-[#D9D7E0]">
                      {row.reports}
                    </b>{' '}
                    report{row.reports > 1 ? 's' : ''} ✱
                  </>
                ) : null}
              </span>
              <span>
                Evidence{' '}
                <b className="font-medium text-[#D9D7E0]">
                  {Math.round(row.evidence * 100)}%
                </b>{' '}
                of available board weight
              </span>
              {row.covered > 1 ? (
                <span>
                  Board agreement:{' '}
                  <span className={agree.tone}>{agree.label}</span>
                </span>
              ) : null}
              {!row.ranked ? (
                <span className="text-[#F5C86B]">
                  Provisional: fewer than {MIN_SOURCES} recognised boards.
                </span>
              ) : null}
            </div>

            {/* category → domain scores */}
            <div className="mb-4 flex flex-col gap-1.5">
              {taxonomy.map(([category, domains]) => {
                const c = row.byCategory[category] ?? null;
                const present = domains.filter(
                  (d) => (row.byDomain[d] ?? null) !== null,
                );
                if (c === null && present.length === 0) return null;
                return (
                  <div
                    key={category}
                    className="text-caption flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="w-32 shrink-0 text-white">
                      {domainLabel(category)}
                      <span className="text-g2 ml-1.5 font-mono">{fmt(c)}</span>
                    </span>
                    {present.map((d) => (
                      <span
                        key={d}
                        className="rounded-md border border-white/12 px-1.5 py-0.5">
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

            {/* provenance, grouped by source */}
            <div className="flex flex-col gap-3">
              {[...boards, ...reports].map((src) => {
                const present = src.measures.filter((m) => scored.has(m.id));
                if (present.length === 0) return null;
                const first = scored.get(present[0].id)!;
                const h = src.headline;
                return (
                  <div key={src.id}>
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
                    <dl className="text-caption grid grid-cols-1 gap-x-6 gap-y-0.5 pl-9 sm:grid-cols-2">
                      {present.map((m) => {
                        const s = scored.get(m.id)!;
                        return (
                          <div
                            key={m.id}
                            className="flex items-baseline gap-2"
                            title={`${m.category} › ${m.domain}`}>
                            <dt className="text-g2 w-44 shrink-0 truncate">
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
          </td>
        </tr>
      ) : null}
    </>
  );
}
