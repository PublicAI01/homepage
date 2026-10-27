import { describe, expect, it } from 'vitest';

import type { Benchmark, IndexData } from '../data/types';
import { createTrack } from './track';
import type { Weighting } from './weights';

/**
 * A track must rank on the weighting it was given. Built with the default
 * weighting instead, every board fell to the flat board-measure share and
 * the video Overall read 25/25/25 while the page said 40/40/20 (2026-09-18).
 */
const board = (id: string, publisher: string): Benchmark => ({
  id,
  name: id,
  publisher,
  url: `https://example.com/${id}`,
  retrievedAt: '2026-09-18',
  metric: 'percent',
  category: 'Core abilities',
  domain: 'General',
  kind: 'board',
  source: id,
  group: id,
});

const data: IndexData = {
  generatedAt: '2026-09-18T00:00:00Z',
  benchmarks: [board('a', 'Publisher A'), board('b', 'Publisher B')],
  models: ['m1', 'm2', 'm3'].map((id) => ({ id, name: id, org: 'Org' })),
  // m1 leads on a and trails on b; m3 the reverse; m2 is average on both.
  scores: [
    { modelId: 'm1', benchmarkId: 'a', raw: 90, sourceLabel: 'm1' },
    { modelId: 'm2', benchmarkId: 'a', raw: 50, sourceLabel: 'm2' },
    { modelId: 'm3', benchmarkId: 'a', raw: 10, sourceLabel: 'm3' },
    { modelId: 'm1', benchmarkId: 'b', raw: 10, sourceLabel: 'm1' },
    { modelId: 'm2', benchmarkId: 'b', raw: 50, sourceLabel: 'm2' },
    { modelId: 'm3', benchmarkId: 'b', raw: 90, sourceLabel: 'm3' },
  ],
  excluded: [],
  catalogs: [],
};

const weighting = (a: number, b: number): Weighting[] => [
  { benchmarkId: 'a', weight: a, rationale: '' },
  { benchmarkId: 'b', weight: b, rationale: '' },
];

const indexOf = (track: ReturnType<typeof createTrack>, id: string) => {
  const found = track.getModel(id);
  if ('error' in found && found.error) throw new Error(found.error);
  return found.model!.index!;
};

describe('createTrack', () => {
  it('ranks on the weighting it was given, not the text default', () => {
    const url = 'https://publicai.io/model-index/x';
    const heavyA = createTrack({ data, weighting: weighting(90, 10), url });
    const heavyB = createTrack({ data, weighting: weighting(10, 90), url });
    // Under the default weighting both tracks weigh a and b equally and m1
    // and m3 tie; under their own, the board with the 90 share decides.
    expect(indexOf(heavyA, 'm1')).toBeGreaterThan(indexOf(heavyA, 'm3'));
    expect(indexOf(heavyB, 'm3')).toBeGreaterThan(indexOf(heavyB, 'm1'));
    expect(indexOf(heavyA, 'm1')).toBeGreaterThan(indexOf(heavyB, 'm1'));
  });
});

describe('getModel', () => {
  const track = createTrack({
    data: {
      ...data,
      models: [...data.models, { id: 'jevone', name: 'JevOne', org: 'Org' }],
    },
    weighting: weighting(50, 50),
    url: 'https://publicai.io/model-index/x',
  });

  it('searches by a fragment of a name, and says which model it found', () => {
    const found = track.getModel('von');
    expect(found.model?.id).toBe('jevone');
  });

  it('does not take a fragment for the model when the caller named one', () => {
    // A delisted id that happened to sit inside another model's name kept
    // its badge and its page, with that model's numbers (2026-10-06).
    const near = track.getModel('von', { exact: true });
    expect(near.model).toBeUndefined();
    expect(near.candidates?.map((c) => c.id)).toEqual(['jevone']);
    expect('error' in track.modelStandings('von')).toBe(true);
    for (const named of ['jevone', 'JevOne', 'Org JevOne'])
      expect(track.getModel(named, { exact: true }).model?.id).toBe('jevone');
  });
});

