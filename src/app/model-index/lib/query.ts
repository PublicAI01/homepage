import {
  benchmarks,
  catalogs,
  excluded,
  generatedAt,
  models,
  scores,
} from '../data';
import type { Benchmark } from '../data/types';
import { recommend, type Recommendation } from './access';
import { aggregate, type AggregateRow, compareScores } from './aggregate';
import { groupBoards } from './boards';
import { familyOf } from './family';
import { sizeLabel, type SizeTier, tierOf } from './size';
import {
  BOARD_MEASURE_WEIGHT,
  categoryRank,
  INDEPENDENT_REPORT_WEIGHT,
  MIN_SOURCES,
  OVERALL,
  PRIOR_FRACTION,
  VENDOR_REPORT_WEIGHT,
  WEIGHTING,
  weightsFor,
} from './weights';

/**
 * One read model for everything that answers questions about the index: the
 * page, the MCP server and the JSON API. The snapshot is static, so the
 * aggregate is computed once per process.
 */
export const INDEX_URL = 'https://publicai.io/model-index';
export const MCP_URL = `${INDEX_URL}/mcp`;
export const API_URL = `${INDEX_URL}/api`;

/**
 * Two aggregates, computed once: with reports ✱ (launch posts, blogs) and
 * without. Turning them off drops their figures from every score and hides
 * models nothing else has measured; it never changes the Overall rank,
 * which reports do not enter.
 */
function build(includeReports: boolean) {
  const weights = weightsFor(benchmarks);
  if (!includeReports)
    for (const b of benchmarks) if (b.kind === 'report') weights[b.id] = 0;
  const rows: AggregateRow[] = aggregate({
    models,
    benchmarks,
    scores,
    weights,
    overall: OVERALL,
    priorFraction: PRIOR_FRACTION,
    minSources: MIN_SOURCES,
  });
  const rankOf = new Map<string, number>();
  let n = 0;
  for (const r of rows) if (r.ranked) rankOf.set(r.model.id, ++n);
  return { rows, rankOf };
}
const WITH = build(true);
const WITHOUT = build(false);
const { rows, rankOf } = WITH;
const benchById = new Map(benchmarks.map((b) => [b.id, b]));
const sources = groupBoards(benchmarks);

const taxonomy: [string, string[]][] = (() => {
  // Built from the measures that actually placed a model, not from every
  // measure in the snapshot. A source can be read and still score nothing —
  // a two-model comparison is dropped before aggregation — and listing its
  // domain anyway offers a column that opens empty.
  const scored = new Set(
    rows.flatMap((r) => r.perBenchmark.map((s) => s.benchmarkId)),
  );
  const m = new Map<string, string[]>();
  for (const b of benchmarks) {
    if (!scored.has(b.id)) continue;
    const list = m.get(b.category) ?? [];
    if (!list.includes(b.domain)) list.push(b.domain);
    m.set(b.category, list);
  }
  return [...m.entries()].sort(
    (a, b) =>
      categoryRank(a[0]) - categoryRank(b[0]) || a[0].localeCompare(b[0]),
  );
})();

const categoryOfDomain = new Map(
  taxonomy.flatMap(([category, domains]) =>
    domains.map((d) => [d, category] as const),
  ),
);

export type Scope =
  | { level: 'overall' }
  | { level: 'category'; category: string }
  | { level: 'domain'; category: string; domain: string };

const fold = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');

/** "coding", "Agentic coding", "overall" → a scope, or null when nothing matches. */
export function resolveScope(input: string | undefined): Scope | null {
  if (!input || fold(input) === 'overall' || fold(input) === 'index')
    return { level: 'overall' };
  // "category:Reasoning" / "domain:Reasoning" settle a name used at both levels.
  const prefixed = /^(category|domain):(.+)$/.exec(input.trim());
  if (prefixed) {
    const want = fold(prefixed[2]);
    for (const [category, domains] of taxonomy) {
      if (prefixed[1] === 'category' && fold(category) === want)
        return { level: 'category', category };
      if (prefixed[1] === 'domain')
        for (const domain of domains)
          if (fold(domain) === want)
            return { level: 'domain', category, domain };
    }
    return null;
  }
  const q = fold(input);
  for (const [category] of taxonomy)
    if (fold(category) === q) return { level: 'category', category };
  for (const [category, domains] of taxonomy)
    for (const domain of domains)
      if (fold(domain) === q) return { level: 'domain', category, domain };
  // Loose: a unique substring match on a domain, then a category.
  const domainHits = taxonomy.flatMap(([category, domains]) =>
    domains
      .filter((d) => fold(d).includes(q))
      .map((domain) => ({ category, domain })),
  );
  if (domainHits.length === 1) return { level: 'domain', ...domainHits[0] };
  const catHits = taxonomy.filter(([c]) => fold(c).includes(q));
  if (catHits.length === 1)
    return { level: 'category', category: catHits[0][0] };
  return null;
}

