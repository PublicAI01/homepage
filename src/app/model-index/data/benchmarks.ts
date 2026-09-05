/**
 * Source data for the PublicAI Index.
 *
 * Every figure below was read off the publisher's own leaderboard on the date
 * recorded in `retrievedAt`. Nothing here is estimated, interpolated, or
 * carried over from a secondary aggregator: second-hand trackers disagreed with
 * each other on the same benchmark, so only first-party pages are used.
 *
 * Scores belong to their publishers. PublicAI normalizes and weights them; it
 * does not run these benchmarks.
 *
 * To refresh: re-read each `url`, update `raw`/`stderr`/`retrievedAt`, and add
 * an alias for any model whose name differs from the one already recorded.
 */

/** How a leaderboard reports its numbers. Drives normalization, not display. */
export type Metric = 'elo' | 'percent' | 'index';

export interface Benchmark {
  id: string;
  name: string;
  publisher: string;
  /** The exact page the numbers were read from. Rendered as the citation. */
  url: string;
  /** ISO date the figures were read. */
  retrievedAt: string;
  /** The leaderboard's own snapshot label, where it publishes one. */
  snapshot?: string;
  metric: Metric;
  /** What capability this leaderboard actually measures. */
  domain: string;
  /** Known limitation a buyer should weigh before trusting the column. */
  caveat?: string;
}

export interface Score {
  modelId: string;
  benchmarkId: string;
  raw: number;
  /** Published uncertainty, where the leaderboard reports one. Drives confidence weighting. */
  stderr?: number;
  /** The model string exactly as that leaderboard prints it. Shown in provenance. */
  sourceLabel: string;
  /** Agent framework the score was produced with, where the benchmark scores a scaffold rather than a bare model. */
  scaffold?: string;
}

export interface Model {
  id: string;
  name: string;
  org: string;
}

export const benchmarks: Benchmark[] = [
  {
    id: 'lmarena',
    name: 'LMArena Text',
    publisher: 'LMArena',
    url: 'https://arena.ai/leaderboard/text',
    retrievedAt: '2026-09-05',
    snapshot: 'Sep 2, 2026 — 7,999,020 votes across 400 models',
    metric: 'elo',
    domain: 'Human preference',
    caveat:
      'Blind head-to-head votes. Measures what people prefer reading, which tracks style as well as correctness.',
  },
  {
    id: 'terminal-bench',
    name: 'Terminal-Bench',
    publisher: 'Terminal-Bench',
    url: 'https://www.tbench.ai/leaderboard',
    retrievedAt: '2026-09-05',
    snapshot: 'Top entry dated Sep 3, 2026',
    metric: 'percent',
    domain: 'Agentic terminal use',
    caveat:
      'Scores a model plus its agent scaffold (Codex, Claude Code, Grok Build). The scaffold is part of the result, not a constant.',
  },
  {
    id: 'arc-agi-2',
    name: 'ARC-AGI-2',
    publisher: 'ARC Prize',
    url: 'https://arcprize.org/leaderboard',
    retrievedAt: '2026-09-05',
    metric: 'percent',
    domain: 'Abstract reasoning',
    caveat:
      'Reported per reasoning-effort tier. The same model spans a wide range across tiers, so the tier is recorded alongside each score.',
  },
  {
    id: 'livebench',
    name: 'LiveBench',
    publisher: 'LiveBench',
    url: 'https://livebench.ai/',
    retrievedAt: '2026-09-05',
    metric: 'index',
    domain: 'Contamination-resistant general',
    caveat:
      'Overall figure aggregates the publisher’s own sub-categories (reasoning, coding, agentic coding, mathematics, data analysis, language, instruction following).',
  },
];

export const models: Model[] = [
  { id: 'claude-fable-5-1', name: 'Claude Fable 5.1', org: 'Anthropic' },
  { id: 'gpt-6-astra', name: 'GPT-6 Astra', org: 'OpenAI' },
  { id: 'claude-fable-5', name: 'Claude Fable 5', org: 'Anthropic' },
  { id: 'claude-opus-5', name: 'Claude Opus 5', org: 'Anthropic' },
  { id: 'gpt-5-6-sol', name: 'GPT-5.6 Sol', org: 'OpenAI' },
  { id: 'gemini-3-8-flash', name: 'Gemini 3.8 Flash', org: 'Google' },
  { id: 'grok-4-6', name: 'Grok 4.6', org: 'xAI' },
];

