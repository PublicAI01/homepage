'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/utils';

import type { Benchmark, Model, Score } from '../data/types';
import { aggregate, type AggregateRow, compareScores } from '../lib/aggregate';
import {
  domainLabel,
  FALLBACK_BADGE,
  SOURCE_BADGE,
  WEIGHTS,
} from '../lib/weights';

const PANEL =
  'rounded-xl border border-[#2C2C31] bg-white/[0.045] backdrop-blur-sm';

const INDEX_TONE = 'text-[#6EE7A0]';

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
  benchmark,
  present,
  detail,
}: {
  benchmark: Benchmark;
  present: boolean;
  detail?: string;
}) {
  const badge = SOURCE_BADGE[benchmark.id] ?? FALLBACK_BADGE;
  const label = present
    ? `${benchmark.name}${detail ? ` — ${detail}` : ''}`
    : `${benchmark.name} — not listed`;
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
  const [openModel, setOpenModel] = useState<string | null>(null);

  const weighted = useMemo(
    () => benchmarks.filter((b) => (WEIGHTS[b.id] ?? 0) > 0),
    [benchmarks],
  );
  const domains = useMemo(
    () => [...new Set(weighted.map((b) => b.domain))],
    [weighted],
  );

  const rows = useMemo(
    () => aggregate({ models, benchmarks, scores, weights: WEIGHTS }),
    [models, benchmarks, scores],
  );

  const sorted = useMemo(() => {
    if (sortKey === 'overall') return rows;
    return [...rows].sort(compareScores((r) => r.byDomain[sortKey] ?? null));
  }, [rows, sortKey]);

  const benchById = useMemo(
    () => new Map(benchmarks.map((b) => [b.id, b])),
    [benchmarks],
  );

  const tabs: { key: 'overall' | string; label: string }[] = [
    { key: 'overall', label: 'Overall' },
    ...domains.map((d) => ({ key: d, label: domainLabel(d) })),
  ];

  return (
    <div>
      {/* ---------------- domain tabs ---------------- */}
      <div
        role="tablist"
        aria-label="Rank by"
        className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-micro text-g2 mr-2 tracking-[0.14em] uppercase">
          Rank by
        </span>
        {tabs.map((t) => {
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
              {domains.map((d) => (
                <th
                  key={d}
                  className={cn(
                    'px-3 py-3 text-right font-medium',
                    sortKey === d ? 'text-white' : 'max-xl:hidden',
                  )}>
                  {domainLabel(d)}
                </th>
              ))}
              <th className="px-3 py-3 font-medium">Sources</th>
              <th className="w-8 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <Row
                key={row.model.id}
                row={row}
                rank={i + 1}
                domains={domains}
                sortKey={sortKey}
                weighted={weighted}
                benchById={benchById}
                open={openModel === row.model.id}
                onToggle={() =>
                  setOpenModel(openModel === row.model.id ? null : row.model.id)
                }
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-caption text-g2 mt-3 max-w-[76ch]">
        Scores are 0–100 standardized: 50 is average across the models listed,
        not an absolute grade. A filled source badge means that board scored the
        model; a dashed one means it did not list it. Hover a badge for the
        board and the raw score.
      </p>
    </div>
  );
}

function Row({
  row,
  rank,
  domains,
  sortKey,
  weighted,
  benchById,
  open,
  onToggle,
}: {
  row: AggregateRow;
  rank: number;
  domains: string[];
  sortKey: string;
  weighted: Benchmark[];
  benchById: Map<string, Benchmark>;
  open: boolean;
  onToggle: () => void;
}) {
  const thin = row.covered > 0 && row.covered < row.coverable;
  const agree = agreement(row.dispersion);
  const scored = new Map(row.perBenchmark.map((s) => [s.benchmarkId, s]));
  const colSpan = 5 + domains.length;

  return (
    <>
      <tr
        className={cn(
          'cursor-pointer border-t border-white/8 align-middle transition-colors hover:bg-white/4',
          open && 'bg-white/4',
        )}
        onClick={onToggle}>
        <td className="text-g2 px-3 py-2.5 font-mono">{rank}</td>
        <td className="px-3 py-2.5">
          <b className="font-semibold text-white">{row.model.name}</b>
          <span className="text-g2 ml-2 text-xs">{row.model.org}</span>
        </td>
        <td
          className={cn(
            'px-3 py-2.5 text-right font-mono font-semibold',
            INDEX_TONE,
          )}>
          {fmt(row.score)}
        </td>
        {domains.map((d) => (
          <td
            key={d}
            className={cn(
              'px-3 py-2.5 text-right font-mono',
              sortKey === d ? 'text-white' : 'text-[#D9D7E0] max-xl:hidden',
              row.byDomain[d] === null && 'text-[#78758A]',
            )}>
            {fmt(row.byDomain[d] ?? null)}
          </td>
        ))}
        <td className="px-3 py-2.5">
          <span className="flex items-center gap-1">
            {weighted.map((b) => {
              const s = scored.get(b.id);
              return (
                <SourceBadge
                  key={b.id}
                  benchmark={b}
                  present={Boolean(s)}
                  detail={s ? rawLabel(b.metric, s.raw) : undefined}
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
            {open ? 'Hide' : 'Show'} source scores for {row.model.name}
          </span>
        </td>
      </tr>

      {open ? (
        <tr className="border-t border-white/8 bg-[#161618]">
          <td
            colSpan={colSpan}
            className="px-4 py-4 whitespace-normal">
            {thin ? (
              <p className="text-caption mb-3 text-[#F5C86B]">
                Scored by {row.covered} of {row.coverable} sources. The index is
                computed from those alone — missing scores are not filled in —
                so it rests on less evidence than a fully covered model.
              </p>
            ) : null}
            {row.covered > 1 ? (
              <p className="text-caption mb-3 text-[#78758A]">
                Board agreement:{' '}
                <span className={agree.tone}>{agree.label}</span>
              </p>
            ) : null}
            <dl className="flex flex-col gap-2.5">
              {row.perBenchmark.map((s) => {
                const b = benchById.get(s.benchmarkId)!;
                return (
                  <div
                    key={s.benchmarkId}
                    className="text-caption flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <dt className="flex w-44 shrink-0 items-center gap-2 font-medium text-white">
                      <SourceBadge
                        benchmark={b}
                        present
                      />
                      {b.name}
                    </dt>
                    <dd className="font-mono text-[#D9D7E0]">
                      {rawLabel(b.metric, s.raw)}
                      {s.stderr !== undefined ? (
                        <span className="text-[#78758A]"> ± {s.stderr}</span>
                      ) : null}
                    </dd>
                    <dd className="text-g2">
                      → <span className="font-mono">{fmt(s.normalized)}</span>
                    </dd>
                    <dd className="text-[#78758A]">
                      as{' '}
                      <span className="font-mono">
                        &quot;{s.sourceLabel}&quot;
                      </span>
                      {s.scaffold ? ` via ${s.scaffold}` : ''}
                    </dd>
                    <dd className="ml-auto">
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-p1 underline underline-offset-2">
                        source
                      </a>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </td>
        </tr>
      ) : null}
    </>
  );
}
