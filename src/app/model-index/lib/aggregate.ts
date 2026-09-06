import type { Benchmark, Model, Score } from '../data/types';

/**
 * Turning several leaderboards into one number, without pretending the number
 * is more solid than its inputs.
 *
 * Four problems have to be solved in order:
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
 * 3. Coverage is uneven, and a plain weighted mean over whatever is present
 *    lets one generous board put a barely-tested model at the top: scored 80
 *    by a single 20%-weight board, it would tie a model scored 80 by every
 *    board. So thin evidence is shrunk toward the middle in proportion to how
 *    thin it is (`prior`), and a model scored by too few boards is listed but
 *    not ranked (`minSources`). Missing scores are still never imputed.
 *
 * 4. A board can publish several figures. Its headline figure carries the
 *    board's share in the Overall index; its category figures shape only the
 *    domain they measure, so a board is never counted twice.
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
  /** The same computation, restricted to the measures in each domain. */
  byDomain: Record<string, number | null>;
  perBenchmark: NormalizedScore[];
  /** How many boards (not measures) scored this model, among the weighted ones. */
  covered: number;
  /** How many boards carry weight. */
  coverable: number;
  /** Weight-times-confidence behind the overall score, out of the total available. */
  evidence: number;
  /** Scored by enough boards to be placed in the ranking. */
  ranked: boolean;
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

/**
 * Weighted mean of normalized scores, pulled toward 50 by a prior whose
 * weight is `priorFraction` of the total weight available in scope. With
 * full evidence the pull is mild; with one small board it dominates.
 */
function shrunkMean(
  scores: NormalizedScore[],
  weights: Record<string, number>,
  scopeWeight: number,
  priorFraction: number,
): { score: number | null; evidence: number } {
  const evidence = scores.reduce(
    (sum, s) => sum + weights[s.benchmarkId] * s.confidence,
    0,
  );
  if (evidence <= 0) return { score: null, evidence: 0 };
  const sum = scores.reduce(
    (acc, s) => acc + s.normalized * weights[s.benchmarkId] * s.confidence,
    0,
  );
  const prior = priorFraction * scopeWeight;
  return {
    score: (sum + prior * T_SCORE_MEAN) / (evidence + prior),
    evidence,
  };
}

export interface AggregateInput {
  models: Model[];
  benchmarks: Benchmark[];
  scores: Score[];
  /** benchmarkId -> weight, for every measure that may shape a domain. */
  weights: Record<string, number>;
  /** Measures that form the Overall index. Default: every weighted measure. */
  overall?: Set<string>;
  /** Prior weight as a fraction of the weight in scope. 0 = plain weighted mean. */
  priorFraction?: number;
  /** Boards a model must be scored by to be ranked. */
  minSources?: number;
  /** When false, published error bars are ignored and every score counts equally. */
  useConfidence?: boolean;
}

export function aggregate({
  models,
  benchmarks,
  scores,
  weights,
  overall,
  priorFraction = 0,
  minSources = 1,
  useConfidence = true,
}: AggregateInput): AggregateRow[] {
  const weighted = benchmarks.filter((b) => (weights[b.id] ?? 0) > 0);
  const overallIds = overall ?? new Set(weighted.map((b) => b.id));
  const boardOf = new Map(benchmarks.map((b) => [b.id, b.group ?? b.id]));
  const domainOf = new Map(benchmarks.map((b) => [b.id, b.domain]));

  const domains = [...new Set(weighted.map((b) => b.domain))];
  const coverable = new Set(weighted.map((b) => boardOf.get(b.id))).size;

  const sumWeight = (ids: Iterable<string>) => {
    let t = 0;
    for (const id of ids) t += weights[id] ?? 0;
    return t;
  };
  const overallWeight = sumWeight(
    weighted.filter((b) => overallIds.has(b.id)).map((b) => b.id),
  );
  const domainWeight = new Map(
    domains.map((d) => [
      d,
      sumWeight(weighted.filter((b) => b.domain === d).map((b) => b.id)),
    ]),
  );

  // Normalize within each measure, over the models actually present on it.
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

    const contributing = perBenchmark.filter(
      (s) => (weights[s.benchmarkId] ?? 0) > 0,
    );
    const inOverall = contributing.filter((s) => overallIds.has(s.benchmarkId));

    const { score, evidence } = shrunkMean(
      inOverall,
      weights,
      overallWeight,
      priorFraction,
    );

    const byDomain: Record<string, number | null> = {};
    for (const d of domains) {
      byDomain[d] = shrunkMean(
        contributing.filter((s) => domainOf.get(s.benchmarkId) === d),
        weights,
        domainWeight.get(d) ?? 0,
        priorFraction,
      ).score;
    }

    const covered = new Set(contributing.map((s) => boardOf.get(s.benchmarkId)))
      .size;

    return {
      model,
      score,
      byDomain,
      perBenchmark,
      covered,
      coverable,
      evidence: overallWeight > 0 ? evidence / overallWeight : 0,
      ranked: covered >= minSources,
      dispersion: stdDev(inOverall.map((s) => s.normalized)),
    };
  });

  const byScore = compareScores<AggregateRow>((r) => r.score);
  return rows.sort(
    (a, b) => Number(b.ranked) - Number(a.ranked) || byScore(a, b),
  );
}

/** Sort highest first; models without a score go last. */
export function compareScores<T>(key: (row: T) => number | null) {
  return (a: T, b: T) => {
    const x = key(a);
    const y = key(b);
    if (x === null && y === null) return 0;
    if (x === null) return 1;
    if (y === null) return -1;
    return y - x;
  };
}
