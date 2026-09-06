'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/utils';

import type { Benchmark, Model, Score } from '../data/types';
import { aggregate, type AggregateRow, compareScores } from '../lib/aggregate';
import { type BoardView, groupBoards } from '../lib/boards';
import {
  domainLabel,
  FALLBACK_BADGE,
  MIN_SOURCES,
  OVERALL,
  PRIOR_FRACTION,
  SOURCE_BADGE,
  WEIGHTS,
} from '../lib/weights';

const PANEL =
  'rounded-xl border border-[#2C2C31] bg-white/[0.045] backdrop-blur-sm';
const INDEX_TONE = 'text-[#6EE7A0]';
const CONTROL =
  'text-caption rounded-md border border-white/12 bg-transparent px-2.5 py-1.5 text-white outline-none focus:border-primary';
const PAGE = 100;

interface Props {
  models: Model[];
  benchmarks: Benchmark[];
  scores: Score[];
}

const fmt = (n: number | null) => (n === null ? '—' : n.toFixed(1));

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

export function SourceBadge({
  board,
  present,
  detail,
}: {
  board: BoardView;
  present: boolean;
  detail?: string;
}) {
  const badge = SOURCE_BADGE[board.id] ?? FALLBACK_BADGE;
  const name = board.headline.name;
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
  const [sortKey, setSortKey] = useState<'overall' | string>('overall');
  const [query, setQuery] = useState('');
  const [org, setOrg] = useState('all');
  const [minBoards, setMinBoards] = useState(MIN_SOURCES);
  const [mustHave, setMustHave] = useState<Set<string>>(new Set());
  const [openModel, setOpenModel] = useState<string | null>(null);

  const weighted = useMemo(
    () => benchmarks.filter((b) => (WEIGHTS[b.id] ?? 0) > 0),
    [benchmarks],
  );
  const boards = useMemo(() => groupBoards(weighted), [weighted]);
  const domains = useMemo(
    () => [...new Set(weighted.map((b) => b.domain))],
    [weighted],
  );
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
        weights: WEIGHTS,
        overall: OVERALL,
        priorFraction: PRIOR_FRACTION,
        minSources: MIN_SOURCES,
      }),
    [models, benchmarks, scores],
  );

  const rankOf = useMemo(() => {
    const m = new Map<string, number>();
    let n = 0;
    for (const r of rows) if (r.ranked) m.set(r.model.id, ++n);
    return m;
  }, [rows]);

  const boardsScoring = useMemo(() => {
    const groupOf = new Map(benchmarks.map((b) => [b.id, b.group ?? b.id]));
    const m = new Map<string, Set<string>>();
    for (const r of rows) {
      m.set(
        r.model.id,
        new Set(
          r.perBenchmark
            .filter((s) => (WEIGHTS[s.benchmarkId] ?? 0) > 0)
            .map((s) => groupOf.get(s.benchmarkId)!),
        ),
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
      const has = boardsScoring.get(r.model.id)!;
      for (const b of mustHave) if (!has.has(b)) return false;
      return true;
    });
    if (sortKey !== 'overall') {
      const byDomain = compareScores<AggregateRow>(
        (r) => r.byDomain[sortKey] ?? null,
      );
      out = [...out].sort(
        (a, b) => Number(b.ranked) - Number(a.ranked) || byDomain(a, b),
      );
    }
    return out;
  }, [rows, query, org, minBoards, mustHave, sortKey, boardsScoring]);

  const rankedCount = rows.filter((r) => r.ranked).length;
  const shown = filtered.slice(0, PAGE);
  const coverable = rows[0]?.coverable ?? boards.length;

  const toggleBoard = (id: string) =>
    setMustHave((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

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
          aria-label="Minimum sources"
          className={CONTROL}>
          {Array.from({ length: coverable }, (_, i) => i + 1).map((n) => (
            <option
              key={n}
              value={n}>
              {n === 1
                ? 'Any coverage (incl. provisional)'
                : `Scored by ${n}+ boards`}
            </option>
          ))}
        </select>
        <span className="text-micro text-g2 ml-1 tracking-[0.14em] uppercase">
          Must include
        </span>
        {boards.map((b) => {
          const on = mustHave.has(b.id);
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggleBoard(b.id)}
              title={b.headline.name}
              className={cn(
                'rounded-md border p-0.5 transition-colors',
                on
                  ? 'border-primary'
                  : 'border-transparent hover:border-white/20',
              )}>
              <SourceBadge
                board={b}
                present
              />
            </button>
          );
        })}
      </div>

      {/* ---------------- domain tabs ---------------- */}
      <div
        role="tablist"
        aria-label="Rank by"
        className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-micro text-g2 mr-2 tracking-[0.14em] uppercase">
          Rank by
        </span>
        {[
          { key: 'overall', label: 'Overall' },
          ...domains.map((d) => ({ key: d, label: domainLabel(d) })),
        ].map((t) => {
          const on = sortKey === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setSortKey(t.key)}
              className={cn(
                'text-caption rounded-md border px-2.5 py-1 font-medium transition-colors',
                on
                  ? 'border-primary bg-primary/20 text-white'
                  : 'text-g2 border-white/12 hover:border-white/30 hover:text-white',
              )}>
              {t.label}
            </button>
          );
        })}
      </div>

      <p className="text-caption mb-2 text-[#78758A]">
        <span className="text-[#D9D7E0]">{rankedCount}</span> ranked ·{' '}
        <span className="text-[#D9D7E0]">{rows.length - rankedCount}</span>{' '}
        provisional (one source) · showing{' '}
        <span className="text-[#D9D7E0]">
          {shown.length}
          {filtered.length > shown.length ? ` of ${filtered.length}` : ''}
        </span>
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
                  sortKey === 'overall' && 'text-white',
                )}>
                Index
              </th>
              {sortKey !== 'overall' ? (
                <th className="px-3 py-3 text-right font-medium text-white">
                  {domainLabel(sortKey)}
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
                sortKey={sortKey}
                domains={domains}
                boards={boards}
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
        not an absolute grade. Thin evidence is pulled toward 50, and a model
        scored by fewer than {MIN_SOURCES} boards is listed as provisional
        without a rank. A filled badge means that board scored the model; a
        dashed one means it did not list it. Hover a badge for the board and its
        headline figure.
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
  sortKey,
  domains,
  boards,
  open,
  onToggle,
}: {
  row: AggregateRow;
  rank: number | undefined;
  sortKey: string;
  domains: string[];
  boards: BoardView[];
  open: boolean;
  onToggle: () => void;
}) {
  const thin = row.ranked && row.covered < row.coverable;
  const agree = agreement(row.dispersion);
  const scored = new Map(row.perBenchmark.map((s) => [s.benchmarkId, s]));

  return (
    <>
      <tr
        className={cn(
          'cursor-pointer border-t border-white/8 align-middle transition-colors hover:bg-white/4',
          open && 'bg-white/4',
        )}
        onClick={onToggle}>
        <td className="text-g2 px-3 py-2.5 font-mono">
          {rank ?? <span title="Provisional — one source">—</span>}
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
        {sortKey !== 'overall' ? (
          <td className="px-3 py-2.5 text-right font-mono text-white">
            {fmt(row.byDomain[sortKey] ?? null)}
          </td>
        ) : null}
        <td className="px-3 py-2.5">
          <span className="flex items-center gap-1">
            {boards.map((b) => {
              const s = scored.get(b.headline.id);
              return (
                <SourceBadge
                  key={b.id}
                  board={b}
                  present={Boolean(s)}
                  detail={s ? rawLabel(b.headline.metric, s.raw) : undefined}
                />
              );
            })}
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
                boards
              </span>
              <span>
                Evidence{' '}
                <b className="font-medium text-[#D9D7E0]">
                  {Math.round(row.evidence * 100)}%
                </b>{' '}
                of available weight
              </span>
              {row.covered > 1 ? (
                <span>
                  Board agreement:{' '}
                  <span className={agree.tone}>{agree.label}</span>
                </span>
              ) : null}
              {!row.ranked ? (
                <span className="text-[#F5C86B]">
                  Provisional: one source is not enough to rank on.
                </span>
              ) : null}
            </div>

            <dl className="mb-4 flex flex-wrap gap-1.5">
              {domains.map((d) => {
                const v = row.byDomain[d] ?? null;
                return (
                  <div
                    key={d}
                    className={cn(
                      'text-caption flex items-baseline gap-1.5 rounded-md border px-2 py-1',
                      v === null
                        ? 'border-dashed border-white/10 text-white/30'
                        : 'border-white/12',
                    )}>
                    <dt className="text-g2">{domainLabel(d)}</dt>
                    <dd className="font-mono text-white">{fmt(v)}</dd>
                  </div>
                );
              })}
            </dl>

            <div className="flex flex-col gap-3">
              {boards.map((b) => {
                const present = b.measures.filter((m) => scored.has(m.id));
                if (present.length === 0) return null;
                const first = scored.get(present[0].id)!;
                return (
                  <div key={b.id}>
                    <div className="text-caption mb-1 flex flex-wrap items-center gap-2">
                      <SourceBadge
                        board={b}
                        present
                      />
                      <b className="font-medium text-white">
                        {b.headline.name}
                      </b>
                      <span className="text-[#78758A]">
                        as{' '}
                        <span className="font-mono">
                          &quot;{first.sourceLabel}&quot;
                        </span>
                        {first.scaffold ? ` via ${first.scaffold}` : ''}
                      </span>
                      <a
                        href={b.headline.url}
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
                            className="flex items-baseline gap-2">
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
          </td>
        </tr>
      ) : null}
    </>
  );
}
