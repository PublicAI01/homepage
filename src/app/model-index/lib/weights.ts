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
    weight: 25,
    rationale:
      'Largest evidence base of any board — millions of blind votes across hundreds of models — and the widest coverage. Discounted because preference tracks style as well as correctness.',
  },
  {
    benchmarkId: 'artificial-analysis',
    weight: 25,
    rationale:
      'Ten evaluations across agents, coding, reasoning and knowledge, run by one third party under one harness on ~300 models, with a confidence interval under ±1%. Discounted because it is itself a composite whose components overlap other boards here.',
  },
  {
    benchmarkId: 'livebench',
    weight: 20,
    rationale:
      'Broad, refreshed to resist contamination, and covers reasoning, coding, maths and instruction following in one place.',
  },
  {
    benchmarkId: 'terminal-bench',
    weight: 15,
    rationale:
      'Measures completed agentic work, not answers, and publishes error bars. Discounted because the agent scaffold is part of the score and the board is small.',
  },
  {
    benchmarkId: 'arc-agi-2',
    weight: 15,
    rationale:
      'Hard and far from saturated, which keeps it discriminating at the top. Discounted for being one narrow skill and highly sensitive to reasoning-effort tier.',
  },
];

/** Measures that form the Overall index. */
export const OVERALL = new Set(WEIGHTING.map((w) => w.benchmarkId));

/**
 * The image and video tracks: each its own index, with its own Overall.
 *
 * Both are built from arenas run by the same two independent publishers,
 * so both can rank (MIN_SOURCES). Text-to-image and text-to-video get the
 * same share from each crowd, with nothing yet to say one is the better
 * judge. Arena Image Edit is a domain board — a different task, not a
 * second opinion on the same one — and shapes its own column only; image-
 * to-video is in the video Overall at a smaller share, see below.
 */
export const IMAGE_WEIGHTING: Weighting[] = [
  {
    benchmarkId: 'arena-text-to-image',
    weight: 50,
    rationale:
      'The largest blind-vote image arena, millions of votes. Measures what people prefer to look at.',
  },
  {
    benchmarkId: 'aa-text-to-image',
    weight: 50,
    rationale:
      'A second blind-vote arena with its own crowd and prompt set, from an independent publisher.',
  },
];
export const VIDEO_WEIGHTING: Weighting[] = [
  {
    benchmarkId: 'arena-text-to-video',
    weight: 40,
    rationale:
      'The largest blind-vote video arena. Measures what people prefer to watch.',
  },
  {
    benchmarkId: 'aa-text-to-video',
    weight: 40,
    rationale:
      'A second blind-vote arena, without audio, from an independent publisher.',
  },
  {
    // Animating a still is the other half of what a video model is for,
    // and the arenas rank it differently from text-to-video — Seedance 2.0
    // is #2 here and #5 there. Less than the two text-to-video arenas
    // because it is one publisher's one arena, and because most models are
    // asked for text-to-video first (2026-09-15, Steven).
    benchmarkId: 'aa-image-to-video',
    weight: 20,
    rationale:
      'Image-to-video from the same publisher: the other half of the job, one arena’s word on it.',
  },
];
export const overallOf = (weighting: Weighting[]) =>
  new Set(weighting.map((w) => w.benchmarkId));

/** A recognised board's category figure carries its board's share within its domain. */
export const BOARD_MEASURE_WEIGHT = 25;

/**
 * What a one-off publication's figure is worth, by who ran it.
 *
 * These were one number, which priced an independent third-party evaluation
 * exactly like a vendor marking its own homework. They are not the same
 * evidence and should not weigh the same: the first has no stake in the
 * result, the second has every stake, and pretending otherwise both
 * understates the people doing real outside work and flatters the people
 * who do not.
 *
 * Neither enters the Overall index, and both age out — a one-off is evidence
 * about the moment it was written. Both stay below BOARD_MEASURE_WEIGHT: a
 * write-up run once is worth more than a press release and less than a board
 * that re-runs, and that ordering is the whole point of the split.
 */
export const INDEPENDENT_REPORT_WEIGHT = 12;
export const VENDOR_REPORT_WEIGHT = 10;

/** @deprecated The figure a caller means depends on who published it. */
export const REPORT_WEIGHT = VENDOR_REPORT_WEIGHT;

export function weightFor(
  b: Benchmark,
  weighting: Weighting[] = WEIGHTING,
): number {
  const w = weighting.find((x) => x.benchmarkId === b.id)?.weight;
  if (w !== undefined) return w;
  if (b.kind !== 'report') return BOARD_MEASURE_WEIGHT;
  // `independent` is absent from snapshots written before the field existed;
  // reading that as "vendor" keeps an old file weighted the way it was.
  return b.independent ? INDEPENDENT_REPORT_WEIGHT : VENDOR_REPORT_WEIGHT;
}

