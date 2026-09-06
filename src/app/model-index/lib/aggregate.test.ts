import { describe, expect, it } from 'vitest';

import { benchmarks, models, scores } from '../data';
import type { Benchmark, Model, Score } from '../data/types';
import { aggregate, confidenceOf, normalizeBoard } from './aggregate';
import {
  MIN_SOURCES,
  OVERALL,
  PRIOR_FRACTION,
  REPORT_WEIGHT,
  weightFor,
  WEIGHTING,
  weightsFor,
} from './weights';

const bench = (
  id: string,
  group = id,
  extra: Partial<Benchmark> = {},
): Benchmark => ({
  id,
  name: id,
  publisher: 'test',
  url: 'https://example.com',
  retrievedAt: '2026-09-05',
  metric: 'percent',
  category: 'test',
  domain: 'test',
  kind: 'board',
  group,
  ...extra,
});

const model = (id: string): Model => ({ id, name: id, org: 'test' });

const score = (
  modelId: string,
  benchmarkId: string,
  raw: number,
  stderr?: number,
): Score => ({ modelId, benchmarkId, raw, stderr, sourceLabel: modelId });

describe('normalizeBoard', () => {
  it('centres an average score at 50', () => {
    const out = normalizeBoard([10, 20, 30]);
    expect(out[1]).toBeCloseTo(50, 6);
  });

  it('puts scores one standard deviation apart 15 points apart', () => {
    // sd of [0, 10, 20] is 8.165; 10 is the mean, 20 is +1.2247 sd.
    const out = normalizeBoard([0, 10, 20]);
    expect(out[2] - out[1]).toBeCloseTo(15 * 1.224744871, 5);
  });

  it('collapses a board with no spread to the mean instead of amplifying noise', () => {
    expect(normalizeBoard([7, 7, 7])).toEqual([50, 50, 50]);
  });

  it('makes different raw scales comparable', () => {
    // An Elo board and a percentage board with the same shape must normalize
    // identically — this is the whole point of the index.
    const elo = normalizeBoard([1490, 1500, 1510]);
    const pct = normalizeBoard([20, 40, 60]);
    elo.forEach((v, i) => expect(v).toBeCloseTo(pct[i], 6));
  });

  it('clamps extreme outliers into the 0-100 range', () => {
    const out = normalizeBoard([0, 1, 1, 1, 1000]);
    expect(Math.min(...out)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...out)).toBeLessThanOrEqual(100);
  });
});

describe('confidenceOf', () => {
  it('treats a missing error bar as full confidence rather than guessing one', () => {
    expect(confidenceOf(undefined, 40)).toBe(1);
  });

  it('trusts a tight error bar more than a wide one', () => {
    expect(confidenceOf(1, 40)).toBeGreaterThan(confidenceOf(8, 40));
  });

  it('judges an error bar against the board spread, not in absolute terms', () => {
    // The same +/-4 is tight on a 40-point board and useless on a 5-point one.
    expect(confidenceOf(4, 40)).toBeGreaterThan(confidenceOf(4, 5));
  });

  it('never drops to zero, so an uncertain score still counts for something', () => {
    expect(confidenceOf(1000, 1)).toBeGreaterThan(0);
  });
});