export const scopeLabel = (s: Scope) =>
  s.level === 'overall'
    ? 'Overall'
    : s.level === 'category'
      ? s.category
      : s.domain;

/** Overall ranks on independent publishers; a scope ranks on a recognised board's measurement in that scope. */
const eligible = (r: AggregateRow, s: Scope): boolean =>
  s.level === 'overall'
    ? r.ranked
    : s.level === 'category'
      ? (r.boardsByCategory[s.category] ?? 0) > 0
      : (r.boardsByDomain[s.domain] ?? 0) > 0;

const scopeScore = (r: AggregateRow, s: Scope): number | null =>
  s.level === 'overall'
    ? r.score
    : s.level === 'category'
      ? (r.byCategory[s.category] ?? null)
      : (r.byDomain[s.domain] ?? null);

function rawLabel(metric: Benchmark['metric'], raw: number) {
  if (metric === 'elo') return String(Math.round(raw));
  if (metric === 'percent') return `${raw}%`;
  return String(raw);
}

const r1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);

const agreement = (d: number) =>
  d >= 18 ? 'boards disagree' : d >= 9 ? 'mixed' : 'consistent';

export interface SourceFigure {
  source: string;
  kind: Benchmark['kind'];
  /** False when the model's own publisher printed this figure. */
  independent: boolean;
  measure: string;
  category: string;
  domain: string;
  /** The model string exactly as the source printed it. */
  label: string;
  scaffold?: string;
  raw: number;
  rawLabel: string;
  stderr?: number;
  normalized: number;
  url: string;
  retrievedAt: string;
  publishedAt?: string;
}

export interface ModelSummary {
  rank: number | null;
  id: string;
  name: string;
  org: string;
  /** Model line, from the name: "Claude", "GPT", "Qwen", "K2". */
  family: string;
  /** The Overall index, 0–100; null when no recognised board scores the model. */
  index: number | null;
  /**
   * Only when `index` is null: an estimate ✱ anchored on models that have an
   * Overall index — the model's figures placed among theirs on each shared
   * measure, their index read at that position, averaged by measure weight.
   * Never a rank; cite as an estimate.
   */
  estimatedIndex: {
    score: number;
    measures: number;
    anchors: number;
    /** `below`: trailed every anchor, score is a ceiling; `above`: led every anchor, score is a floor. */
    bound: 'below' | 'above' | null;
  } | null;
  /** The figure the list is ranked by, when a scope other than Overall was asked for. */
  scopeScore?: number | null;
  /** Ranked Overall: scored by boards from at least two independent publishers. */
  ranked: boolean;
  /** Ranked in the requested scope: a recognised board measured the model there. Equals `ranked` for Overall. */
  rankedInScope: boolean;
  /** Place in the returned list. Overall: the rank (null when provisional). A scope: every row's place; rankedInScope says whether a recognised board put it there. */
  position: number | null;
  /** Total parameters in billions where known (counted from the weights, or read from the name); null when undisclosed. */
  size: {
    paramsB: number;
    activeB?: number;
    source: string;
    label: string;
  } | null;
  sizeTier: SizeTier;
  /** Recognised boards scoring the model, out of those that could. */
  covered: number;
  coverable: number;
  reports: number;
  agreement: string;
  access: Recommendation;
}

export interface ModelDetail extends ModelSummary {
  evidence: number;
  byCategory: Record<string, number | null>;
  byDomain: Record<string, number | null>;
  figures: SourceFigure[];
  catalog?: {
    contextLength?: number;
    inputPerM?: number;
    outputPerM?: number;
    listedAt?: string;
    modalities?: string[];
    openWeights: boolean;
  };
}

