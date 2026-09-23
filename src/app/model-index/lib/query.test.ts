import { describe, expect, it } from 'vitest';

import { benchmarks, models, scores } from '../data';
import { ACCESS_RULE, UNCATALOGUED_RULE } from './access';
import {
  describeIndex,
  getModel,
  modelStandings,
  type ModelSummary,
  positionIn,
  rankModels,
  resolveScope,
} from './query';
import { video } from './tracks';
import {
  MIN_BOARDS_TO_VOTE_IN,
  MIN_MODELS_FOR_HEADLINE,
  MIN_SOURCES,
  WEIGHTING,
} from './weights';

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
    expect(describeIndex().access).toBe(ACCESS_RULE);
  });

  it('does not send a video model to OpenRouter', () => {
    expect(video.describeIndex().access).toBe(UNCATALOGUED_RULE);
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
  it('lists the same rows either way; only board-measured ones take a number', () => {
    // Reports ✱ are always listed and cited; the switch decides whether
    // their figures enter the scores. A row only reports placed is there
    // both ways, unnumbered both ways.
    const on = ok(
      rankModels({ scope: 'agents', minBoards: 0, limit: 500, reports: true }),
    );
    const off = ok(rankModels({ scope: 'agents', minBoards: 0, limit: 500 }));
    // The same universe (the response is capped, so totals, not pages).
    expect(off.total).toBe(on.total);
    expect(off.scopeTotal).toBe(on.scopeTotal);
    for (const m of off.models) {
      expect(m.position === null).toBe(!m.rankedInScope);
      if (m.rankedInScope) expect(m.covered).toBeGreaterThan(0);
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
      const on = ok(
        rankModels({ scope, minBoards: 0, limit: 500, reports: true }),
      );
      const off = ok(rankModels({ scope, minBoards: 0, limit: 500 }));
      // Overall leaves a provisional row unnumbered, so the run of numbers
      // is over the rows that have one — and it still has to be 1..k with no
      // gaps, which is what "numbered by its place" means.
      const numbered = on.models
        .map((m) => m.position)
        .filter((p): p is number => p !== null);
      expect(numbered).toEqual(numbered.map((_, i) => i + 1));

      // In a domain, `rankedInScope` false means "no recognised board
      // measured it here". Such a row is listed either way — its ✱ figure
      // is the only evidence there is for it — and never numbered, either
      // way. In Overall the same flag means "fewer than two publishers
      // among the boards that build the index", which a board-measured
      // model can fail; that is the rule working, not a leak.
      if (scope !== 'overall')
        for (const list of [on, off])
          for (const m of list.models)
            expect(m.position === null).toBe(!m.rankedInScope);
    }
  });
});

describe('the taxonomy offers nothing empty', () => {
  it('never lists a scope that opens with no models in it', () => {
    // A source can be read and score nothing — a two-model comparison is
    // dropped before aggregation — and its domain used to be offered anyway.
    const { scopes } = describeIndex();
    for (const s of scopes) {
      expect(
        ok(rankModels({ scope: s.category, minBoards: 0 })).models.length,
      ).toBeGreaterThan(0);
      for (const d of s.domains)
        expect(
          ok(rankModels({ scope: d, minBoards: 0 })).models.length,
        ).toBeGreaterThan(0);
    }
  });

  it('offers a domain only when boards voted it in or it is broad enough', () => {
    // One board's sub-score wearing a domain's name is not a headline
    // ranking. Voted in by several boards, or wide on the one — otherwise
    // it stays on the model pages and off the Rank-by strip.
    const { scopes } = describeIndex();
    for (const s of scopes)
      for (const d of s.domains) {
        const r = ok(rankModels({ scope: `domain:${d}`, reports: false }));
        const boards = r.scopeBoards ?? 0;
        expect(boards, d).toBeGreaterThanOrEqual(1);
        // "Ranks at least 20 models there" counts what the board ranked,
        // not what the default list shows after its own filters.
        if (boards < MIN_BOARDS_TO_VOTE_IN)
          expect(r.scopeTotal, d).toBeGreaterThanOrEqual(
            MIN_MODELS_FOR_HEADLINE,
          );
      }
  });

  it('keeps every domain reachable by link, listed or not', () => {
    // A quieter domain is off the strip, not out of the data: an agent or a
    // saved link still resolves it, and the model page still shows it.
    const listed = new Set(describeIndex().scopes.flatMap((s) => s.domains));
    // Only domains that placed a model: a measure that scored nothing has
    // no ranking to reach, listed or not.
    const scored = new Set(
      ok(rankModels({ minBoards: 0, limit: 1000 })).models.flatMap((m) => {
        const d = getModel(m.id);
        return 'error' in d ? [] : d.model.figures.map((f) => f.domain);
      }),
    );
    const hidden = [...scored].filter((d) => !listed.has(d));
    expect(hidden.length).toBeGreaterThan(0);
    for (const d of hidden)
      expect(resolveScope(`domain:${d}`), d).not.toBeNull();
  });
});

