import { describe, expect, it } from 'vitest';

import { diff, type HistoryEntry } from './diff';

const entry = (
  date: string,
  models: Record<string, [number | null, number | null]>,
  sources = ['a', 'b'],
): HistoryEntry => ({
  date,
  generatedAt: `${date}T06:00:00.000Z`,
  sources,
  models: Object.fromEntries(
    Object.entries(models).map(([id, [rank, index]]) => [
      id,
      { name: id.toUpperCase(), org: 'o', rank, index, covered: 2 },
    ]),
  ),
});

describe('diff', () => {
  const from = entry('2026-09-01', {
    x: [1, 70],
    y: [2, 65],
    z: [null, null],
    w: [5, 60],
  });
  const to = entry(
    '2026-09-08',
    { x: [1, 71], y: [6, 60], z: [3, 64], v: [null, null] },
    ['a', 'b', 'c'],
  );

  it('reports entries, exits, rank gains and moves of at least minDelta', () => {
    const c = diff(from, to, '2026-09-01', 3, [from, to]);
    expect(c.newSources).toEqual(['c']);
    expect(c.models.map((m) => [m.id, m.kind])).toEqual([
      ['z', 'ranked'],
      ['y', 'moved'],
      ['v', 'entered'],
      ['w', 'left'],
    ]);
    const y = c.models.find((m) => m.id === 'y')!;
    expect(y).toMatchObject({ rank: 6, previousRank: 2, delta: -4 });
    expect(c.snapshots).toBe(1);
  });

  it('says so when there is nothing earlier to compare against', () => {
    const c = diff(to, to, '2026-09-08', 3, [to]);
    expect(c.models).toEqual([]);
    expect(c.note).toMatch(/History begins/);
  });
});
