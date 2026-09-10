import history from '../data/history.json';
import { diff, type HistoryEntry } from './diff';

export type { Change, Changes, HistoryEntry } from './diff';
export { diff } from './diff';

/**
 * The change feed over the history file the refresh job appends to. Agents
 * poll this; the RSS feed and the weekly digest are views of the same diff.
 */
const entries = (history as { entries: HistoryEntry[] }).entries;

export const snapshots = () => entries.map((e) => e.date);
export const latest = () => entries[entries.length - 1];

/** The last snapshot on or before `date`, or the earliest one when none is. */
export function snapshotAt(date: string): HistoryEntry | undefined {
  const before = entries.filter((e) => e.date <= date);
  return before[before.length - 1] ?? entries[0];
}

/**
 * Changes from the snapshot at `since` to the one at `until` (default: the
 * latest). The feed passes `until` so each item covers one day, not the
 * whole stretch to today (2026-09-10).
 */
export function changesSince(since: string, minDelta = 3, until?: string) {
  const to = until === undefined ? latest() : snapshotAt(until);
  return diff(snapshotAt(since), to, since, minDelta, entries);
}