/** benchmarkId → weight, for every measure in a snapshot. */
export const weightsFor = (
  benchmarks: Benchmark[],
  weighting: Weighting[] = WEIGHTING,
): Record<string, number> =>
  Object.fromEntries(benchmarks.map((b) => [b.id, weightFor(b, weighting)]));

/**
 * How hard thin evidence is pulled toward the middle, as a fraction of the
 * full weight available in scope. At 0.25, a model scored by every board is
 * pulled a fifth of the way toward 50; a model scored only by a 20%-weight
 * board is pulled more than half-way. This is what stops one generous board
 * from putting a barely-tested model at the top.
 */
export const PRIOR_FRACTION = 0.25;

/**
 * Independent publishers whose recognised boards must score a model for it
 * to be ranked Overall rather than listed as provisional. Publishers, not
 * boards: Artificial Analysis runs three boards here, and three of its
 * leaderboards agreeing with each other is still one voice.
 *
 * A category or domain ranks on its own evidence: any model a recognised
 * board has measured in that scope is ranked there, on that measurement.
 */
export const MIN_SOURCES = 2;

/**
 * What it takes for a domain to be offered as a headline ranking.
 *
 * The categories are the divisions a person actually thinks in — coding,
 * agents, reasoning, professional work. The domains beneath them are how the
 * benchmarks happened to slice things, and most are a single board's
 * sub-score wearing a domain's name. Ranking by "Code editing" is ranking by
 * Aider; ranking by "Multimodal understanding" was one model. Neither is a
 * ranking a reader should be handed as a peer of Coding.
 *
 * Two ways in. A domain that several boards measure independently is voted
 * in — the field has agreed it is a thing worth measuring, whatever its size.
 * A domain only one board measures has to be broad enough on its own: at
 * least this many models ranked. Everything else stays in the data and on
 * every model's page; it is just not offered as a headline.
 */
export const MIN_BOARDS_TO_VOTE_IN = 2;
export const MIN_MODELS_FOR_HEADLINE = 20;

/** Display order of the top-level categories. Anything unlisted goes after, alphabetically. */
export const CATEGORY_ORDER = [
  'Human preference',
  'Agents',
  'Professional',
  'Coding',
  'Reasoning',
  'Knowledge',
  'General',
  'Safety',
  // The image and video tracks, each on its own page.
  'Text-to-image',
  'Image editing',
  'Text-to-video',
  'Image-to-video',
];

export const categoryRank = (c: string) => {
  const i = CATEGORY_ORDER.indexOf(c);
  return i === -1 ? CATEGORY_ORDER.length : i;
};

/** Short badge and tone per recognised board, shown beside every model. */
export const SOURCE_BADGE: Record<string, { code: string; tone: string }> = {
  lmarena: { code: 'LM', tone: 'border-p1/40 bg-p1/15 text-p1' },
  'artificial-analysis': {
    code: 'AA',
    tone: 'border-[#F0B4A2]/40 bg-[#F0B4A2]/15 text-[#F0B4A2]',
  },
  'aa-gdpval': {
    code: 'GV',
    tone: 'border-[#F0B4A2]/40 bg-[#F0B4A2]/10 text-[#E7A691]',
  },
  'aa-briefcase': {
    code: 'BC',
    tone: 'border-[#F0B4A2]/40 bg-[#F0B4A2]/10 text-[#E7A691]',
  },
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
  livecodebench: {
    code: 'LC',
    tone: 'border-[#9EE7C8]/40 bg-[#9EE7C8]/15 text-[#9EE7C8]',
  },
  aider: {
    code: 'AD',
    tone: 'border-[#C7D2FE]/40 bg-[#C7D2FE]/15 text-[#C7D2FE]',
  },
  bfcl: {
    code: 'BF',
    tone: 'border-[#F6C177]/40 bg-[#F6C177]/15 text-[#F6C177]',
  },
  osworld: {
    code: 'OS',
    tone: 'border-[#8BD3F7]/40 bg-[#8BD3F7]/15 text-[#8BD3F7]',
  },
  mmmu: {
    code: 'MM',
    tone: 'border-[#F7A8B8]/40 bg-[#F7A8B8]/15 text-[#F7A8B8]',
  },
  kagi: {
    code: 'KG',
    tone: 'border-[#FFD166]/40 bg-[#FFD166]/15 text-[#FFD166]',
  },
  simplebench: {
    code: 'SB',
    tone: 'border-[#B8F2A3]/40 bg-[#B8F2A3]/15 text-[#B8F2A3]',
  },
  vals: {
    code: 'VA',
    tone: 'border-[#D4B5FF]/40 bg-[#D4B5FF]/15 text-[#D4B5FF]',
  },
  // Safety boards.
  'helm-safety': {
    code: 'HS',
    tone: 'border-[#8C1515]/60 bg-[#8C1515]/25 text-[#F2B8B5]',
  },
  enkrypt: {
    code: 'EK',
    tone: 'border-[#FF6B35]/40 bg-[#FF6B35]/15 text-[#FFB08C]',
  },
  vectara: {
    code: 'VC',
    tone: 'border-[#7C3AED]/40 bg-[#7C3AED]/15 text-[#C4B5FD]',
  },
  // Generation arenas: the same two publishers as the text boards.
  'arena-text-to-image': { code: 'AR', tone: 'border-p1/40 bg-p1/15 text-p1' },
  'arena-image-edit': { code: 'AE', tone: 'border-p1/40 bg-p1/15 text-p1' },
  'arena-text-to-video': { code: 'AV', tone: 'border-p1/40 bg-p1/15 text-p1' },
  'aa-text-to-image': {
    code: 'AI',
    tone: 'border-[#F0B4A2]/40 bg-[#F0B4A2]/10 text-[#E7A691]',
  },
  'aa-text-to-video': {
    code: 'AV',
    tone: 'border-[#F0B4A2]/40 bg-[#F0B4A2]/10 text-[#E7A691]',
  },
  'aa-image-to-video': {
    code: 'IV',
    tone: 'border-[#F0B4A2]/40 bg-[#F0B4A2]/10 text-[#E7A691]',
  },
};