function summarize(r: AggregateRow, scope: Scope): ModelSummary {
  return {
    rank: rankOf.get(r.model.id) ?? null,
    id: r.model.id,
    name: r.model.name,
    org: r.model.org,
    family: familyOf(r.model.name),
    index: r1(r.score),
    estimatedIndex:
      r.score === null && r.estimate
        ? { ...r.estimate, score: r1(r.estimate.score)! }
        : null,
    ...(scope.level !== 'overall'
      ? { scopeScore: r1(scopeScore(r, scope)) }
      : {}),
    ranked: r.ranked,
    rankedInScope: eligible(r, scope),
    position: null,
    size: r.model.size
      ? { ...r.model.size, label: sizeLabel(r.model.size)! }
      : null,
    sizeTier: tierOf(r.model.size),
    covered: r.covered,
    coverable: r.coverable,
    reports: r.reports,
    agreement: r.covered > 1 ? agreement(r.dispersion) : 'single board',
    access: recommend(r.model.access),
  };
}

function detail(r: AggregateRow): ModelDetail {
  const a = r.model.access;
  return {
    ...summarize(r, { level: 'overall' }),
    evidence: Math.round(r.evidence * 100) / 100,
    byCategory: Object.fromEntries(
      Object.entries(r.byCategory).map(([k, v]) => [k, r1(v)]),
    ),
    byDomain: Object.fromEntries(
      Object.entries(r.byDomain).map(([k, v]) => [k, r1(v)]),
    ),
    figures: r.perBenchmark.map((s) => {
      const b = benchById.get(s.benchmarkId)!;
      return {
        source: b.source,
        kind: b.kind,
        independent: b.independent ?? false,
        measure: b.name,
        category: b.category,
        domain: b.domain,
        label: s.sourceLabel,
        ...(s.scaffold ? { scaffold: s.scaffold } : {}),
        raw: s.raw,
        rawLabel: rawLabel(b.metric, s.raw),
        ...(s.stderr !== undefined ? { stderr: s.stderr } : {}),
        normalized: Math.round(s.normalized * 10) / 10,
        url: b.url,
        retrievedAt: b.retrievedAt,
        ...(b.publishedAt ? { publishedAt: b.publishedAt } : {}),
      };
    }),
    ...(a?.openrouter || a?.weights
      ? {
          catalog: {
            ...(a.openrouter?.contextLength
              ? { contextLength: a.openrouter.contextLength }
              : {}),
            ...(a.openrouter?.inputPerM !== undefined
              ? { inputPerM: a.openrouter.inputPerM }
              : {}),
            ...(a.openrouter?.outputPerM !== undefined
              ? { outputPerM: a.openrouter.outputPerM }
              : {}),
            ...(a.openrouter?.listedAt
              ? { listedAt: a.openrouter.listedAt }
              : {}),
            ...(a.openrouter?.modalities
              ? { modalities: a.openrouter.modalities }
              : {}),
            openWeights: Boolean(a.weights),
          },
        }
      : {}),
  };
}

export interface RankQuery {
  scope?: string;
  org?: string;
  /** Model line, e.g. "Claude", "GPT", "Qwen", "K2". */
  family?: string;
  minBoards?: number;
  limit?: number;
  openWeights?: boolean;
  /** Only models with a callable id in a catalog. */
  callable?: boolean;
  /** Include report ✱ figures (launch posts, blogs). Default true. */
  reports?: boolean;
  /** Size class by total parameters: small ≤ 15B, medium 15–100B, large 100B–1T, xlarge > 1T, undisclosed. */
  size?: SizeTier;
  /** Free-text match on model name or organisation. */
  q?: string;
  /** Source ids that must have scored the model; "any-report" for any ✱. */
  must?: string[];
}

