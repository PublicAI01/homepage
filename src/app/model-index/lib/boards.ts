import type { Benchmark } from '../data/types';

/**
 * A board as the reader sees it: one headline measure and every measure
 * grouped under it. Coverage, badges and citations are per board; weights
 * and domain columns are per measure.
 */
export interface BoardView {
  id: string;
  headline: Benchmark;
  measures: Benchmark[];
}

/** Pure; safe to call from server components. */
export function groupBoards(benchmarks: Benchmark[]): BoardView[] {
  const out: BoardView[] = [];
  for (const b of benchmarks) {
    const id = b.group ?? b.id;
    let view = out.find((v) => v.id === id);
    if (!view) {
      view = { id, headline: b, measures: [] };
      out.push(view);
    }
    if (b.id === id) view.headline = b;
    view.measures.push(b);
  }
  return out;
}