describe('one position, wherever it is printed', () => {
  const scopes = describeIndex().scopes.flatMap((s) => [
    s.category,
    ...s.domains.map((d) => `domain:${d}`),
  ]);

  it('numbers only board-measured rows, and does not renumber for a filter', () => {
    for (const scope of scopes) {
      const all = ok(rankModels({ scope, minBoards: 0, limit: 100 }));
      const thin = ok(rankModels({ scope, minBoards: 3, limit: 100 }));
      const bySeen = new Map(all.models.map((m) => [m.id, m.position]));
      let last = 0;
      for (const m of all.models) {
        if (m.rankedInScope) {
          expect(m.position, `${scope} ${m.name}`).toBe(last + 1);
          last = m.position!;
        } else {
          expect(m.position, `${scope} ${m.name}`).toBeNull();
        }
      }
      // A stricter filter hides rows; the ones left keep their number.
      for (const m of thin.models)
        if (bySeen.has(m.id)) expect(m.position).toBe(bySeen.get(m.id));
    }
  });

  it('agrees between the list, the badge and the model page', () => {
    for (const scope of scopes.slice(0, 12)) {
      const listed = ok(rankModels({ scope, minBoards: 0, limit: 25 }));
      for (const m of listed.models) {
        const badge = positionIn(m.id, { scope, minBoards: 0 });
        expect(badge?.position, `${scope} ${m.name}`).toBe(m.position);
        const page = modelStandings(m.id);
        if ('error' in page) throw new Error(page.error);
        const s = page.standings.find((x) => x.scope === listed.scope);
        expect(s?.position, `${scope} ${m.name}`).toBe(m.position);
        expect(s?.total).toBe(listed.scopeTotal);
      }
    }
  });

  it('still answers to a scope’s old name', () => {
    // "General" became "Core abilities" on 2026-09-23; a saved link and an
    // agent's stored query must not start answering "unknown scope".
    const now = resolveScope('category:Core abilities');
    expect(now).toEqual(resolveScope('category:General'));
    expect(now).toEqual(resolveScope('General'));
    expect(now?.level).toBe('category');
  });

  it('lists every model it carries a figure for, even with no Overall to show', () => {
    // A model whose only figures may not stand in for a capability index —
    // a safety-only model, a System One model — has no score and no
    // estimate. Requiring one hid all 122 safety-only models from the day
    // the safety anchors were excluded: the index carried their numbers
    // and no reader could reach them, by search or by scrolling
    // (2026-09-22). They belong on the list with a "—".
    expect(ok(rankModels({ minBoards: 0, limit: 1 })).total).toBe(
      models.length,
    );
    const categoryOf = new Map(benchmarks.map((b) => [b.id, b.category]));
    const scoredIn = new Map<string, Set<string>>();
    for (const s of scores) {
      const set = scoredIn.get(s.modelId) ?? new Set<string>();
      set.add(categoryOf.get(s.benchmarkId) ?? '');
      scoredIn.set(s.modelId, set);
    }
    const capabilityFree = models.filter((m) => {
      const cats = scoredIn.get(m.id);
      return cats !== undefined && [...cats].every((c) => c === 'Safety');
    });
    expect(capabilityFree.length).toBeGreaterThan(0);
    for (const m of capabilityFree.slice(0, 5)) {
      const row = ok(rankModels({ q: m.name, minBoards: 0 })).models.find(
        (x) => x.id === m.id,
      );
      expect(row, m.name).toBeDefined();
      expect(row!.index, m.name).toBeNull();
      expect(row!.rank, m.name).toBeNull();
      expect(row!.estimatedIndex ?? null, m.name).toBeNull();
    }
  });
});
