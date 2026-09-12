import history from '../data/history.json';
import { diff, type HistoryEntry } from './diff';

export type { Change, Changes, HistoryEntry } from './diff';
export { diff } from './diff';

/**
 * The change feed over the history file the refresh job appends to. Agents
 * poll this; the RSS feed and the weekly digest are views of the same diff.
 */
// Through `unknown`: TypeScript types the JSON import literally, and once
// the snapshots disagree on which model ids exist (a rename, 2026-09-11)
// the literal type no longer "sufficiently overlaps" HistoryEntry[] and
// the build fails on a data change.
const entries = (history as unknown as { entries: HistoryEntry[] }).entries;

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

/**
 * Models that first appeared in the last `days`, newest snapshot first.
 *
 * The page carries this because a new model arriving is silent otherwise: it
 * lands wherever its score puts it, and unless you already knew its name and
 * searched for it, you would never see it. `from` is the snapshot actually
 * compared against, not the requested cutoff — the history only goes back as
 * far as it goes, and saying otherwise would overstate the window.
 */
export function enteredSince(days = 7) {
  const to = latest();
  if (!to) return { from: '', until: '', models: [] };
  const cutoff = new Date(
    Date.parse(`${to.date}T00:00:00Z`) - days * 86_400_000,
  )
    .toISOString()
    .slice(0, 10);
  const from = snapshotAt(cutoff);
  return {
    from: from?.date ?? to.date,
    until: to.date,
    models: diff(from, to, cutoff, 3, entries).models.filter(
      (m) => m.kind === 'entered',
    ),
  };
}
