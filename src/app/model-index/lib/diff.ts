/**
 * What changed between two snapshots. Pure: no data import, so the digest
 * script can use it under plain Node as well as the page.
 */
export interface HistoryEntry {
  date: string;
  generatedAt: string;
  sources: string[];
  models: Record<
    string,
    {
      name: string;
      org: string;
      index: number | null;
      rank: number | null;
      covered: number;
    }
  >;
}

export interface Change {
  id: string;
  name: string;
  org: string;
  /** `entered`: first appearance. `ranked`: gained an Overall rank. `moved`: rank changed by `delta`. `left`: no longer listed. */
  kind: 'entered' | 'ranked' | 'moved' | 'left';
  rank?: number | null;
  previousRank?: number | null;
  delta?: number;
  index?: number | null;
}

export interface Changes {
  since: string;
  until: string;
  snapshots: number;
  newSources: string[];
  removedSources: string[];
  models: Change[];
  note: string;
}

/** Pure: the change list between two entries. */
export function diff(
  from: HistoryEntry | undefined,
  to: HistoryEntry | undefined,
  since: string,
  minDelta: number,
  all: HistoryEntry[],
): Changes {
  if (!from || !to || from.date === to.date) {
    return {
      since,
      until: to?.date ?? since,
      snapshots: all.length,
      newSources: [],
      removedSources: [],
      models: [],
      note:
        all.length < 2
          ? 'History begins with this snapshot; there is nothing earlier to compare against yet.'
          : 'No snapshot after the date given.',
    };
  }
  const models: Change[] = [];
  for (const [id, now] of Object.entries(to.models)) {
    const was = from.models[id];
    if (!was) {
      models.push({ id, ...now, kind: 'entered' });
      continue;
    }
    if (now.rank !== null && was.rank === null) {
      models.push({
        id,
        name: now.name,
        org: now.org,
        kind: 'ranked',
        rank: now.rank,
        index: now.index,
      });
      continue;
    }
    if (
      now.rank !== null &&
      was.rank !== null &&
      Math.abs(now.rank - was.rank) >= minDelta
    ) {
      models.push({
        id,
        name: now.name,
        org: now.org,
        kind: 'moved',
        rank: now.rank,
        previousRank: was.rank,
        delta: was.rank - now.rank,
        index: now.index,
      });
    }
  }
  for (const [id, was] of Object.entries(from.models)) {
    if (!to.models[id])
      models.push({ id, name: was.name, org: was.org, kind: 'left' });
  }
  const order = { ranked: 0, moved: 1, entered: 2, left: 3 };
  models.sort(
    (a, b) =>
      order[a.kind] - order[b.kind] ||
      Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0) ||
      (a.rank ?? 1e9) - (b.rank ?? 1e9),
  );
  return {
    since: from.date,
    until: to.date,
    snapshots: all.filter((e) => e.date > from.date && e.date <= to.date)
      .length,
    newSources: to.sources.filter((s) => !from.sources.includes(s)),
    removedSources: from.sources.filter((s) => !to.sources.includes(s)),
    models,
    note: `Moves of ${minDelta} places or more in the Overall ranking; entries and exits of the listing; sources added or removed. Positions within categories and domains are not tracked here.`,
  };
}
