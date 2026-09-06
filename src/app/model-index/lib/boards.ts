import type { Benchmark, SourceKind } from '../data/types';

/**
 * A source as the reader sees it: one headline measure and every measure
 * grouped under it. Coverage, badges and citations are per source; weights
 * and domain columns are per measure.
 */
export interface BoardView {
  id: string;
  kind: SourceKind;
  headline: Benchmark;
  measures: Benchmark[];
}

/** Pure; safe to call from server components. */
export function groupBoards(benchmarks: Benchmark[]): BoardView[] {
  const out: BoardView[] = [];
  for (const b of benchmarks) {
    let view = out.find((v) => v.id === b.group);
    if (!view) {
      view = { id: b.group, kind: b.kind, headline: b, measures: [] };
      out.push(view);
    }
    if (b.id === b.group) view.headline = b;
    view.measures.push(b);
  }
  return out;
}
