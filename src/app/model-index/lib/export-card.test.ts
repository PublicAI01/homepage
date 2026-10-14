import { describe, expect, it } from 'vitest';

import { bestDomains, fit } from './export-card';

const s = (
  level: 'category' | 'domain',
  position: number | null,
  score: number,
) => ({ level, position, score });

describe('bestDomains', () => {
  it('keeps board-placed domains, best place first, and leaves categories out', () => {
    const rows = [
      s('category', 1, 70),
      s('domain', 4, 60),
      s('domain', null, 65),
      s('domain', 1, 66),
      s('domain', 1, 68),
    ];
    expect(bestDomains(rows)).toEqual([
      s('domain', 1, 68),
      s('domain', 1, 66),
      s('domain', 4, 60),
    ]);
  });

  it('stops at the row count the card has room for', () => {
    const rows = Array.from({ length: 12 }, (_, i) => s('domain', i + 1, 60));
    expect(bestDomains(rows)).toHaveLength(8);
    expect(bestDomains(rows, 3)).toHaveLength(3);
  });
});

describe('fit', () => {
  // Ten units per character per size unit, a stand-in for measureText.
  const measure = (t: string, size: number) => t.length * size * 0.5;

  it('keeps the starting size when the text fits', () => {
    expect(fit(measure, 'Muse Wonder', 1000, 88, 48)).toEqual({
      text: 'Muse Wonder',
      size: 88,
    });
  });

  it('steps the size down until the text fits', () => {
    const r = fit(measure, 'Claude Opus 4.6 Thinking 128k', 800, 88, 48);
    expect(r.size).toBeLessThan(88);
    expect(r.size).toBeGreaterThanOrEqual(48);
    expect(measure(r.text, r.size)).toBeLessThanOrEqual(800);
  });

  it('cuts with an ellipsis rather than shrinking below the floor', () => {
    const r = fit(
      measure,
      'A name that is far too long for the line',
      200,
      30,
      30,
    );
    expect(r.size).toBe(30);
    expect(r.text.endsWith('…')).toBe(true);
    expect(measure(r.text, 30)).toBeLessThanOrEqual(200);
  });
});
