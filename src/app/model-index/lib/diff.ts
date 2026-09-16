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
  /**
   * New id → the ids it took over from, on the snapshot where a model was
   * renamed or two rows merged. Written by scripts/index-history.ts from
   * what each source printed, which does not change when the naming rules
   * do. Absent on a snapshot with no such change.
   */
  aliases?: Record<string, string[]>;
}

/**
 * Every id that `id` in the later snapshot may have carried in the earlier
 * one: itself, then whatever it was renamed from or absorbed, following the
 * snapshots between. A renamed model lists its new id first (absent back
 * then) and its old one second; a merge lists the survivor and what it took
 * in. Just `[id]` when nothing happened to it.
 */
export function lineage(
  id: string,
  from: HistoryEntry,
  to: HistoryEntry,
  all: HistoryEntry[],
): string[] {
  const between = all
    .filter((e) => e.date > from.date && e.date <= to.date)
    .sort((a, b) => b.date.localeCompare(a.date));
  let current = [id];
  for (const e of between) {
    const next: string[] = [];
    for (const c of current) {
      next.push(c, ...(e.aliases?.[c] ?? []));
    }
    current = [...new Set(next)];
  }
  return current;
}

/**
 * `entries` with `entry` in place of any entry of the same date, oldest
 * first, at most `limit` long.
 *
 * The refresh job rebuilds several times a day, and each run computes its
 * aliases against the snapshot committed before it — on a rerun, that is
 * the same day's earlier snapshot, so the renames the first run recorded
 * against yesterday's are not in the new entry. Replacing the day's entry
 * wholesale dropped them: on 2026-09-15 the first refresh recorded 52
 * renames, three reruns left the entry with none, and the feed then listed
 * 52 models as gone and 39 as new while every old id stopped resolving
 * (2026-09-16). So the replaced entry's aliases are kept, and an old id
 * that was itself renamed earlier the same day is followed through, so the
 * entry reads as one day's renames however many runs made them.
 */
export function appendEntry(
  entries: HistoryEntry[],
  entry: HistoryEntry,
  limit: number,
): HistoryEntry[] {
  const earlier = entries.find((e) => e.date === entry.date)?.aliases;
  const merged = { ...entry };
  if (earlier) {
    const aliases: Record<string, string[]> = {};
    for (const [now, olds] of Object.entries(entry.aliases ?? {}))
      aliases[now] = [
        ...new Set(olds.flatMap((old) => [old, ...(earlier[old] ?? [])])),
      ];
    for (const [now, olds] of Object.entries(earlier))
      aliases[now] = [...new Set([...(aliases[now] ?? []), ...olds])];
    merged.aliases = aliases;
  }
  return [...entries.filter((e) => e.date !== entry.date), merged]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit);
}

export interface Change {
  id: string;
  name: string;
  org: string;
  /** `entered`: first appearance. `ranked`: gained an Overall rank. `unranked`: lost it, back to provisional. `moved`: rank changed by `delta`. `left`: no longer listed. */
  kind: 'entered' | 'ranked' | 'unranked' | 'moved' | 'left';
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
  // A model renamed or merged since `from` is the same model, not one that
  // left and one that arrived: the first Index Weekly listed thirteen "new"
  // models that were renames (2026-09-14). Its earlier row is the primary
  // of its lineage; every id in the lineage is spoken for.
  const spokenFor = new Set<string>();
  for (const [id, now] of Object.entries(to.models)) {
    const before = lineage(id, from, to, all);
    for (const b of before) if (from.models[b]) spokenFor.add(b);
    const was =
      from.models[id] ??
      before.map((b) => from.models[b]).find((m) => m !== undefined);
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
    // The reverse of `ranked`: a board dropping the model can take its rank
    // away, and a feed that reports only gains would hide it (2026-09-10).
    if (now.rank === null && was.rank !== null) {
      models.push({
        id,
        name: now.name,
        org: now.org,
        kind: 'unranked',
        previousRank: was.rank,
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
    if (!to.models[id] && !spokenFor.has(id))
      models.push({ id, name: was.name, org: was.org, kind: 'left' });
  }
  const order = { ranked: 0, unranked: 1, moved: 2, entered: 3, left: 4 };
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