export function rankModels(q: RankQuery = {}) {
  const scope = resolveScope(q.scope);
  if (!scope) {
    return {
      error: `Unknown scope "${q.scope}". Use "overall", a category or a domain; see describe_index.`,
      scopes: taxonomy.map(([category, domains]) => ({ category, domains })),
    };
  }
  const minBoards = q.minBoards ?? MIN_SOURCES;
  const limit = Math.max(1, Math.min(q.limit ?? 20, 100));
  const orgQ = q.org ? fold(q.org) : null;
  const includeReports = q.reports ?? true;
  const set = includeReports ? WITH : WITHOUT;

  let out = set.rows.filter((r) => {
    if (r.covered < minBoards) return false;
    if (!includeReports && r.covered === 0) return false;
    if (orgQ && fold(r.model.org) !== orgQ) return false;
    if (q.family && fold(familyOf(r.model.name)) !== fold(q.family))
      return false;
    if (q.size && tierOf(r.model.size) !== q.size) return false;
    if (q.q && !fold(`${r.model.name} ${r.model.org}`).includes(fold(q.q)))
      return false;
    if (q.must?.length) {
      const has = new Set(
        r.perBenchmark.map((s) => benchById.get(s.benchmarkId)!.group),
      );
      for (const m of q.must) {
        if (m === 'any-report' ? r.reports === 0 : !has.has(m)) return false;
      }
    }
    if (q.openWeights && !r.model.access?.weights) return false;
    if (q.callable && !r.model.access?.openrouter) return false;
    // Overall lists estimate-only rows too (estimatedIndex set, index null).
    if (scope.level === 'overall' && r.estimate) return true;
    return scopeScore(r, scope) !== null;
  });
  if (scope.level !== 'overall') {
    const by = compareScores<AggregateRow>((r) => scopeScore(r, scope));
    // With reports in, a row sits where its figure puts it (rankedInScope
    // false, position null when only reports placed it). Without, only
    // board-measured rows remain in the scope.
    out = [...out].filter((r) => includeReports || eligible(r, scope)).sort(by);
  }
  let n = 0;
  const models = out.slice(0, limit).map((r) => {
    const m = summarize(r, scope);
    if (scope.level === 'overall') m.position = m.ranked ? ++n : null;
    else m.position = ++n;
    return m;
  });
  const inScope =
    scope.level === 'overall'
      ? []
      : benchmarks.filter((b) =>
          scope.level === 'category'
            ? b.category === scope.category
            : b.domain === scope.domain,
        );
  const scopeBoards = new Set(
    inScope.filter((b) => b.kind !== 'report').map((b) => b.group),
  ).size;
  const scopeReports = [
    ...new Set(inScope.filter((b) => b.kind === 'report').map((b) => b.source)),
  ];
  return {
    generatedAt,
    scope: scopeLabel(scope),
    level: scope.level,
    /** Recognised boards with a measure in this scope. 0 means every figure is from reports ✱: a publisher-chosen comparison set, not the field. */
    ...(scope.level !== 'overall'
      ? {
          scopeBoards,
          scopeReports,
          ...(scopeBoards === 0
            ? {
                warning: `No recognised board measures ${scopeLabel(scope)} yet. Every figure is from ${scopeReports.join(' and ')} ✱ — a comparison set the publisher chose. Models the publisher left out are absent, not behind; read positions as within that set.`,
              }
            : {}),
        }
      : {}),
    minBoards,
    reports: includeReports,
    ...(q.size ? { size: q.size } : {}),
    total: out.length,
    models,
    note: 'Scores are 0–100 standardized across the models each source lists; 50 is that measure’s average, not a grade. Overall ranks a model once boards from two independent publishers have scored it; a category or domain ranks any model a recognised board measured there. Report (✱) figures never rank a model on their own. This is a snapshot dated generatedAt, not a live feed; every figure links to its publisher.',
  };
}

export function getModel(query: string) {
  const q = fold(query);
  const exact =
    rows.find((r) => r.model.id === query.trim()) ??
    rows.find((r) => fold(r.model.name) === q) ??
    rows.find((r) => fold(`${r.model.org} ${r.model.name}`) === q);
  if (exact) return { generatedAt, model: detail(exact) };
  const loose = rows.filter((r) => fold(r.model.name).includes(q));
  if (loose.length === 1) return { generatedAt, model: detail(loose[0]) };
  return {
    error:
      loose.length === 0
        ? `No model matches "${query}".`
        : `"${query}" is ambiguous; pass one of the ids below.`,
    candidates: loose.slice(0, 20).map((r) => ({
      id: r.model.id,
      name: r.model.name,
      org: r.model.org,
      rank: rankOf.get(r.model.id) ?? null,
    })),
  };
}

