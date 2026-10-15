import type { Benchmark, SourceKind } from '../data/types';

/**
 * A source as the reader sees it: one headline measure and every measure
 * grouped under it. Coverage, badges and citations are per source; weights
 * and domain columns are per measure.
 */
export interface BoardView {
  id: string;
  kind: SourceKind;
  /** The source's own name: a board's title, or a report's publication title. */
  name: string;
  headline: Benchmark;
  measures: Benchmark[];
  /** The publisher's own mark, captured by the pipeline and served from this site. */
  logo?: string;
}

/** Pure; safe to call from server components. */
/**
 * How a source is named to a reader, from the id the history file records.
 *
 * History stores the group id — "lmarena", "deepseek-v4-1-flash" — because
 * that is what identifies a source across snapshots. Printed raw, the
 * weekly digest and the feed told readers a new source called
 * "deepseek-v4-1-flash" had appeared (2026-09-14). A source that has since
 * been retired is not in the snapshot any more; its id is all there is, so
 * that is what comes back.
 */
export function sourceLabel(benchmarks: Benchmark[], id: string): string {
  const b = benchmarks.find((x) => x.group === id);
  return b ? `${b.source}${b.kind === 'report' ? ' ✱' : ''}` : id;
}

/**
 * The measures on this board that a model was actually scored on.
 *
 * Whether a source measured a model is a question about the source, not
 * about one of its measures: `headline` is only the file's first measure
 * unless the board publishes one whose id is its own, which vals,
 * helm-safety, enkrypt, jevbench, aider and mmmu do not. Read through
 * `headline` alone, the badge strip called Vals "not listed" on the 114
 * models it scored on something other than Legal Research Bench, on rows
 * whose own coverage count included Vals (2026-09-26).
 */
export function figuresOn<T>(
  board: BoardView,
  scored: ReadonlyMap<string, T>,
): Benchmark[] {
  return board.measures.filter((m) => scored.has(m.id));
}

export function groupBoards(benchmarks: Benchmark[]): BoardView[] {
  const out: BoardView[] = [];
  for (const b of benchmarks) {
    let view = out.find((v) => v.id === b.group);
    if (!view) {
      view = {
        id: b.group,
        kind: b.kind,
        name: b.source,
        ...(b.logo ? { logo: b.logo } : {}),
        headline: b,
        measures: [],
      };
      out.push(view);
    }
    if (b.id === b.group) view.headline = b;
    view.measures.push(b);
  }
  return out;
}

/**
 * The recognised boards a scope's figures come from — the count a coverage
 * fraction is "of" — read from the measures that carry weight there, not
 * from every measure filed under the scope.
 *
 * A board can keep a measure on the page with its weight set to zero:
 * LiveBench 1.0's four figures that 2.0 also publishes have been a frozen
 * reference since 2026-10-13 (SUPERSEDED in weights.ts). Counted by kind
 * alone, they made LiveBench 1.0 a fifth board in General intelligence and
 * a second in Code generation and Data analysis — while each row's own
 * coverage, counted from the measures that score it, never saw it. Every
 * one of the 443 standings in those four domains read "3 of 4 boards" or
 * "1 of 2" in amber, warning of a subset that was never averaged
 * (2026-10-15). One rule here, so the denominator and the numerator are
 * the same set of boards wherever a fraction is printed.
 */
export function countingBoards(
  inScope: readonly Benchmark[],
  weights: Record<string, number>,
): Set<string> {
  return new Set(
    inScope
      .filter((b) => b.kind !== 'report' && (weights[b.id] ?? 0) > 0)
      .map((b) => b.group),
  );
}
