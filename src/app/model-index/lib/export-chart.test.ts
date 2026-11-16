import { describe, expect, it } from 'vitest';

import { placeRows } from './aggregate';
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
  it('numbers a row a board placed', () => {
    expect(positionLabel({ rank: 3, inScope: true })).toBe('3');
    expect(positionLabel({ rank: null, inScope: true })).toBe('—');
  });

  it('marks a row placed by reports alone, as the table does', () => {
    // The combination the table actually produces: placeRows numbers only
    // the rows a board measured, so a report-only row always arrives with
    // rank null. Checked on `rank` first, it printed a bare "—" and the ✱
    // never reached the PNG (2026-11-16).
    expect(positionLabel({ rank: null, inScope: false })).toBe('—✱');
    // A rank on a row no board placed cannot happen; the mark still wins.
    expect(positionLabel({ rank: 3, inScope: false })).toBe('—✱');
  });

  it('agrees with placeRows on which rows take a number', () => {
    const rows = [
      { id: 'a', score: 70, board: true },
      { id: 'b', score: 65, board: false },
      { id: 'c', score: 60, board: true },
    ];
    const positions = placeRows(
      rows,
      (r) => r.score,
      (r) => r.board,
      (r) => r.id,
    );
    const labels = rows.map((r) =>
      positionLabel({ rank: positions.get(r.id) ?? null, inScope: r.board }),
    );
    expect(labels).toEqual(['1', '—✱', '2']);
  });
});