export function describeIndex() {
  const boards = sources.filter((s) => s.kind !== 'report');
  const reports = sources.filter((s) => s.kind === 'report');
  const weightOf = new Map(WEIGHTING.map((w) => [w.benchmarkId, w]));
  return {
    name: 'PublicAI Index',
    url: INDEX_URL,
    mcp: MCP_URL,
    api: API_URL,
    feed: `${INDEX_URL}/feed.xml`,
    generatedAt,
    counts: {
      models: models.length,
      ranked: rankOf.size,
      boards: boards.length,
      reports: reports.length,
      measures: benchmarks.length,
      categories: taxonomy.length,
      domains: taxonomy.reduce((n, [, d]) => n + d.length, 0),
    },
    method: [
      'Each measure is z-scored across the models its source lists and mapped to 0–100 (mean 50, sd 15).',
      'Where a source publishes an error bar, the figure’s weight is discounted by how wide it is relative to the board’s spread.',
      `A model absent from a source is excluded from that term, never imputed; a prior worth ${Math.round(PRIOR_FRACTION * 100)}% of the in-scope weight pulls thin evidence toward 50.`,
      `Overall ranks a model once ${MIN_SOURCES} independent publishers among the boards that build the index have scored it — a board that shapes only a domain does not count toward it; otherwise the model is provisional. A category or domain ranks any model a recognised board has measured there.`,
      `Reports (launch posts, blogs) are marked ✱ and shape their domain only, never the Overall index. An independent write-up carries ${INDEPENDENT_REPORT_WEIGHT} against a board measure's ${BOARD_MEASURE_WEIGHT}; a figure the model's own publisher printed carries ${VENDOR_REPORT_WEIGHT}.`,
      'A model with no Overall index gets an estimate ✱ (estimatedIndex): its figures on each shared measure are placed among models that have an index, and theirs is read at that position; outside their range the nearest anchor is a bound (ceiling or floor), not a point. Never a rank.',
    ],
    overallWeighting: boards
      .filter((b) => weightOf.has(b.id))
      .map((b) => ({
        source: b.name,
        weight: weightOf.get(b.id)!.weight,
        rationale: weightOf.get(b.id)!.rationale,
        url: b.headline.url,
      })),
    sources: sources.map((s) => ({
      id: s.id,
      name: s.name,
      kind: s.kind,
      publisher: s.headline.publisher,
      url: s.headline.url,
      retrievedAt: s.headline.retrievedAt,
      ...(s.headline.publishedAt
        ? { publishedAt: s.headline.publishedAt }
        : {}),
      measures: s.measures.map((m) => ({
        name: m.name,
        category: m.category,
        domain: m.domain,
      })),
      ...(s.headline.caveat ? { caveat: s.headline.caveat } : {}),
    })),
    excluded,
    catalogs,
    scopes: taxonomy.map(([category, domains]) => ({ category, domains })),
    access: recommend(undefined).rule,
    limits: [
      'Reasoning-effort tiers are matched by rule; the highest published tier is indexed and the exact label kept.',
      'Some sources score a scaffold (model + agent framework), recorded beside the figure.',
      'Model identity is inferred from names; every merge is logged, but a wrong merge is possible.',
      'Report figures are the publisher’s own and may mix effort tiers or copied competitor numbers.',
      'A snapshot, not a live feed: check the source before acting on a number.',
    ],
  };
}

export interface Peer {
  id: string;
  name: string;
  org: string;
  score: number;
  position: number;
  isSubject: boolean;
}

export interface StandingsMiss {
  error: string;
  candidates: { id: string; name: string; org: string; rank: number | null }[];
}

export interface Rival {
  id: string;
  name: string;
  org: string;
  /** Scopes where both are placed. */
  met: number;
  /** Of those, how many the rival finished ahead in. */
  ahead: number;
}

export interface StandingsHit {
  generatedAt: string;
  model: ModelDetail;
  standings: Standing[];
  /** Who this model keeps running into, across every scope it appears in. */
  rivals: Rival[];
}

export interface Standing {
  scope: string;
  level: 'category' | 'domain';
  /** For a domain, the category it belongs to — the page nests them. */
  category?: string;
  /** The scope's leader, so a score can be read as a distance rather than alone. */
  leader: { name: string; score: number };
  /** Where a model sits and how crowded the scope is. */
  position: number;
  total: number;
  score: number;
  /** Recognised boards with a measure here. 0 means every figure is a report ✱. */
  boards: number;
  /** A recognised board put the model here, rather than a report ✱. */
  rankedInScope: boolean;
  /** The head of the table, plus the model itself when it sits below it. */
  peers: Peer[];
}

/**
 * One model's standing everywhere it has a figure, strongest placement first.
 *
 * The table answers "who leads this domain"; this answers "where does this
 * model land", which is the question anyone arrives with after reading a
 * launch post. Same numbers as the table by construction — it asks the table.
 */
/**
 * A scope's whole ranking, under the defaults. rankModels caps its response
 * at 100 for the API's sake; a model sitting at #120 still has neighbours,
 * and they are the point of the comparison. Same filter and same comparator,
 * and a test asserts the two never disagree.
 */
