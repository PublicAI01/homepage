import { describe, expect, it } from 'vitest';

import type { Benchmark, Model, Score } from '../data/benchmarks';
import { benchmarks, models, scores } from '../data/benchmarks';
import { aggregate, confidenceOf, normalizeBoard, presets } from './aggregate';

const bench = (id: string): Benchmark => ({
  id,
  name: id,
  publisher: 'test',
  url: 'https://example.com',
  retrievedAt: '2026-09-05',
  metric: 'percent',
  domain: 'test',
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

  it('gives every preset a weight for every benchmark', () => {
    for (const p of presets) {
      for (const b of benchmarks) {
        expect(typeof p.weights[b.id]).toBe('number');
      }
    }
  });

  it('produces a ranking over the real data under every preset', () => {
    for (const p of presets) {
      const out = aggregate({
        models,
        benchmarks,
        scores,
        weights: p.weights,
      });
      expect(out).toHaveLength(models.length);
      expect(out[0].score).not.toBeNull();
    }
  });

  it('changes the leader between the preference and agent presets', () => {
    // The point of the index: LMArena's top model is not the best agent.
    const chat = aggregate({
      models,
      benchmarks,
      scores,
      weights: presets.find((p) => p.id === 'product')!.weights,
    });
    const agent = aggregate({
      models,
      benchmarks,
      scores,
      weights: presets.find((p) => p.id === 'agent')!.weights,
    });
    expect(chat[0].model.id).not.toBe(agent[0].model.id);
  });
});
