import { describe, expect, it } from 'vitest';

import { estimateMark, estimateWords } from './estimate';

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