describe('boards in a scope', () => {
  // A frozen measure: its id is in SUPERSEDED, so weightFor gives it 0 and
  // nothing it scores shapes a column. Counted by kind alone it was still a
  // board "measuring" the domain, and every row read "1 of 2 boards" in
  // amber for a subset that was never averaged (2026-10-15).
  const frozen: Benchmark = {
    ...board('livebench-v1-coding', 'LiveBench'),
    group: 'livebench-v1',
  };
  const track = createTrack({
    data: {
      ...data,
      benchmarks: [board('a', 'Publisher A'), frozen],
      scores: data.scores.map((s) =>
        s.benchmarkId === 'b' ? { ...s, benchmarkId: frozen.id } : s,
      ),
    },
    weighting: weighting(100, 0),
    url: 'https://publicai.io/model-index/x',
  });

  it('counts only the boards whose measures carry weight there', () => {
    const r = track.rankModels({ scope: 'domain:General', minBoards: 0 });
    if ('error' in r) throw new Error(r.error);
    expect(r.scopeBoards).toBe(1);
    const found = track.modelStandings('m1');
    if ('error' in found) throw new Error(found.error);
    const s = found.standings.find((x) => x.level === 'domain');
    expect(s?.boards).toBe(1);
    expect(s?.coveredBoards).toBe(1);
  });
});

describe('tied scores', () => {
  // m2 and m3 carry the same figure on every board, so their Overall and
  // their domain score are equal to the last digit. Numbered down the
  // sorted list they read #2 and #3, the order decided by the snapshot's
  // file order, and the page said one finished ahead of the other
  // (2026-10-27).
  const tied = createTrack({
    data: {
      ...data,
      models: ['m1', 'm2', 'm3', 'm4'].map((id) => ({
        id,
        name: id,
        org: 'Org',
      })),
      scores: (['a', 'b'] as const).flatMap((benchmarkId) => [
        { modelId: 'm1', benchmarkId, raw: 90, sourceLabel: 'm1' },
        { modelId: 'm2', benchmarkId, raw: 50, sourceLabel: 'm2' },
        { modelId: 'm3', benchmarkId, raw: 50, sourceLabel: 'm3' },
        { modelId: 'm4', benchmarkId, raw: 10, sourceLabel: 'm4' },
      ]),
    },
    weighting: weighting(50, 50),
    url: 'https://publicai.io/model-index/x',
  });
  const positions = (scope: string) => {
    const r = tied.rankModels({ scope, minBoards: 0 });
    if ('error' in r) throw new Error(r.error);
    return Object.fromEntries(r.models.map((m) => [m.id, m.position]));
  };

  it('shares the place Overall and skips the one the tie took', () => {
    expect(positions('overall')).toEqual({ m1: 1, m2: 2, m3: 2, m4: 4 });
    expect(tied.getModel('m3').model?.rank).toBe(2);
  });

  it('shares the place in a domain, and the total still counts every row', () => {
    expect(positions('domain:General')).toEqual({ m1: 1, m2: 2, m3: 2, m4: 4 });
    expect(tied.scopeTotal(tied.resolveScope('General')!)).toBe(4);
  });

  it('counts a tie as neither ahead nor behind among the rivals', () => {
    const found = tied.modelStandings('m3');
    if ('error' in found) throw new Error(found.error);
    const s = found.standings.find((x) => x.level === 'domain');
    expect(s?.position).toBe(2);
    expect(s?.peers.find((p) => p.id === 'm2')?.position).toBe(2);
    const byId = Object.fromEntries(found.rivals.map((r) => [r.id, r]));
    expect(byId.m2).toBeUndefined();
    expect(byId.m1).toMatchObject({ ahead: byId.m1.met });
    expect(byId.m4).toMatchObject({ ahead: 0 });
  });
});
