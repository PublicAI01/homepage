/**
 * The PublicAI Index weighting.
 *
 * Fixed and published, not user-adjustable. A reader cannot be expected to
 * know what share a given leaderboard deserves; that is an editorial call,
 * and the only honest way to make one is to state it, with the reason, where
 * the number is shown. Change a weight here and the rationale beside it.
 *
 * Two kinds of entry:
 *
 * - `overall: true` — a board's headline figure. These sum to 100 and form
 *   the Overall index.
 * - `overall: false` — a category figure a board publishes alongside its
 *   headline (LiveBench's seven). They never enter the Overall index, which
 *   would double-count the board, but they are what makes a domain column
 *   possible: a reader who only cares about mathematics gets a ranking backed
 *   by a number the publisher actually reports.
 *
 * Within a domain only the ratio between weights matters.
 */

export interface Weighting {
  benchmarkId: string;
  weight: number;
  /** One sentence a reader can disagree with. */
  rationale: string;
  overall: boolean;
}

export const WEIGHTING: Weighting[] = [
  {
    benchmarkId: 'lmarena',
    weight: 30,
    overall: true,
    rationale:
      'Largest evidence base of any board — millions of blind votes across hundreds of models — and the widest coverage. Discounted because preference tracks style as well as correctness.',
  },
  {
    benchmarkId: 'livebench',
    weight: 25,
    overall: true,
    rationale:
      'Broad, refreshed to resist contamination, and covers reasoning, coding, maths and instruction following in one place.',
  },
  {
    benchmarkId: 'terminal-bench',
    weight: 25,
    overall: true,
    rationale:
      'Measures completed agentic work, not answers, and publishes error bars. Discounted because the agent scaffold is part of the score.',
  },
  {
    benchmarkId: 'arc-agi-2',
    weight: 20,
    overall: true,
    rationale:
      'Hard and far from saturated, which keeps it discriminating at the top. Discounted for being one narrow skill and highly sensitive to reasoning-effort tier.',
  },

  // LiveBench category figures. Same share as the board they belong to; they
  // shape domain columns only.
  ...[
    'reasoning',
    'coding',
    'agentic-coding',
    'mathematics',
    'data-analysis',
    'language',
    'instruction-following',
  ].map((c) => ({
    benchmarkId: `livebench-${c}`,
    weight: 25,
    overall: false,
    rationale: 'LiveBench’s own category figure, indexed for its domain only.',
  })),
];

export const WEIGHTS: Record<string, number> = Object.fromEntries(
  WEIGHTING.map((w) => [w.benchmarkId, w.weight]),
);

export const OVERALL = new Set(
  WEIGHTING.filter((w) => w.overall).map((w) => w.benchmarkId),
);

/**
 * How hard thin evidence is pulled toward the middle, as a fraction of the
 * full weight available in scope. At 0.25, a model scored by every board is
 * pulled a fifth of the way toward 50; a model scored only by a 20%-weight
 * board is pulled more than half-way. This is what stops one generous board
 * from putting a barely-tested model at the top.
 */
export const PRIOR_FRACTION = 0.25;

/** Boards a model must be scored by to be ranked rather than listed as provisional. */
export const MIN_SOURCES = 2;

/** Short badge and tone per board (not per measure), shown beside every model. */
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

/** Column headings for the domain sub-indices; falls back to the raw domain. */
const DOMAIN_LABELS: Record<string, string> = {
  'Human preference': 'Preference',
};

export const domainLabel = (domain: string) => DOMAIN_LABELS[domain] ?? domain;
