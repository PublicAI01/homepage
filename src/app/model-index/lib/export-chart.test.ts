import { describe, expect, it } from 'vitest';

import { axisOf, positionLabel } from './export-chart';

describe('axisOf', () => {
  it('brackets the scores a tick either side', () => {
    expect(axisOf([61.2, 66.9])).toEqual({ floor: 50, span: 20 });
  });

  it('is finite with nothing to chart, so the gridline loop ends', () => {
    // Math.min() of an empty list is Infinity; the floor was Infinity and
    // `for (v = floor; v <= floor + span; v += 10)` never terminated.
    const { floor, span } = axisOf([]);
    expect(Number.isFinite(floor)).toBe(true);
    expect(Number.isFinite(span)).toBe(true);
    expect(span).toBeGreaterThan(0);
  });
});

describe('positionLabel', () => {
  it('marks a row placed by reports alone, as the table does', () => {
    expect(positionLabel({ rank: 3, inScope: true })).toBe('3');
    expect(positionLabel({ rank: 3, inScope: false })).toBe('3✱');
    expect(positionLabel({ rank: null, inScope: false })).toBe('—');
  });
});
