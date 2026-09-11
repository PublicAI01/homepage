import { describe, expect, it } from 'vitest';

import { modelStandings, rankModels } from './query';

describe('modelStandings', () => {
  const found = modelStandings('k2-horizon-375b-a23b');
  if ('error' in found) throw new Error(found.error);

  it('carries the model and at least one placement', () => {
    expect(found.model.name).toContain('K2 Horizon');
    expect(found.standings.length).toBeGreaterThan(0);
  });

  it('agrees with the table it asked — same position, same total', () => {
    for (const s of found.standings) {
      const r = rankModels({ scope: s.scope, reports: true, limit: 100 });
      if ('error' in r || !('models' in r))
        throw new Error(`no scope ${s.scope}`);
      const me = r.models.find((m) => m.id === found.model.id);
      // rankModels caps at 100; only compare where it can see the model.
      if (me) {
        expect(me.position).toBe(s.position);
        expect(me.scopeScore).toBe(s.score);
      }
      expect(r.scopeTotal).toBe(s.total);
    }
  });

  it('always shows the model among its peers', () => {
    for (const s of found.standings) {
      expect(s.peers.some((p) => p.isSubject)).toBe(true);
      expect(s.peers.find((p) => p.isSubject)!.position).toBe(s.position);
    }
  });

  it('shows the leader, so the scale has an anchor', () => {
    for (const s of found.standings) {
      // In a scope no board measures, the top report-only row stands in.
      if (s.total === 0) continue;
      expect(s.peers[0].position).toBe(1);
      expect(s.peers[0].name).toBe(s.leader.name);
    }
  });

  it('shows the neighbours either side, clipped at the ends', () => {
    for (const s of found.standings) {
      if (s.position === null) continue;
      const pos = s.position;
      const near = s.peers.filter(
        (p) => p.position !== null && Math.abs(p.position - pos) <= 3,
      );
      // Report-only rows sit between numbered ones without a number, so
      // the window can hold fewer numbered peers than its width, never more.
      const width = Math.min(s.total, pos + 3) - Math.max(1, pos - 3) + 1;
      expect(near.length).toBeGreaterThanOrEqual(1);
      expect(near.length).toBeLessThanOrEqual(width);
    }
  });

  it('lists peers in rank order, never repeating one', () => {
    for (const s of found.standings) {
      const ps = s.peers.flatMap((p) =>
        p.position === null ? [] : [p.position],
      );
      expect([...ps].sort((a, b) => a - b)).toEqual(ps);
      expect(new Set(ps).size).toBe(ps.length);
      expect(new Set(s.peers.map((p) => p.id)).size).toBe(s.peers.length);
    }
  });

  it('never ranks a model past the size of its scope', () => {
    for (const s of found.standings) {
      if (s.position === null) continue;
      expect(s.position).toBeGreaterThanOrEqual(1);
      expect(s.position).toBeLessThanOrEqual(s.total);
    }
  });

  it('orders by placement, strongest first, report-only placements last', () => {
    const positions = found.standings.map((s) => s.position ?? Infinity);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('gives no number to a placement only reports ✱ made', () => {
    for (const s of found.standings)
      expect(s.position === null).toBe(!s.rankedInScope);
  });

  it('never claims a board placed a model a board did not measure', () => {
    for (const s of found.standings)
      if (s.boards === 0) expect(s.rankedInScope).toBe(false);
  });

  it('reports the models it cannot find', () => {
    const r = modelStandings('definitely-not-a-model-xyz');
    expect('error' in r).toBe(true);
  });
});

describe('rivals', () => {
  const found = modelStandings('k2-horizon-375b-a23b');
  if ('error' in found) throw new Error(found.error);

  it('only counts models met in most of the scopes', () => {
    const floor = Math.max(2, Math.ceil(found.standings.length * 0.6));
    for (const r of found.rivals) expect(r.met).toBeGreaterThanOrEqual(floor);
  });

  it('never claims a rival finished ahead more often than they met', () => {
    for (const r of found.rivals) {
      expect(r.ahead).toBeGreaterThanOrEqual(0);
      expect(r.ahead).toBeLessThanOrEqual(r.met);
      expect(r.met).toBeLessThanOrEqual(found.standings.length);
    }
  });

  it('never lists the model as its own rival', () => {
    expect(found.rivals.some((r) => r.id === found.model.id)).toBe(false);
  });

  it('orders by how often they finish ahead', () => {
    const share = found.rivals.map((r) => r.ahead / r.met);
    expect([...share].sort((a, b) => b - a)).toEqual(share);
  });
});

describe('modelStandings scope identity', () => {
  // "Reasoning", "General" and "Human preference" name both a category and
  // a domain. Resolving the domain by bare name returned the category, so
  // the domain panel carried the category's score and position.
  it('scores a domain standing from byDomain and a category one from byCategory', () => {
    const found = modelStandings('claude-fable-5-1');
    if ('error' in found) throw new Error(found.error);
    const { model, standings } = found;
    expect(
      standings.some(
        (s) => s.level === 'domain' && s.scope in model.byCategory,
      ),
    ).toBe(true);
    for (const s of standings) {
      const table = s.level === 'domain' ? model.byDomain : model.byCategory;
      expect(s.score).toBe(table[s.scope]);
    }
  });
});

describe('standings — nesting and scale', () => {
  const found = modelStandings('k2-horizon-375b-a23b');
  if ('error' in found) throw new Error(found.error);

  it('names the category a domain belongs to, and none for a category itself', () => {
    for (const s of found.standings) {
      if (s.level === 'domain') expect(typeof s.category).toBe('string');
      else expect(s.category).toBeUndefined();
    }
  });

  it('carries the leader of every scope', () => {
    for (const s of found.standings) {
      expect(s.leader.name).toBeTruthy();
      expect(s.leader.score).toBeGreaterThanOrEqual(s.score);
      expect(s.leader.name).toBe(s.peers[0].name);
    }
  });

  it('gives the model itself as leader only when it leads', () => {
    for (const s of found.standings) {
      if (s.total === 0) continue;
      expect(s.leader.name === found.model.name).toBe(s.position === 1);
    }
  });
});
