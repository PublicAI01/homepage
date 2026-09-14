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

export function groupBoards(benchmarks: Benchmark[]): BoardView[] {
  const out: BoardView[] = [];
  for (const b of benchmarks) {
    let view = out.find((v) => v.id === b.group);
    if (!view) {
      view = {
        id: b.group,
        kind: b.kind,
        name: b.source,
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
