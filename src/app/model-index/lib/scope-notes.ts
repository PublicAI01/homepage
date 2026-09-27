/**
 * What a category's number leaves out, in the reader's own words.
 *
 * A column can be correctly computed and still be read for the wrong
 * question. Decisions is the case that made this necessary: the index takes
 * JevBench's accuracy and calibration axes and not its speed and price ones,
 * because price belongs to a contract rather than to a model. The arithmetic
 * is right and the effect is that large API models lead a column whose whole
 * subject is what you would run instead of one (Steven asked why GPT-6 Luna
 * was on a routing board at all, which is the question every reader of that
 * column will have, 2026-09-26).
 *
 * Only for a scope where the answer is not on the page already. Most
 * categories need nothing here, and a note on every one of them is a note
 * nobody reads.
 */
export const SCOPE_NOTES: Record<string, string> = {
  Decisions:
    'Accuracy and calibration only. JevBench also ranks speed and price, which this index does not read as capability, so a large API model can lead this column at a cost a router would not pay.',
  Safety:
    'These figures stand on their own. They never enter the Overall index and never anchor an estimate for a model measured nowhere else, because a low risk rate is not evidence of capability.',
};

/** The note for a category or a domain inside one; nothing for Overall. */
export function scopeNote(scope: {
  level: string;
  category?: string;
}): string | undefined {
  if (scope.level === 'overall' || !scope.category) return undefined;
  return SCOPE_NOTES[scope.category];
}