function fullRanking(scope: Scope) {
  const out = WITH.rows.filter((r) => {
    if (r.covered < MIN_SOURCES) return false;
    if (scope.level === 'overall' && r.estimate) return true;
    return scopeScore(r, scope) !== null;
  });
  if (scope.level === 'overall') return out;
  return [...out].sort(
    compareScores<AggregateRow>((r) => scopeScore(r, scope)),
  );
}

/** Rows either side of a model, plus the leader as the scale's anchor. */
const NEIGHBOURS = 3;

export function modelStandings(query: string): StandingsHit | StandingsMiss {
  // getModel's success shape carries `error?: undefined`, so `'error' in x`
  // narrows nothing. Rebuild the miss instead of passing it through.
  const found = getModel(query);
  if (found.error !== undefined)
    return { error: found.error, candidates: found.candidates ?? [] };
  const model = found.model;

  // Built as Scope objects, not looked up by name: "Reasoning", "General"
  // and "Human preference" name both a category and a domain, and a bare
  // name resolves to the category — which put the category's numbers on
  // the domain's panel (2026-09-10).
  const scopes: (Scope & { level: 'category' | 'domain' })[] = [
    ...Object.entries(model.byCategory)
      .filter(([, v]) => v !== null)
      .map(([category]) => ({ level: 'category' as const, category })),
    ...Object.entries(model.byDomain)
      .filter(([, v]) => v !== null)
      .map(([domain]) => ({
        level: 'domain' as const,
        category: categoryOfDomain.get(domain) ?? '',
        domain,
      })),
  ];

  const standings: Standing[] = [];
  // The same dozen models turn up in every scope, which made twenty-three
  // panels twenty-three copies of one competitive set. Counted once, that
  // repetition becomes the most useful fact on the page.
  const met = new Map<
    string,
    { row: AggregateRow; met: number; ahead: number }
  >();

  for (const scope of scopes) {
    const ranked = fullRanking(scope);
    const idx = ranked.findIndex((r) => r.model.id === model.id);
    if (idx === -1) continue;
    const me = summarize(ranked[idx], scope);
    if (me.scopeScore == null) continue;

    // The leader anchors the scale — without it, "#49 scored 55.9" says
    // nothing about whether that is close to the front or nowhere near it.
    const wanted = new Set<number>([0]);
    for (let i = idx - NEIGHBOURS; i <= idx + NEIGHBOURS; i++)
      if (i >= 0 && i < ranked.length) wanted.add(i);

    const peers: Peer[] = [...wanted]
      .sort((a, b) => a - b)
      .map((i) => {
        const m = summarize(ranked[i], scope);
        return {
          id: m.id,
          name: m.name,
          org: m.org,
          score: m.scopeScore ?? 0,
          position: i + 1,
          isSubject: m.id === model.id,
        };
      });

    for (let i = 0; i < ranked.length; i++) {
      const r = ranked[i];
      if (r.model.id === model.id) continue;
      const seen = met.get(r.model.id) ?? { row: r, met: 0, ahead: 0 };
      seen.met += 1;
      if (i < idx) seen.ahead += 1;
      met.set(r.model.id, seen);
    }

    const inScope = benchmarks.filter((b) =>
      scope.level === 'category'
        ? b.category === scope.category
        : scope.level === 'domain'
          ? b.domain === scope.domain
          : false,
    );
    const head = summarize(ranked[0], scope);
    standings.push({
      scope: scopeLabel(scope),
      level: scope.level,
      ...(scope.level === 'domain' && inScope[0]
        ? { category: inScope[0].category }
        : {}),
      leader: { name: head.name, score: head.scopeScore ?? 0 },
      position: idx + 1,
      total: ranked.length,
      score: me.scopeScore,
      boards: new Set(
        inScope.filter((b) => b.kind !== 'report').map((b) => b.group),
      ).size,
      rankedInScope: me.rankedInScope,
      peers,
    });
  }
  standings.sort((a, b) => a.position - b.position || b.total - a.total);

  // Only models met nearly everywhere: one shared scope says nothing, and a
  // list of near-strangers is the noise this section exists to remove.
  const floor = Math.max(2, Math.ceil(standings.length * 0.6));
  const rivals: Rival[] = [...met.values()]
    .filter((r) => r.met >= floor)
    .map((r) => ({
      id: r.row.model.id,
      name: r.row.model.name,
      org: r.row.model.org,
      met: r.met,
      ahead: r.ahead,
    }))
    .sort((a, b) => b.ahead / b.met - a.ahead / a.met || b.met - a.met);

  return { generatedAt, model, standings, rivals };
}
