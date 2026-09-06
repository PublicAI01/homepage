/**
 * The PublicAI Index weighting.
 *
 * Fixed and published, not user-adjustable. A reader cannot be expected to
 * know what share a given leaderboard deserves; that is an editorial call,
 * and the only honest way to make one is to state it, with the reason, where
 * the number is shown. Change a weight here and the rationale beside it.
 *
 * Weights sum to 100. They apply on top of confidence weighting from each
 * publisher's own error bars (see aggregate.ts).
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

export const WEIGHTS: Record<string, number> = Object.fromEntries(
  WEIGHTING.map((w) => [w.benchmarkId, w.weight]),
);

/** Short badge and tone for each source, shown beside every model. */
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
  'Agentic terminal use': 'Agentic',
  'Abstract reasoning': 'Reasoning',
  'Contamination-resistant general': 'General',
};

export const domainLabel = (domain: string) => DOMAIN_LABELS[domain] ?? domain;
