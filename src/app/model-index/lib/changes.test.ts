import { describe, expect, it } from 'vitest';

import type { Benchmark } from '../data/types';
import { sourceLabel } from './boards';
import { changesSince, snapshots } from './changes';
import { appendEntry, diff, type HistoryEntry, lineage } from './diff';
import { fallbackBadge } from './weights';

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

describe('diff: losing a rank', () => {
  it('reports a model that drops from ranked to provisional', () => {
    const from = entry('2026-09-01', { x: [4, 60] });
    const to = entry('2026-09-02', { x: [null, 55] });
    const c = diff(from, to, '2026-09-01', 3, [from, to]);
    expect(c.models).toEqual([
      expect.objectContaining({
        id: 'x',
        kind: 'unranked',
        previousRank: 4,
        index: 55,
      }),
    ]);
  });
});

describe('changesSince with an end date', () => {
  it('stops at the snapshot asked for, not at the latest one', () => {
    const dates = snapshots();
    if (dates.length < 3) return;
    const c = changesSince(dates[0], 3, dates[1]);
    expect(c.since).toBe(dates[0]);
    expect(c.until).toBe(dates[1]);
    expect(c.snapshots).toBe(1);
  });
});

describe('sourceLabel', () => {
  const bs = [
    {
      group: 'lmarena',
      source: 'LMArena Text',
      kind: 'board' as const,
    },
    {
      group: 'deepseek-v4-1-flash',
      source: 'DeepSeek — V4.1 Flash model card',
      kind: 'report' as const,
    },
  ] as Benchmark[];

  it('names the source the history file only has an id for', () => {
    // The weekly digest and the feed told readers a new source called
    // "deepseek-v4-1-flash" had appeared.
    expect(sourceLabel(bs, 'lmarena')).toBe('LMArena Text');
    expect(sourceLabel(bs, 'deepseek-v4-1-flash')).toBe(
      'DeepSeek — V4.1 Flash model card ✱',
    );
  });

  it('falls back to the id for a source no longer in the snapshot', () => {
    expect(sourceLabel(bs, 'retired-blog')).toBe('retired-blog');
  });
});

describe('renames and merges', () => {
  // Day 1: "qwen3" and a duplicate "grok-4-20-2" exist. Day 2: the naming
  // rules change — qwen3 is retitled qwen3-max, and grok-4-20-2's figures
  // fold into grok-4-20. Day 3: nothing happens.
  const d1 = entry('2026-09-01', {
    qwen3: [4, 62],
    'grok-4-20': [9, 55],
    'grok-4-20-2': [null, null],
    other: [1, 70],
  });
  const d2: HistoryEntry = {
    ...entry('2026-09-02', {
      'qwen3-max': [4, 62],
      'grok-4-20': [8, 56],
      other: [1, 70],
    }),
    aliases: { 'qwen3-max': ['qwen3'], 'grok-4-20': ['grok-4-20-2'] },
  };
  const d3 = entry('2026-09-03', {
    'qwen3-max': [2, 66],
    'grok-4-20': [8, 56],
    other: [1, 70],
  });
  const all = [d1, d2, d3];

  it('follows a model through its old names', () => {
    expect(lineage('qwen3-max', d1, d3, all)).toEqual(['qwen3-max', 'qwen3']);
    expect(lineage('grok-4-20', d1, d3, all)).toEqual([
      'grok-4-20',
      'grok-4-20-2',
    ]);
    expect(lineage('other', d1, d3, all)).toEqual(['other']);
  });

  it('reports a renamed model as itself, not as one leaving and one arriving', () => {
    const c = diff(d1, d3, '2026-09-01', 1, all);
    const kinds = Object.fromEntries(c.models.map((m) => [m.id, m.kind]));
    // Renamed, and it moved: the move is reported under the new name.
    expect(kinds['qwen3-max']).toBe('moved');
    expect(c.models.find((m) => m.id === 'qwen3-max')?.previousRank).toBe(4);
    // Neither old id "left", and nothing "entered".
    expect(kinds['qwen3']).toBeUndefined();
    expect(kinds['grok-4-20-2']).toBeUndefined();
    expect(c.models.filter((m) => m.kind === 'entered')).toEqual([]);
    expect(c.models.filter((m) => m.kind === 'left')).toEqual([]);
  });

  it('still reports a genuine arrival and a genuine exit', () => {
    const d4 = entry('2026-09-04', {
      'qwen3-max': [2, 66],
      newcomer: [null, null],
      other: [1, 70],
    });
    const c = diff(d1, d4, '2026-09-01', 1, [...all, d4]);
    expect(c.models.find((m) => m.id === 'newcomer')?.kind).toBe('entered');
    expect(c.models.find((m) => m.id === 'grok-4-20')?.kind).toBe('left');
  });
});

describe('appendEntry: a rebuild on the same date', () => {
  // The renames each run computes are relative to the snapshot committed
  // before it. Run 1 of the day renamed a → b against yesterday; run 2 ran
  // against run 1's snapshot and saw b → c. The day's entry must carry both,
  // chained, or a → c reads as one model leaving and another arriving.
  const yesterday = entry('2026-09-14', { a: [1, 70], x: [2, 65] });
  const run1: HistoryEntry = {
    ...entry('2026-09-15', { b: [1, 70], x: [2, 65] }),
    aliases: { b: ['a'] },
  };
  const run2: HistoryEntry = {
    ...entry('2026-09-15', { c: [1, 70], x: [2, 65] }),
    aliases: { c: ['b'] },
  };

  it('keeps the earlier run’s renames and follows them through', () => {
    const entries = appendEntry([yesterday, run1], run2, 120);
    expect(entries.map((e) => e.date)).toEqual(['2026-09-14', '2026-09-15']);
    expect(entries[1].aliases).toEqual({ c: ['b', 'a'], b: ['a'] });
    const c = diff(yesterday, entries[1], '2026-09-14', 3, entries);
    expect(c.models).toEqual([]);
  });

  it('keeps them when the rerun saw no renames of its own', () => {
    const rerun = entry('2026-09-15', { b: [1, 70], x: [2, 65] });
    const entries = appendEntry([yesterday, run1], rerun, 120);
    expect(entries[1].aliases).toEqual({ b: ['a'] });
    expect(entries[1].models).toBe(rerun.models);
  });

  it('orders by date and keeps only the last `limit` entries', () => {
    const entries = appendEntry([run1, yesterday], entry('2026-09-16', {}), 2);
    expect(entries.map((e) => e.date)).toEqual(['2026-09-15', '2026-09-16']);
  });
});

describe('fallbackBadge', () => {
  it('gives a board with no mark its initials, never a question mark', () => {
    expect(fallbackBadge('HELM Safety').code).toBe('HS');
    expect(fallbackBadge('Vectara Hallucination Leaderboard').code).toBe('VH');
    expect(fallbackBadge('Vectara').code).toBe('VE');
    expect(fallbackBadge('').code).not.toBe('?');
  });
});
