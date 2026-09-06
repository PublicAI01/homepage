import type { Benchmark } from '../data/types';

/**
 * The PublicAI Index weighting.
 *
 * Fixed and published, not user-adjustable. A reader cannot be expected to
 * know what share a given leaderboard deserves; that is an editorial call,
 * and the only honest way to make one is to state it, with the reason, where
 * the number is shown. Change a weight here and the rationale beside it.
 *
 * Three tiers of measure:
 *
 * - A recognised board's headline figure. Listed below with a share; these
 *   sum to 100 and form the Overall index.
 * - A recognised board's category figure (LiveBench's seven). Same share as
 *   its board, but it shapes only its own domain and category columns —
 *   never the Overall index, which would count the board twice.
 * - A figure from a report ✱ — a launch post or a blog. Discounted, never in
 *   the Overall index, never counted toward ranking eligibility. It widens
 *   the domain columns, marked as what it is.
 *
 * Within a domain only the ratio between weights matters.
 */

export interface Weighting {
  benchmarkId: string;
  weight: number;
  /** One sentence a reader can disagree with. */
  rationale: string;
}

export const WEIGHTING: Weighting[] = [
  {
    benchmarkId: 'lmarena',
    weight: 30,
    rationale:
      'Largest evidence base of any board — millions of blind votes across hundreds of models — and the widest coverage. Discounted because preference tracks style as well as correctness.',
  },
  {
    benchmarkId: 'livebench',
    weight: 25,
    rationale:
      'Broad, refreshed to resist contamination, and covers reasoning, coding, maths and instruction following in one place.',
  },
  {
    benchmarkId: 'terminal-bench',
    weight: 25,
    rationale:
      'Measures completed agentic work, not answers, and publishes error bars. Discounted because the agent scaffold is part of the score.',
  },
  {
    benchmarkId: 'arc-agi-2',
    weight: 20,
    rationale:
      'Hard and far from saturated, which keeps it discriminating at the top. Discounted for being one narrow skill and highly sensitive to reasoning-effort tier.',
  },
];

/** Measures that form the Overall index. */
export const OVERALL = new Set(WEIGHTING.map((w) => w.benchmarkId));

/** A recognised board's category figure carries its board's share within its domain. */
export const BOARD_MEASURE_WEIGHT = 25;

/** A report figure carries less than half a board's share within its domain. */
export const REPORT_WEIGHT = 10;

const explicit = new Map(WEIGHTING.map((w) => [w.benchmarkId, w.weight]));

export function weightFor(b: Benchmark): number {
  const w = explicit.get(b.id);
  if (w !== undefined) return w;
  return b.kind === 'report' ? REPORT_WEIGHT : BOARD_MEASURE_WEIGHT;
}

/** benchmarkId → weight, for every measure in a snapshot. */
export const weightsFor = (benchmarks: Benchmark[]): Record<string, number> =>
  Object.fromEntries(benchmarks.map((b) => [b.id, weightFor(b)]));

/**
 * How hard thin evidence is pulled toward the middle, as a fraction of the
 * full weight available in scope. At 0.25, a model scored by every board is
 * pulled a fifth of the way toward 50; a model scored only by a 20%-weight
 * board is pulled more than half-way. This is what stops one generous board
 * from putting a barely-tested model at the top.
 */
export const PRIOR_FRACTION = 0.25;

/** Recognised boards a model must be scored by to be ranked rather than listed as provisional. */
export const MIN_SOURCES = 2;

/** Display order of the top-level categories. Anything unlisted goes after, alphabetically. */
export const CATEGORY_ORDER = [
  'Human preference',
  'Agents',
  'Coding',
  'Reasoning',
  'Knowledge',
  'General',
];

export const categoryRank = (c: string) => {
  const i = CATEGORY_ORDER.indexOf(c);
  return i === -1 ? CATEGORY_ORDER.length : i;
};

/** Short badge and tone per recognised board, shown beside every model. */
export const SOURCE_BADGE: Record<string, { code: string; tone: string }> = {
  lmarena: { code: 'LM', tone: 'border-p1/40 bg-p1/15 text-p1' },
  'terminal-bench': {
    code: 'TB',
    tone: 'border-[#6EE7A0]/40 bg-[#6EE7A0]/15 text-[#6EE7A0]',
  },
  'arc-agi-2': {
    code: 'ARC',
    tone: 'border-[#F5C86B]/40 bg-[#F5C86B]/15 text-[#F5C86B]',
  },
  livebench: {
    code: 'LB',
    tone: 'border-[#7CB8FF]/40 bg-[#7CB8FF]/15 text-[#7CB8FF]',
  },
};

export const FALLBACK_BADGE = {
  code: '?',
  tone: 'border-white/20 bg-white/10 text-[#D9D7E0]',
};

/** Every report shares one mark. The name and date are on hover and in the expanded row. */
export const REPORT_BADGE = {
  code: '✱',
  tone: 'border-[#E8A9F0]/40 bg-[#E8A9F0]/12 text-[#E8A9F0]',
};

/** Column headings for the sub-indices; falls back to the raw label. */
const LABELS: Record<string, string> = {
  'Human preference': 'Preference',
};

export const domainLabel = (domain: string) => LABELS[domain] ?? domain;
