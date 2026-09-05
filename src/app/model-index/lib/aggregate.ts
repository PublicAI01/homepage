import type { Benchmark, Model, Score } from '../data/benchmarks';

/**
 * Turning four leaderboards into one number, without pretending the number is
 * more solid than its inputs.
 *
 * Three problems have to be solved in order:
 *
 * 1. Scales do not compare. An Elo of 1504 and a resolution rate of 57.9% are
 *    not on the same axis, and neither are two percentages whose spreads
 *    differ — a point of LiveBench (range ~78-84) buys far more than a point of
 *    Terminal-Bench (range ~19-58). Raw averaging would silently hand the
 *    widest-spread board the loudest vote. Z-scoring each board first puts
 *    every column in units of its own spread.
 *
 * 2. Not every score is equally certain. LMArena and Terminal-Bench publish
 *    error bars; a 57.9% ± 3.8 is a weaker claim than 58.2% ± 2.8. Scores are
 *    weighted down in proportion to their published uncertainty.
 *
 * 3. Coverage is uneven. No model appears on all four boards by default, and a
 *    model rated on two boards has not earned the same confidence as one rated
 *    on four. Missing scores are never imputed — they are excluded from the
 *    weighted mean, and coverage is reported alongside every result so a thin
 *    row is visibly thin.
 */

/** Mean of the board, in standard-deviation units, rescaled so 50 is average. */
const T_SCORE_MEAN = 50;
const T_SCORE_SD = 15;

export interface NormalizedScore {
  benchmarkId: string;
  /** 0-100 standardized score. 50 means average for that board. */
  normalized: number;
  raw: number;
  stderr?: number;
  /** 0-1. Lower when the publisher's error bar is wide relative to the board's spread. */
  confidence: number;
  sourceLabel: string;
  scaffold?: string;
}

export interface AggregateRow {
  model: Model;
  /** Final 0-100 index score, or null when the model has no usable scores. */
  score: number | null;
  perBenchmark: NormalizedScore[];
  /** How many of the weighted benchmarks this model actually appears on. */
  covered: number;
  /** How many benchmarks carry non-zero weight. */
  coverable: number;
  /** Spread of the model's normalized scores. High means the boards disagree. */
  dispersion: number;
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

const stdDev = (xs: number[]) => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
};

const clamp = (x: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, x));

/**
 * Standardize one board's raw scores to a 0-100 scale centred on 50.
 *
 * A board where every model scores nearly the same (sd ~ 0) carries no
 * information to spread out, so every model lands at the mean rather than
 * having noise amplified into a ranking.
 */
export function normalizeBoard(raws: number[]): number[] {
  const m = mean(raws);
  const sd = stdDev(raws);
  if (sd === 0) return raws.map(() => T_SCORE_MEAN);
  return raws.map((r) =>
    clamp(T_SCORE_MEAN + T_SCORE_SD * ((r - m) / sd), 0, 100),
  );
}

/**
 * Confidence in a single score, from the publisher's own error bar measured
 * against how far apart that board spreads its models.
 *
 * An error bar of ±3.8 is tight on a board spanning 40 points and useless on
 * one spanning 4. Scores with no published uncertainty are taken at face value
 * (1) rather than penalized — absence of an error bar is not evidence of a
 * wide one, and guessing would invent information.
 */
export function confidenceOf(stderr: number | undefined, spread: number) {
  if (stderr === undefined || spread <= 0) return 1;
  const relative = stderr / spread;
  return clamp(1 / (1 + relative * relative * 16), 0.15, 1);
}

export interface AggregateInput {
  models: Model[];
  benchmarks: Benchmark[];
  scores: Score[];
  /** benchmarkId -> 0-100 user weight. */
  weights: Record<string, number>;
  /** When false, published error bars are ignored and every score counts equally. */
  useConfidence?: boolean;
}

export function aggregate({
  models,
  benchmarks,
  scores,
  weights,
  useConfidence = true,
}: AggregateInput): AggregateRow[] {
  const active = benchmarks.filter((b) => (weights[b.id] ?? 0) > 0);

  // Normalize within each board, over the models actually present on it.
  const normalizedBy = new Map<string, Map<string, NormalizedScore>>();

  for (const bench of benchmarks) {
    const rows = scores.filter((s) => s.benchmarkId === bench.id);
    if (rows.length === 0) continue;

    const raws = rows.map((r) => r.raw);
    const normalized = normalizeBoard(raws);
    const spread = Math.max(...raws) - Math.min(...raws);

    const byModel = new Map<string, NormalizedScore>();
    rows.forEach((row, i) => {
      byModel.set(row.modelId, {
        benchmarkId: bench.id,
        normalized: normalized[i],
        raw: row.raw,
        stderr: row.stderr,
        confidence: useConfidence ? confidenceOf(row.stderr, spread) : 1,
        sourceLabel: row.sourceLabel,
        scaffold: row.scaffold,
      });
    });
    normalizedBy.set(bench.id, byModel);
  }

  const rows = models.map((model): AggregateRow => {
    const perBenchmark = benchmarks
      .map((b) => normalizedBy.get(b.id)?.get(model.id))
      .filter((s): s is NormalizedScore => s !== undefined);

    // Only boards the user actually weighted contribute to the score.
    const contributing = perBenchmark.filter(
      (s) => (weights[s.benchmarkId] ?? 0) > 0,
    );

    const totalWeight = contributing.reduce(
      (sum, s) => sum + weights[s.benchmarkId] * s.confidence,
      0,
    );

    const score =
      totalWeight > 0
        ? contributing.reduce(
            (sum, s) =>
              sum + s.normalized * weights[s.benchmarkId] * s.confidence,
            0,
          ) / totalWeight
        : null;

    return {
      model,
      score,
      perBenchmark,
      covered: contributing.length,
      coverable: active.length,
      dispersion: stdDev(contributing.map((s) => s.normalized)),
    };
  });

  return rows.sort((a, b) => {
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return b.score - a.score;
  });
}

export interface Preset {
  id: string;
  name: string;
  blurb: string;
  weights: Record<string, number>;
}

export const presets: Preset[] = [
  {
    id: 'general',
    name: 'General',
    blurb: 'Every board counts the same. The default index.',
    weights: {
      lmarena: 25,
      'terminal-bench': 25,
      'arc-agi-2': 25,
      livebench: 25,
    },
  },
  {
    id: 'agent',
    name: 'Agent / Coding',
    blurb: 'Weighted to models that finish real terminal and coding work.',
    weights: {
      lmarena: 5,
      'terminal-bench': 50,
      'arc-agi-2': 15,
      livebench: 30,
    },
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    blurb: 'Weighted to abstract problem solving over conversational polish.',
    weights: {
      lmarena: 10,
      'terminal-bench': 15,
      'arc-agi-2': 50,
      livebench: 25,
    },
  },
  {
    id: 'product',
    name: 'Chat product',
    blurb: 'Weighted to what end users prefer in an assistant.',
    weights: {
      lmarena: 55,
      'terminal-bench': 5,
      'arc-agi-2': 10,
      livebench: 30,
    },
  },
];