export const scores: Score[] = [
  // --- Claude Fable 5.1 — present on all four boards ---
  {
    modelId: 'claude-fable-5-1',
    benchmarkId: 'lmarena',
    raw: 1504,
    stderr: 11,
    sourceLabel: 'claude-fable-5.1-max',
  },
  {
    modelId: 'claude-fable-5-1',
    benchmarkId: 'terminal-bench',
    raw: 57.9,
    stderr: 3.8,
    sourceLabel: 'Fable 5.1(max)',
    scaffold: 'Claude Code',
  },
  {
    modelId: 'claude-fable-5-1',
    benchmarkId: 'arc-agi-2',
    raw: 90.0,
    sourceLabel: 'Claude Fable 5.1 (Max)',
  },
  {
    modelId: 'claude-fable-5-1',
    benchmarkId: 'livebench',
    raw: 83.4,
    sourceLabel: 'Claude Fable 5.1 Max Effort',
  },

  // --- GPT-6 Astra — absent from LMArena at the time of reading ---
  {
    modelId: 'gpt-6-astra',
    benchmarkId: 'terminal-bench',
    raw: 58.2,
    stderr: 2.8,
    sourceLabel: 'GPT-6 Astra(max)',
    scaffold: 'Codex',
  },
  {
    modelId: 'gpt-6-astra',
    benchmarkId: 'arc-agi-2',
    raw: 95.0,
    sourceLabel: 'GPT-6 Astra (Max)',
  },
  {
    modelId: 'gpt-6-astra',
    benchmarkId: 'livebench',
    raw: 82.2,
    sourceLabel: 'GPT-6 Astra Max Effort',
  },

  // --- Claude Fable 5 — tops LMArena, mid-pack on agentic work ---
  {
    modelId: 'claude-fable-5',
    benchmarkId: 'lmarena',
    raw: 1507,
    stderr: 5,
    sourceLabel: 'claude-fable-5',
  },
  {
    modelId: 'claude-fable-5',
    benchmarkId: 'terminal-bench',
    raw: 44.5,
    stderr: 3.8,
    sourceLabel: 'Fable 5(max)',
    scaffold: 'Claude Code',
  },
  {
    modelId: 'claude-fable-5',
    benchmarkId: 'livebench',
    raw: 83.0,
    sourceLabel: 'Claude Fable 5 Max Effort',
  },

  // --- Claude Opus 5 — effort tiers differ across boards, noted in provenance ---
  {
    modelId: 'claude-opus-5',
    benchmarkId: 'lmarena',
    raw: 1493,
    stderr: 5,
    sourceLabel: 'claude-opus-5-high',
  },
  {
    modelId: 'claude-opus-5',
    benchmarkId: 'terminal-bench',
    raw: 51.8,
    stderr: 3.4,
    sourceLabel: 'Opus 5(max)',
    scaffold: 'Claude Code',
  },
  {
    modelId: 'claude-opus-5',
    benchmarkId: 'livebench',
    raw: 80.1,
    sourceLabel: 'Claude 5 Opus Thinking Max Effort',
  },

  // --- GPT-5.6 Sol ---
  {
    modelId: 'gpt-5-6-sol',
    benchmarkId: 'terminal-bench',
    raw: 37.3,
    stderr: 3.8,
    sourceLabel: 'GPT-5.6 Sol(max)',
    scaffold: 'Codex',
  },
  {
    modelId: 'gpt-5-6-sol',
    benchmarkId: 'livebench',
    raw: 81.0,
    sourceLabel: 'GPT-5.6 Sol Max Effort',
  },

  // --- Gemini 3.8 Flash — strong on preference, weak on terminal agency ---
  {
    modelId: 'gemini-3-8-flash',
    benchmarkId: 'lmarena',
    raw: 1494,
    stderr: 9,
    sourceLabel: 'gemini-3.8-flash-high',
  },
  {
    modelId: 'gemini-3-8-flash',
    benchmarkId: 'terminal-bench',
    raw: 19.1,
    stderr: 3.4,
    sourceLabel: 'Gemini 3.8 Flash(high)',
    scaffold: 'mini-SWE-agent',
  },

  // --- Grok 4.6 ---
  {
    modelId: 'grok-4-6',
    benchmarkId: 'terminal-bench',
    raw: 20.3,
    stderr: 3.1,
    sourceLabel: 'Grok 4.6(high)',
    scaffold: 'Grok Build',
  },
  {
    modelId: 'grok-4-6',
    benchmarkId: 'livebench',
    raw: 78.0,
    sourceLabel: 'Grok 4.6',
  },
];

/**
 * A well-known board deliberately left out of the index, and why. Shown on the
 * page: which leaderboards are excluded is part of the methodology.
 */
export const excluded = [
  {
    name: 'SWE-bench Verified',
    url: 'https://www.swebench.com/',
    reason:
      'Read on 2026-09-05: the newest of its 181 entries is dated 2026-02-17. None of the models above appear on it. Including a stale board would add a column of blanks, not a signal.',
  },
];
