import { describe, expect, it } from 'vitest';

import { estimatedPosition, estimateMark, estimateWords } from './estimate';

describe('estimateMark', () => {
  it('never uses the report mark, and keeps the bound', () => {
    expect(estimateMark(null)).toBe('~');
    expect(estimateMark('below')).toBe('≤');
    expect(estimateMark('above')).toBe('≥');
    // The social card renders Latin-1 only.
    expect(estimateMark(null, true)).toBe('~');
    expect(estimateMark('below', true)).toBe('<=');
    expect(estimateMark('above', true)).toBe('>=');
    for (const b of [null, 'below', 'above'] as const)
      for (const ascii of [false, true])
        expect(estimateMark(b, ascii)).not.toContain('*');
  });

  it('says the same in words', () => {
    expect(estimateWords(null)).toBe('about');
    expect(estimateWords('below')).toBe('at most');
    expect(estimateWords('above')).toBe('at least');
  });
});

describe('estimatedPosition', () => {
  it('is one plus the ranked scores above it, at the printed decimal', () => {
    const ranked = [69.6, 65.5, 62.9, 62.9, 62.34, 60];
    expect(estimatedPosition(62.7, ranked)).toBe(5);
    expect(estimatedPosition(62.9, ranked)).toBe(3);
    expect(estimatedPosition(70, ranked)).toBe(1);
    expect(estimatedPosition(10, ranked)).toBe(7);
  });
});
