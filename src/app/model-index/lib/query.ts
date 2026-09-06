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
import {
  categoryRank,
  MIN_SOURCES,
  OVERALL,
  PRIOR_FRACTION,
  REPORT_WEIGHT,
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

const weights = weightsFor(benchmarks);
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
{
  let n = 0;
  for (const r of rows) if (r.ranked) rankOf.set(r.model.id, ++n);
}
const benchById = new Map(benchmarks.map((b) => [b.id, b]));
const sources = groupBoards(benchmarks);

const taxonomy: [string, string[]][] = (() => {
  const m = new Map<string, string[]>();
  for (const b of benchmarks) {
    const list = m.get(b.category) ?? [];
    if (!list.includes(b.domain)) list.push(b.domain);
    m.set(b.category, list);
  }
  return [...m.entries()].sort(
    (a, b) =>
      categoryRank(a[0]) - categoryRank(b[0]) || a[0].localeCompare(b[0]),
  );
})();

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
  /** The Overall index, 0–100; null when no recognised board scores the model. */
  index: number | null;
  /** The figure the list is ranked by, when a scope other than Overall was asked for. */
  scopeScore?: number | null;
  ranked: boolean;
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
    index: r1(r.score),
    ...(scope.level !== 'overall'
      ? { scopeScore: r1(scopeScore(r, scope)) }
      : {}),
    ranked: r.ranked,
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
  minBoards?: number;
  limit?: number;
  openWeights?: boolean;
  /** Only models with a callable id in a catalog. */
  callable?: boolean;
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

  let out = rows.filter((r) => {
    if (r.covered < minBoards) return false;
    if (orgQ && fold(r.model.org) !== orgQ) return false;
    if (q.openWeights && !r.model.access?.weights) return false;
    if (q.callable && !r.model.access?.openrouter) return false;
    return scopeScore(r, scope) !== null;
  });
  if (scope.level !== 'overall') {
    const by = compareScores<AggregateRow>((r) => scopeScore(r, scope));
    out = [...out].sort(
      (a, b) => Number(b.ranked) - Number(a.ranked) || by(a, b),
    );
  }
  return {
    generatedAt,
    scope: scopeLabel(scope),
    level: scope.level,
    minBoards,
    total: out.length,
    models: out.slice(0, limit).map((r) => summarize(r, scope)),
    note: 'Scores are 0–100 standardized across the models each source lists; 50 is that measure’s average, not a grade. Models below minBoards recognised boards are provisional and carry no rank. This is a snapshot dated generatedAt, not a live feed; every figure links to its publisher.',
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
      `A model needs ${MIN_SOURCES} recognised boards to be ranked; otherwise it is provisional.`,
      `Reports (launch posts, blogs) are marked ✱, carry ${REPORT_WEIGHT}% of a board’s share in their domain only, and never enter the Overall index.`,
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
