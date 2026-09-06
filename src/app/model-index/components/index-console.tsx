'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/utils';

import type { Benchmark, Model, Score } from '../data/types';
import type { AggregateRow } from '../lib/aggregate';
import { aggregate, presets } from '../lib/aggregate';

const PANEL =
  'rounded-xl border border-[#2C2C31] bg-white/[0.045] backdrop-blur-sm';

const ACCENT = 'text-[#6EE7A0]';

interface Props {
  models: Model[];
  benchmarks: Benchmark[];
  scores: Score[];
}

const fmt = (n: number) => n.toFixed(1);

/** Raw scores print in their own units, so a reader can check them against the source. */
function rawLabel(metric: Benchmark['metric'], raw: number) {
  if (metric === 'elo') return String(Math.round(raw));
  if (metric === 'percent') return `${raw}%`;
  return String(raw);
}

/** Wide disagreement between boards is a caveat on the aggregate, so it is shown. */
function dispersionNote(d: number) {
  if (d >= 18) return { label: 'boards disagree', tone: 'text-[#F08A8A]' };
  if (d >= 9) return { label: 'mixed', tone: 'text-[#F5C86B]' };
  return { label: 'consistent', tone: 'text-[#78758A]' };
}

export default function IndexConsole({ models, benchmarks, scores }: Props) {
  const [weights, setWeights] = useState<Record<string, number>>(
    presets[0].weights,
  );
  const [useConfidence, setUseConfidence] = useState(true);
  const [openModel, setOpenModel] = useState<string | null>(null);

  const activePreset = presets.find((p) =>
    benchmarks.every((b) => p.weights[b.id] === weights[b.id]),
  );

  const rows = useMemo(
    () => aggregate({ models, benchmarks, scores, weights, useConfidence }),
    [models, benchmarks, scores, weights, useConfidence],
  );

  const total = benchmarks.reduce((sum, b) => sum + (weights[b.id] ?? 0), 0);
  const share = (id: string) =>
    total > 0 ? Math.round(((weights[id] ?? 0) / total) * 100) : 0;

  const benchById = useMemo(
    () => new Map(benchmarks.map((b) => [b.id, b])),
    [benchmarks],
  );

  return (
    <div className="flex flex-col gap-8">
      {/* ---------------- weighting console ---------------- */}
      <section
        className={cn(PANEL, 'p-5 lg:p-6')}
        aria-label="Weighting console">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-micro text-g2 mr-1 tracking-[0.14em] uppercase">
            Preset
          </span>
          {presets.map((p) => {
            const on = activePreset?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setWeights(p.weights)}
                aria-pressed={on}
                title={p.blurb}
                className={cn(
                  'text-caption rounded-full border px-3 py-1 font-medium transition-colors',
                  on
                    ? 'border-primary bg-primary/20 text-white'
                    : 'text-g2 border-white/12 hover:border-white/30 hover:text-white',
                )}>
                {p.name}
              </button>
            );
          })}
        </div>

        <p className="text-g2 text-body-sm mb-5 max-w-[68ch]">
          {activePreset
            ? activePreset.blurb
            : 'Custom weighting. Shares are relative — only the ratio between sliders matters.'}
        </p>

        <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
          {benchmarks.map((b) => (
            <div key={b.id}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <label
                  htmlFor={`w-${b.id}`}
                  className="text-body-sm font-medium text-white">
                  {b.name}
                  <span className="text-g2 ml-2 font-normal">{b.domain}</span>
                </label>
                <span className="text-caption text-p1 font-mono">
                  {share(b.id)}%
                </span>
              </div>
              <input
                id={`w-${b.id}`}
                type="range"
                min={0}
                max={100}
                step={5}
                value={weights[b.id] ?? 0}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, [b.id]: Number(e.target.value) }))
                }
                className="accent-primary h-1.5 w-full cursor-pointer"
              />
            </div>
          ))}
        </div>

        <label className="text-body-sm mt-6 flex cursor-pointer items-start gap-2.5 border-t border-white/8 pt-5">
          <input
            type="checkbox"
            checked={useConfidence}
            onChange={(e) => setUseConfidence(e.target.checked)}
            className="accent-primary mt-0.5"
          />
          <span>
            <b className="font-medium text-white">Confidence weighting</b>{' '}
            <span className="text-g2">
              — down-weight scores whose publisher reports a wide error bar,
              relative to that board&apos;s spread.
            </span>
          </span>
        </label>
      </section>

      {/* ---------------- leaderboard ---------------- */}
      <section aria-label="Aggregated leaderboard">
        <div className={cn(PANEL, 'overflow-hidden')}>
          <table className="text-body-sm w-full border-collapse text-left">
            <thead>
              <tr className="text-micro bg-white/4 tracking-[0.1em] text-[#78758A] uppercase">
                <th className="w-12 px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Index</th>
                <th className="px-4 py-3 font-medium max-sm:hidden">
                  Coverage
                </th>
                <th className="px-4 py-3 font-medium max-md:hidden">
                  Agreement
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <Row
                  key={row.model.id}
                  row={row}
                  rank={i + 1}
                  open={openModel === row.model.id}
                  onToggle={() =>
                    setOpenModel(
                      openModel === row.model.id ? null : row.model.id,
                    )
                  }
                  benchById={benchById}
                  weights={weights}
                />
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-caption text-g2 mt-3">
          Index is a 0–100 standardized score: 50 is average across the models
          listed, not an absolute grade. Rankings hold only for the weighting
          above.
        </p>
      </section>
    </div>
  );
}

