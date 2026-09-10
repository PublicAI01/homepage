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
      if ('error' in r || !('models' in r)) throw new Error(`no scope ${s.scope}`);
      const me = r.models.find((m) => m.id === found.model.id);
      // rankModels caps at 100; only compare where it can see the model.
      if (me) {
        expect(me.position).toBe(s.position);
        expect(me.scopeScore).toBe(s.score);
      }
      expect(r.total).toBe(s.total);
    }
  });

  it('always shows the model among its peers', () => {
    for (const s of found.standings) {
      expect(s.peers.some((p) => p.isSubject)).toBe(true);
      expect(s.peers.find((p) => p.isSubject)!.position).toBe(s.position);
    }
  });

  it('shows the leader, so the scale has an anchor', () => {
    for (const s of found.standings) expect(s.peers[0].position).toBe(1);
  });

  it('shows the neighbours either side, clipped at the ends', () => {
    for (const s of found.standings) {
      const near = s.peers.filter((p) => Math.abs(p.position - s.position) <= 3);
      const expected =
        Math.min(s.total, s.position + 3) - Math.max(1, s.position - 3) + 1;
      expect(near.length).toBe(expected);
    }
  });

  it('lists peers in rank order, never repeating one', () => {
    for (const s of found.standings) {
      const ps = s.peers.map((p) => p.position);
      expect([...ps].sort((a, b) => a - b)).toEqual(ps);
      expect(new Set(ps).size).toBe(ps.length);
    }
  });

  it('never ranks a model past the size of its scope', () => {
    for (const s of found.standings) {
      expect(s.position).toBeGreaterThanOrEqual(1);
      expect(s.position).toBeLessThanOrEqual(s.total);
    }
  });

  it('orders by placement, strongest first', () => {
    const positions = found.standings.map((s) => s.position);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
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
