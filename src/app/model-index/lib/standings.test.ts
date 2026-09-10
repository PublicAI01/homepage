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
      expect(me?.position).toBe(s.position);
      expect(r.total).toBe(s.total);
      expect(me?.scopeScore).toBe(s.score);
    }
  });

  it('always shows the model among its peers, even when it sits below the head', () => {
    for (const s of found.standings) {
      expect(s.peers.some((p) => p.isSubject)).toBe(true);
      const subject = s.peers.find((p) => p.isSubject)!;
      expect(subject.position).toBe(s.position);
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
