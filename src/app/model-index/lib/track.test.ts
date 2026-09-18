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
  category: 'General',
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