describe('aggregate', () => {
  const bs = [bench('a'), bench('b')];
  const ms = [model('m1'), model('m2'), model('m3')];
  const ss = [
    score('m1', 'a', 90),
    score('m2', 'a', 50),
    score('m3', 'a', 10),
    score('m1', 'b', 10),
    score('m2', 'b', 50),
    score('m3', 'b', 90),
  ];

  it('ranks by weighted score, highest first', () => {
    const out = aggregate({
      models: ms,
      benchmarks: bs,
      scores: ss,
      weights: { a: 100, b: 0 },
    });
    expect(out.map((r) => r.model.id)).toEqual(['m1', 'm2', 'm3']);
  });

  it('reverses the ranking when the weights reverse', () => {
    const out = aggregate({
      models: ms,
      benchmarks: bs,
      scores: ss,
      weights: { a: 0, b: 100 },
    });
    expect(out.map((r) => r.model.id)).toEqual(['m3', 'm2', 'm1']);
  });

  it('is unchanged by scaling all weights by the same factor', () => {
    const single = aggregate({
      models: ms,
      benchmarks: bs,
      scores: ss,
      weights: { a: 30, b: 70 },
    });
    const doubled = aggregate({
      models: ms,
      benchmarks: bs,
      scores: ss,
      weights: { a: 60, b: 140 },
    });
    single.forEach((row, i) => {
      expect(row.score).toBeCloseTo(doubled[i].score!, 10);
    });
  });

  it('excludes a zero-weighted board from coverage', () => {
    const out = aggregate({
      models: ms,
      benchmarks: bs,
      scores: ss,
      weights: { a: 100, b: 0 },
    });
    expect(out[0].coverable).toBe(1);
    expect(out[0].covered).toBe(1);
  });

  it('never imputes a missing score', () => {
    // m3 is absent from board b entirely.
    const partial = ss.filter(
      (s) => !(s.modelId === 'm3' && s.benchmarkId === 'b'),
    );
    const out = aggregate({
      models: ms,
      benchmarks: bs,
      scores: partial,
      weights: { a: 50, b: 50 },
    });
    const m3 = out.find((r) => r.model.id === 'm3')!;
    expect(m3.covered).toBe(1);
    expect(m3.coverable).toBe(2);

    // Its score must be its board-a standing alone. Filling the gap with a
    // zero would roughly halve it; averaging in the board mean would pull it
    // toward 50. Neither may happen.
    const onBoardA = m3.perBenchmark.find((s) => s.benchmarkId === 'a')!;
    expect(m3.score).toBeCloseTo(onBoardA.normalized, 10);
  });

  it('returns a null score, not a zero, for a model with nothing to weigh', () => {
    const out = aggregate({
      models: [...ms, model('ghost')],
      benchmarks: bs,
      scores: ss,
      weights: { a: 50, b: 50 },
    });
    const ghost = out.find((r) => r.model.id === 'ghost')!;
    expect(ghost.score).toBeNull();
    expect(ghost.covered).toBe(0);
  });

  it('sorts unscored models last', () => {
    const out = aggregate({
      models: [model('ghost'), ...ms],
      benchmarks: bs,
      scores: ss,
      weights: { a: 50, b: 50 },
    });
    expect(out[out.length - 1].model.id).toBe('ghost');
  });

  it('reports high dispersion when boards disagree about a model', () => {
    const out = aggregate({
      models: ms,
      benchmarks: bs,
      scores: ss,
      weights: { a: 50, b: 50 },
    });
    // m1 is top of a and bottom of b; m2 is average on both.
    const m1 = out.find((r) => r.model.id === 'm1')!;
    const m2 = out.find((r) => r.model.id === 'm2')!;
    expect(m1.dispersion).toBeGreaterThan(m2.dispersion);
  });

  it('down-weights a score whose publisher reports a wide error bar', () => {
    // Board a and board b rank the models in opposite orders, so b is what
    // drags m1 down. Widening only b's error bars must lift m1.
    const onA = [
      score('m1', 'a', 90, 0.1),
      score('m2', 'a', 50, 0.1),
      score('m3', 'a', 10, 0.1),
    ];
    const tightB = [
      score('m1', 'b', 10, 0.1),
      score('m2', 'b', 50, 0.1),
      score('m3', 'b', 90, 0.1),
    ];
    const looseB = [
      score('m1', 'b', 10, 50),
      score('m2', 'b', 50, 50),
      score('m3', 'b', 90, 50),
    ];
    const args = { models: ms, benchmarks: bs, weights: { a: 50, b: 50 } };

    const certain = aggregate({ ...args, scores: [...onA, ...tightB] });
    const bLoose = aggregate({ ...args, scores: [...onA, ...looseB] });

    const m1Of = (rows: ReturnType<typeof aggregate>) =>
      rows.find((r) => r.model.id === 'm1')!.score!;

    expect(m1Of(bLoose)).toBeGreaterThan(m1Of(certain));
  });

  it('ignores error bars when confidence weighting is turned off', () => {
    const args = {
      models: [model('m1'), model('m2')],
      benchmarks: [bench('a')],
      scores: [score('m1', 'a', 90, 0.1), score('m2', 'a', 10, 50)],
      weights: { a: 100 },
    };
    const on = aggregate({ ...args, useConfidence: true });
    const off = aggregate({ ...args, useConfidence: false });
    // With one board, confidence cancels in the weighted mean either way.
    on.forEach((row, i) => expect(row.score).toBeCloseTo(off[i].score!, 10));
  });
});

