import { describe, expect, it } from 'vitest';

import { MIN_OVERALL_WEIGHT } from './aggregate';
import { rankModels } from './query';
import { unrankedReason } from './unranked';
import { MIN_SOURCES } from './weights';

describe('unrankedReason', () => {
  it('does not blame the publisher count on a model no Overall board scored', () => {
    // grok-build-0-1 on 2026-11-21: four publishers on domain boards, none
    // of them an Overall board. The page said "Only one publisher has
    // scored it" — a sentence about the index's own method, and false.
    const reason = unrankedReason({ measuredWeight: 0, overallPublishers: 0 });
    expect(reason).not.toMatch(/one publisher/i);
    expect(reason).toMatch(/No board that builds the Overall/);
  });

  it('names the share of the scheme measured when that is what is short', () => {
    expect(
      unrankedReason({ measuredWeight: 0.4, overallPublishers: 2 }),
    ).toMatch(/^40% of the Overall/);
  });

  it('names the publisher count only when that is what is short', () => {
    expect(
      unrankedReason({
        measuredWeight: MIN_OVERALL_WEIGHT,
        overallPublishers: MIN_SOURCES - 1,
      }),
    ).toMatch(/^Only one publisher/);
  });

  it('matches the row on the shipped snapshot', () => {
    const r = rankModels({ limit: 1000, minBoards: 0 });
    if ('error' in r) throw new Error(r.error);
    for (const m of r.models) {
      expect(typeof m.overallPublishers, m.name).toBe('number');
      if (m.rank !== null) continue;
      const reason = unrankedReason(m);
      if (/publisher/.test(reason)) {
        expect(m.overallPublishers, m.name).toBeLessThan(MIN_SOURCES);
        expect(m.measuredWeight, m.name).toBeGreaterThanOrEqual(
          MIN_OVERALL_WEIGHT,
        );
      }
      if (/No board/.test(reason)) expect(m.measuredWeight, m.name).toBe(0);
    }
  });
});
