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