describe('byDomain', () => {
  it('scores each domain from that domain’s boards alone', () => {
    const bs = [
      { ...bench('a'), domain: 'x' },
      { ...bench('b'), domain: 'y' },
    ];
    const ss = [
      score('m1', 'a', 90),
      score('m2', 'a', 10),
      score('m1', 'b', 10),
      score('m2', 'b', 90),
    ];
    const out = aggregate({
      models: [model('m1'), model('m2')],
      benchmarks: bs,
      scores: ss,
      weights: { a: 50, b: 50 },
    });
    const m1 = out.find((r) => r.model.id === 'm1')!;
    const onA = m1.perBenchmark.find((s) => s.benchmarkId === 'a')!;
    const onB = m1.perBenchmark.find((s) => s.benchmarkId === 'b')!;
    expect(m1.byDomain.x).toBeCloseTo(onA.normalized, 10);
    expect(m1.byDomain.y).toBeCloseTo(onB.normalized, 10);
  });

  it('is null for a domain the model has no scores in', () => {
    const bs = [
      { ...bench('a'), domain: 'x' },
      { ...bench('b'), domain: 'y' },
    ];
    const out = aggregate({
      models: [model('m1'), model('m2')],
      benchmarks: bs,
      scores: [score('m1', 'a', 90), score('m2', 'a', 10)],
      weights: { a: 50, b: 50 },
    });
    expect(out[0].byDomain.y).toBeNull();
  });
});

describe('shrinkage', () => {
  // Board a is worth 80, board b is worth 20. m1 is scored 90 by both;
  // m2 is scored 90 only by the small board; m3 anchors the spread.
  // m4 is a filler so both boards have the same score distribution, which
  // makes m1's normalized value identical on a and b.
  const bs = [bench('a'), bench('b')];
  const ms = [model('m1'), model('m2'), model('m3'), model('m4')];
  const ss = [
    score('m1', 'a', 90),
    score('m3', 'a', 10),
    score('m4', 'a', 90),
    score('m1', 'b', 90),
    score('m2', 'b', 90),
    score('m3', 'b', 10),
  ];
  const run = (priorFraction: number) =>
    aggregate({
      models: ms,
      benchmarks: bs,
      scores: ss,
      weights: { a: 80, b: 20 },
      priorFraction,
      minSources: 2,
    });
  const of = (rows: ReturnType<typeof aggregate>, id: string) =>
    rows.find((r) => r.model.id === id)!;

  it('with no prior, one small board can put a barely-tested model level with a fully tested one', () => {
    const out = run(0);
    expect(of(out, 'm2').score).toBeCloseTo(of(out, 'm1').score!, 6);
  });

  it('with a prior, the fully tested model comes out ahead of the same score on one small board', () => {
    const out = run(0.25);
    expect(of(out, 'm1').score!).toBeGreaterThan(of(out, 'm2').score!);
  });

  it('pulls a thin score toward 50, never past the evidence', () => {
    const out = run(0.25);
    const m2 = of(out, 'm2');
    const onB = m2.perBenchmark.find((s) => s.benchmarkId === 'b')!;
    expect(m2.score!).toBeLessThan(onB.normalized);
    expect(m2.score!).toBeGreaterThan(50);
  });

  it('reports evidence as a fraction of the weight available', () => {
    const out = run(0.25);
    expect(of(out, 'm1').evidence).toBeCloseTo(1, 6);
    expect(of(out, 'm2').evidence).toBeCloseTo(0.2, 6);
  });

  it('lists a model scored by too few boards as provisional and sorts it after the ranked ones', () => {
    const out = run(0.25);
    expect(of(out, 'm2').ranked).toBe(false);
    expect(of(out, 'm1').ranked).toBe(true);
    expect(out.findIndex((r) => r.model.id === 'm2')).toBeGreaterThan(
      out.findIndex((r) => r.model.id === 'm3'),
    );
  });

  it('counts a board with several measures as one source', () => {
    const out = aggregate({
      models: [model('m1'), model('m2')],
      benchmarks: [bench('x-overall', 'x'), bench('x-cat', 'x')],
      scores: [
        score('m1', 'x-overall', 90),
        score('m2', 'x-overall', 10),
        score('m1', 'x-cat', 90),
        score('m2', 'x-cat', 10),
      ],
      weights: { 'x-overall': 25, 'x-cat': 25 },
      overall: new Set(['x-overall']),
      minSources: 2,
    });
    expect(out[0].covered).toBe(1);
    expect(out[0].coverable).toBe(1);
    expect(out[0].ranked).toBe(false);
  });

  it('keeps category figures out of the overall score', () => {
    const out = aggregate({
      models: [model('m1'), model('m2')],
      benchmarks: [bench('x-overall', 'x'), bench('x-cat', 'x')],
      scores: [
        score('m1', 'x-overall', 50),
        score('m2', 'x-overall', 50),
        score('m1', 'x-cat', 90),
        score('m2', 'x-cat', 10),
      ],
      weights: { 'x-overall': 25, 'x-cat': 25 },
      overall: new Set(['x-overall']),
    });
    // Both tie on the overall figure; the category must not break the tie.
    expect(out[0].score).toBeCloseTo(out[1].score!, 6);
    expect(out[0].byDomain.test).not.toBeCloseTo(out[1].byDomain.test!, 6);
  });
});

