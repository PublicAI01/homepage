import { describe, expect, it } from 'vitest';

import { models } from '../data';
import { ACCESS_RULE } from './access';
import {
  describeIndex,
  getModel,
  type ModelSummary,
  rankModels,
  resolveScope,
} from './query';
import { MIN_SOURCES, WEIGHTING } from './weights';

const ok = (r: ReturnType<typeof rankModels>) => {
  if ('error' in r) throw new Error(r.error);
  return r;
};

describe('resolveScope', () => {
  it('maps overall, categories and domains, case-insensitively', () => {
    expect(resolveScope(undefined)).toEqual({ level: 'overall' });
    expect(resolveScope('Overall')).toEqual({ level: 'overall' });
    expect(resolveScope('coding')).toEqual({
      level: 'category',
      category: 'Coding',
    });
    expect(resolveScope('agentic coding')).toMatchObject({
      level: 'domain',
      domain: 'Agentic coding',
    });
  });

  it('accepts a unique substring and rejects an ambiguous or unknown one', () => {
    expect(resolveScope('instruction')).toMatchObject({ level: 'domain' });
    expect(resolveScope('zzz-not-a-scope')).toBeNull();
  });
});

describe('rankModels', () => {
  it('ranks the Overall index, ranked models only by default, with rank numbers in order', () => {
    const r = ok(rankModels({ limit: 10 }));
    expect(r.scope).toBe('Overall');
    expect(r.models.length).toBe(10);
    r.models.forEach((m, i) => {
      expect(m.rank).toBe(i + 1);
      expect(m.ranked).toBe(true);
      expect(m.covered).toBeGreaterThanOrEqual(MIN_SOURCES);
    });
  });

  it('sorts a scope by its own figure and omits models with none', () => {
    const r = ok(rankModels({ scope: 'Mathematics', limit: 50 }));
    const scores = r.models.map((m) => m.scopeScore as number);
    for (const s of scores) expect(typeof s).toBe('number');
    const rankedPart = r.models
      .filter((m) => m.ranked)
      .map((m) => m.scopeScore as number);
    expect([...rankedPart].sort((a, b) => b - a)).toEqual(rankedPart);
  });

  it('filters by organisation, open weights and callable id', () => {
    for (const m of ok(rankModels({ org: 'anthropic' })).models)
      expect(m.org).toBe('Anthropic');
    for (const m of ok(
      rankModels({ openWeights: true, minBoards: 0, limit: 100 }),
    ).models)
      expect(
        m.access.alternatives
          .concat(m.access.recommended ?? [])
          .some((c) => c.kind === 'weights'),
      ).toBe(true);
    for (const m of ok(rankModels({ callable: true, limit: 100 })).models)
      expect(m.access.recommended?.kind).toBe('openrouter');
  });

  it('carries the access rule with every recommendation', () => {
    const m: ModelSummary = ok(rankModels({ limit: 1 })).models[0];
    expect(m.access.rule).toBe(ACCESS_RULE);
  });

  it('explains an unknown scope instead of guessing', () => {
    const r = rankModels({ scope: 'basket weaving' });
    expect('error' in r && r.error).toMatch(/Unknown scope/);
  });
});

describe('getModel', () => {
  it('finds by id, by name, and reports provenance for every figure', () => {
    const byId = getModel('claude-fable-5-1');
    const byName = getModel('Claude Fable 5.1');
    if ('error' in byId || 'error' in byName) throw new Error('not found');
    expect(byId.model.id).toBe(byName.model.id);
    expect(byId.model.figures.length).toBeGreaterThan(0);
    for (const f of byId.model.figures) {
      expect(f.url).toMatch(/^https:\/\//);
      expect(f.label).toBeTruthy();
      expect(f.rawLabel).toBeTruthy();
    }
    expect(byId.model.access.recommended?.model).toBe(
      'anthropic/claude-fable-5.1',
    );
  });

  it('lists candidates when the name is ambiguous', () => {
    const r = getModel('GPT');
    expect('error' in r).toBe(true);
    if ('error' in r) expect(r.candidates!.length).toBeGreaterThan(1);
  });
});

describe('describeIndex', () => {
  it('states the weighting that sums to 100 and every source with its url', () => {
    const d = describeIndex();
    expect(d.overallWeighting.reduce((n, w) => n + w.weight, 0)).toBe(100);
    expect(d.overallWeighting.length).toBe(WEIGHTING.length);
    for (const s of d.sources) expect(s.url).toMatch(/^https:\/\//);
    expect(d.counts.models).toBe(models.length);
    expect(d.scopes.length).toBeGreaterThan(3);
  });
});

describe('reports switch', () => {
  it('drops report-only models and report figures when reports are off', () => {
    const on = ok(rankModels({ scope: 'agents', minBoards: 0, limit: 100 }));
    const off = ok(
      rankModels({ scope: 'agents', minBoards: 0, limit: 100, reports: false }),
    );
    expect(off.total).toBeLessThanOrEqual(on.total);
    for (const m of off.models) {
      expect(m.covered).toBeGreaterThan(0);
      expect(m.rankedInScope).toBe(true);
    }
    // Overall rank is untouched by the switch: reports never enter it.
    const a = ok(rankModels({ limit: 20 })).models.map((m) => m.name);
    const b = ok(rankModels({ limit: 20, reports: false })).models.map(
      (m) => m.name,
    );
    expect(a).toEqual(b);
  });

  it('numbers every row in a scope by its place and flags report-only placement', () => {
    // Asserted against the reports-off list rather than against a count of
    // starred rows: whether any scope currently holds one is a fact about
    // today's snapshot, and boards covering a domain that reports used to
    // carry alone is the outcome this index is built to produce.
    const { scopes } = describeIndex();
    const all = [
      'overall',
      ...scopes.map((s) => s.category),
      ...scopes.flatMap((s) => s.domains),
    ];
    for (const scope of all) {
      const on = ok(rankModels({ scope, minBoards: 0, limit: 500 }));
      const off = ok(
        rankModels({ scope, minBoards: 0, limit: 500, reports: false }),
      );
      // Overall leaves a provisional row unnumbered, so the run of numbers
      // is over the rows that have one — and it still has to be 1..k with no
      // gaps, which is what "numbered by its place" means.
      const numbered = on.models
        .map((m) => m.position)
        .filter((p): p is number => p !== null);
      expect(numbered).toEqual(numbered.map((_, i) => i + 1));

      // One direction only. A row flagged as report-placed can never appear
      // once reports are off; the converse would need both lists whole, and
      // both are cut to the same limit from different orderings.
      // Domains only. In a domain, `rankedInScope` means "no recognised board
      // measured it here", so such a row cannot be in the reports-off list. In
      // Overall the same flag means "fewer than two publishers among the boards
      // that build the index" — a board-measured model can fail that and still
      // belong in the list, which is the rule doing its job, not a leak.
      if (scope !== 'overall') {
        const byBoard = new Set(off.models.map((m) => m.id));
        for (const m of on.models) {
          if (!m.rankedInScope) expect(byBoard.has(m.id)).toBe(false);
        }
      }
      // Same reason: with reports off, every row in a domain is there because
      // a board measured it. Overall's flag is the ranking rule, and a
      // board-measured model can fail that rule.
      if (scope !== 'overall')
        for (const m of off.models) expect(m.rankedInScope).toBe(true);
    }
  });
});