function Row({
  row,
  rank,
  open,
  onToggle,
  benchById,
  weights,
}: {
  row: AggregateRow;
  rank: number;
  open: boolean;
  onToggle: () => void;
  benchById: Map<string, Benchmark>;
  weights: Record<string, number>;
}) {
  const thin = row.covered > 0 && row.covered < row.coverable;
  const disp = dispersionNote(row.dispersion);

  return (
    <>
      <tr
        className={cn(
          'cursor-pointer border-t border-white/8 align-middle transition-colors hover:bg-white/4',
          open && 'bg-white/4',
        )}
        onClick={onToggle}>
        <td className="text-g2 px-4 py-3 font-mono">{rank}</td>
        <td className="px-4 py-3">
          <b className="font-semibold text-white">{row.model.name}</b>
          <span className="text-g2 ml-2">{row.model.org}</span>
        </td>
        <td className="px-4 py-3">
          {row.score === null ? (
            <span className="text-[#78758A]">no data</span>
          ) : (
            <span className={cn('font-mono font-semibold', ACCENT)}>
              {fmt(row.score)}
            </span>
          )}
        </td>
        <td className="px-4 py-3 max-sm:hidden">
          <span className={thin ? 'text-[#F5C86B]' : 'text-g2'}>
            {row.covered}/{row.coverable}
          </span>
        </td>
        <td className={cn('px-4 py-3 max-md:hidden', disp.tone)}>
          {row.covered > 1 ? disp.label : '—'}
        </td>
        <td className="text-g2 px-4 py-3">
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
            colSpan={6}
            className="px-4 py-4">
            {thin ? (
              <p className="text-caption mb-3 text-[#F5C86B]">
                Rated on {row.covered} of {row.coverable} weighted boards. Its
                index is computed from those alone — missing scores are not
                filled in — so it rests on less evidence than a fully covered
                model.
              </p>
            ) : null}
            <dl className="flex flex-col gap-2.5">
              {row.perBenchmark.map((s) => {
                const b = benchById.get(s.benchmarkId)!;
                const weighted = (weights[s.benchmarkId] ?? 0) > 0;
                return (
                  <div
                    key={s.benchmarkId}
                    className={cn(
                      'text-caption flex flex-wrap items-baseline gap-x-3 gap-y-1',
                      !weighted && 'opacity-45',
                    )}>
                    <dt className="w-40 shrink-0 font-medium text-white">
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
                      {!weighted ? ' · weight 0' : ''}
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