describe('reports and categories', () => {
  const bs = [
    bench('a', 'a', { category: 'Coding', domain: 'Code generation' }),
    bench('b', 'b', { category: 'Reasoning', domain: 'Math' }),
    bench('r:x', 'r', {
      category: 'Coding',
      domain: 'Tool use',
      kind: 'report',
    }),
  ];
  const ms = [model('m1'), model('m2')];
  const ss = [
    score('m1', 'a', 90),
    score('m2', 'a', 10),
    score('m1', 'b', 10),
    score('m2', 'b', 90),
    score('m1', 'r:x', 90),
    score('m2', 'r:x', 10),
  ];
  const run = () =>
    aggregate({
      models: ms,
      benchmarks: bs,
      scores: ss,
      weights: { a: 50, b: 50, 'r:x': 10 },
      overall: new Set(['a', 'b']),
      minSources: 2,
    });

  it('does not count a report toward coverage, but does count it separately', () => {
    const out = run();
    for (const r of out) {
      expect(r.covered).toBe(2);
      expect(r.coverable).toBe(2);
      expect(r.reports).toBe(1);
    }
  });

  it('keeps a report out of the overall score', () => {
    const out = run();
    // a and b cancel exactly; only the report distinguishes m1 from m2.
    expect(out[0].score).toBeCloseTo(out[1].score!, 6);
  });

  it('lets a report shape its category and domain', () => {
    const out = run();
    const m1 = out.find((r) => r.model.id === 'm1')!;
    const m2 = out.find((r) => r.model.id === 'm2')!;
    expect(m1.byCategory.Coding!).toBeGreaterThan(m2.byCategory.Coding!);
    expect(m1.byDomain['Tool use']!).toBeGreaterThan(m2.byDomain['Tool use']!);
  });

  it('scores a category from every measure filed under it', () => {
    const out = run();
    const m1 = out.find((r) => r.model.id === 'm1')!;
    const a = m1.perBenchmark.find((s) => s.benchmarkId === 'a')!;
    const rx = m1.perBenchmark.find((s) => s.benchmarkId === 'r:x')!;
    // Coding = weighted mean of a (50) and r:x (10), no prior.
    expect(m1.byCategory.Coding).toBeCloseTo(
      (a.normalized * 50 + rx.normalized * 10) / 60,
      6,
    );
  });
});

