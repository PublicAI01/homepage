/**
 * How an estimate ✱-free figure is marked, everywhere one is printed.
 *
 * ✱ means a report — a launch post, a blog — and nothing else (2026-09-16).
 * An estimate is anchored on board figures and is not a report, so it wears
 * its own marks: `~` for a point, `≤` for a ceiling (the model trailed every
 * anchor), `≥` for a floor (it led every anchor). The table and the model
 * card did this; the social card printed `*` — the report mark — and the
 * badge and model page printed a ceiling or floor as a point (2026-09-21).
 * One function, so the outlets cannot drift again.
 */
export type EstimateBound = 'below' | 'above' | null;

/** `≤` / `≥` / `~`, or `<=` / `>=` / `~` where only Latin-1 glyphs render. */
export function estimateMark(bound: EstimateBound, ascii = false): string {
  if (bound === 'below') return ascii ? '<=' : '≤';
  if (bound === 'above') return ascii ? '>=' : '≥';
  return '~';
}

/**
 * The figure as every outlet prints it: the mark, the score to one
 * decimal, and ✱ after it when every anchor was a report — "~46.7✱".
 *
 * ✱ still means a report and nothing else: here it says the comparison
 * set the figure was placed in is one a publication printed, not a board
 * that ran the model. Without it, a rival's launch post read as a board
 * placement on the badge, the card and the API (2026-11-05).
 */
export function estimateLabel(
  estimate: { score: number; bound: EstimateBound; fromReports?: boolean },
  ascii = false,
): string {
  return `${estimateMark(estimate.bound, ascii)}${estimate.score.toFixed(1)}${
    estimate.fromReports ? (ascii ? '*' : '✱') : ''
  }`;
}

/** The same in prose: "at most 51.5", "at least 60.2", "about 55.0". */
export function estimateWords(bound: EstimateBound): string {
  if (bound === 'below') return 'at most';
  if (bound === 'above') return 'at least';
  return 'about';
}

/**
 * Where an estimate would stand among the ranked models: one plus the number
 * of ranked scores above it, compared at the one decimal that is printed. An
 * approximation, so it is only ever printed with `~`, and it takes no place
 * in the numbering: the ranked rows keep the numbers they have.
 */
export function estimatedPosition(
  score: number,
  rankedScores: number[],
): number {
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return 1 + rankedScores.filter((s) => r1(s) > r1(score)).length;
}