/**
 * Each source's own mark, served from this site (public/model-index/logos),
 * never hot-linked. Used to identify the source beside its figures, the
 * way a citation names its publisher; the code badge is the fallback.
 */
export const SOURCE_LOGO: Record<string, string> = {
  lmarena: '/model-index/logos/lmarena.png',
  'artificial-analysis': '/model-index/logos/artificial-analysis.png',
  // Artificial Analysis publishes all three. Three of its marks in a row is
  // the honest reading — one publisher measured the model three ways — and
  // each still names itself on hover.
  'aa-gdpval': '/model-index/logos/artificial-analysis.png',
  'aa-briefcase': '/model-index/logos/artificial-analysis.png',
  livecodebench: '/model-index/logos/livecodebench.svg',
  'terminal-bench': '/model-index/logos/terminal-bench.png',
  'arc-agi-2': '/model-index/logos/arc-agi-2.png',
  livebench: '/model-index/logos/livebench.png',
  'ifm-k2-horizon': '/model-index/logos/ifm-k2-horizon.png',
  'datacamp-astra-vs-fable': '/model-index/logos/datacamp-astra-vs-fable.png',
  'cellcog-k2-horizon': '/model-index/logos/cellcog-k2-horizon.png',
  aider: '/model-index/logos/aider.png',
  bfcl: '/model-index/logos/bfcl.png',
  osworld: '/model-index/logos/osworld.png',
  mmmu: '/model-index/logos/mmmu.png',
  kagi: '/model-index/logos/kagi.png',
  simplebench: '/model-index/logos/simplebench.png',
  vals: '/model-index/logos/vals.png',
  openrouter: '/model-index/logos/openrouter.png',
  huggingface: '/model-index/logos/huggingface.svg',
  'helm-safety': '/model-index/logos/helm-safety.svg',
  enkrypt: '/model-index/logos/enkrypt.png',
  vectara: '/model-index/logos/vectara.png',
  // The generation arenas are the text arenas' publishers, and wear their marks.
  'arena-text-to-image': '/model-index/logos/lmarena.png',
  'arena-image-edit': '/model-index/logos/lmarena.png',
  'arena-text-to-video': '/model-index/logos/lmarena.png',
  'aa-text-to-image': '/model-index/logos/artificial-analysis.png',
  'aa-text-to-video': '/model-index/logos/artificial-analysis.png',
  'aa-image-to-video': '/model-index/logos/artificial-analysis.png',
};

/**
 * A board with no mark of its own gets its initials, never a "?": three
 * safety boards shipped with question marks in every row's source strip
 * (2026-09-16). "HELM Safety" → HS, "Vectara" → VE.
 */
export const fallbackBadge = (name: string) => {
  const words = name.split(/[\s·—-]+/).filter((w) => /^[A-Za-z0-9]/.test(w));
  const code =
    words.length >= 2
      ? words[0][0] + words[1][0]
      : (words[0] ?? '??').slice(0, 2);
  return {
    code: code.toUpperCase(),
    tone: 'border-white/20 bg-white/10 text-[#D9D7E0]',
  };
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