describe('weighting', () => {
  it('names only shipped benchmarks, and gives every shipped measure a weight', () => {
    const ids = new Set(benchmarks.map((b) => b.id));
    for (const w of WEIGHTING) expect(ids.has(w.benchmarkId)).toBe(true);
    for (const b of benchmarks) expect(weightFor(b)).toBeGreaterThan(0);
  });

  it('discounts a report below any board measure', () => {
    for (const b of benchmarks) {
      if (b.kind === 'report') expect(weightFor(b)).toBe(REPORT_WEIGHT);
      else expect(weightFor(b)).toBeGreaterThan(REPORT_WEIGHT);
    }
  });

  it('keeps every report out of the overall index', () => {
    for (const b of benchmarks) {
      if (b.kind === 'report') expect(OVERALL.has(b.id)).toBe(false);
    }
  });

  it('has overall shares that sum to 100, so they read as percentages', () => {
    expect(WEIGHTING.reduce((s, w) => s + w.weight, 0)).toBe(100);
  });

  it('never lets a board’s category figures into the overall index', () => {
    for (const b of benchmarks) {
      if (b.id.startsWith('livebench-')) expect(OVERALL.has(b.id)).toBe(false);
    }
  });

  it('states a reason for every share', () => {
    for (const w of WEIGHTING) expect(w.rationale.length).toBeGreaterThan(20);
  });
});

describe('shipped data', () => {
  it('references only known models and benchmarks', () => {
    const modelIds = new Set(models.map((m) => m.id));
    const benchIds = new Set(benchmarks.map((b) => b.id));
    for (const s of scores) {
      expect(modelIds.has(s.modelId)).toBe(true);
      expect(benchIds.has(s.benchmarkId)).toBe(true);
    }
  });

  it('records at most one score per model per benchmark', () => {
    const seen = new Set<string>();
    for (const s of scores) {
      const key = `${s.modelId}::${s.benchmarkId}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('carries a source label for every score, for provenance', () => {
    for (const s of scores) expect(s.sourceLabel.length).toBeGreaterThan(0);
  });

  it('cites a URL and a retrieval date for every benchmark', () => {
    for (const b of benchmarks) {
      expect(b.url).toMatch(/^https:\/\//);
      expect(b.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  const shipped = () =>
    aggregate({
      models,
      benchmarks,
      scores,
      weights: weightsFor(benchmarks),
      overall: OVERALL,
      priorFraction: PRIOR_FRACTION,
      minSources: MIN_SOURCES,
    });

  it('produces a full ranking under the published weighting', () => {
    const out = shipped();
    expect(out).toHaveLength(models.length);
    for (const r of out) {
      // Ranked models always have an overall score. A model seen only in a
      // report has none — reports never enter the Overall index — but must
      // still score somewhere, or it should not be in the snapshot.
      if (r.ranked) expect(r.score).not.toBeNull();
      const anywhere =
        r.score !== null || Object.values(r.byDomain).some((v) => v !== null);
      expect(anywhere, r.model.id).toBe(true);
    }
  });

  it('gives a report-only model domain scores but no overall score', () => {
    const out = shipped();
    const reportOnly = out.filter((r) => r.covered === 0 && r.reports > 0);
    expect(reportOnly.length).toBeGreaterThan(0);
    for (const r of reportOnly) {
      expect(r.score).toBeNull();
      expect(r.ranked).toBe(false);
      expect(Object.values(r.byDomain).some((v) => v !== null)).toBe(true);
    }
  });

  it('places ranked models before provisional ones', () => {
    const out = shipped();
    const firstProvisional = out.findIndex((r) => !r.ranked);
    if (firstProvisional === -1) return;
    for (const r of out.slice(firstProvisional)) expect(r.ranked).toBe(false);
    for (const r of out.slice(0, firstProvisional)) expect(r.ranked).toBe(true);
  });

  it('counts coverage in recognised boards, so LiveBench’s seven categories are one source and a report is none', () => {
    const out = shipped();
    for (const r of out) expect(r.covered).toBeLessThanOrEqual(4);
  });

  it('never ranks a model on report evidence alone', () => {
    const out = shipped();
    for (const r of out) {
      if (r.covered < MIN_SOURCES) expect(r.ranked).toBe(false);
    }
  });

  it('does not let one board dictate the winner: domain leaders differ', () => {
    // The point of the index. If every domain agreed on the winner, a single
    // leaderboard would have done.
    const out = shipped().filter((r) => r.ranked);
    const domains = [...new Set(benchmarks.map((b) => b.domain))];
    const leaders = new Set(
      domains.map(
        (d) =>
          [...out].sort(
            (a, b) => (b.byDomain[d] ?? -1) - (a.byDomain[d] ?? -1),
          )[0].model.id,
      ),
    );
    expect(leaders.size).toBeGreaterThan(1);
  });
});
