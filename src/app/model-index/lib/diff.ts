/**
 * What changed between two snapshots. Pure: no data import, so the digest
 * script can use it under plain Node as well as the page.
 */
/**
 * A snapshot date as every outlet must be given it: YYYY-MM-DD. Snapshots
 * are compared as strings, so anything else does not fail, it answers
 * wrongly — "last week" sorts after every snapshot and reads as "nothing
 * changed", "01-09-2026" sorts before them all and returns the whole
 * history. The API checked this by hand from 2026-09-20 and the MCP tool
 * took any string (2026-10-03); one pattern, so they cannot differ again.
 */
export const SNAPSHOT_DATE = /^\d{4}-\d\d-\d\d$/;

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
  /**
   * New source id → the ids that appeared on this snapshot only because
   * that source was added: every figure they carry is from a source absent
   * the day before. Written by scripts/index-history.ts. Absent on a
   * snapshot that added no source, or whose new source listed nothing the
   * index did not already have.
   */
  broughtBy?: Record<string, string[]>;
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
 * Follows an id forward through the recorded renames to the one it is
 * listed under now. Built once from the history, oldest entry first.
 *
 * A name that is changed and then changed back leaves both directions on
 * record: motif-3 → motif-3-beta on 2026-09-27, motif-3-beta → motif-3 on
 * 2026-09-30. Kept side by side they are a loop, the walk went round it
 * and stopped where it started, and the three-day-old id answered "no such
 * model" for a model on the list (2026-10-05). So an id that a later
 * snapshot renames *to* is alive again as of that snapshot and its own
 * earlier forwarding is dropped.
 *
 * An id that one snapshot hands to two models is a split, not a rename
 * (qwen3-vl-235b-a22b became -thinking and -instruct on 2026-09-19). It
 * is forwarded to neither: picking one would show that model's rank and
 * score under a name that meant the other as well, and a number that may
 * belong to someone else is worse than "not listed".
 */
export function aliasResolver(entries: HistoryEntry[]) {
  const forward = new Map<string, string>();
  for (const e of entries) {
    const targets = new Map<string, Set<string>>();
    for (const [now, olds] of Object.entries(e.aliases ?? {})) {
      forward.delete(now);
      for (const old of olds)
        if (old !== now)
          targets.set(old, (targets.get(old) ?? new Set()).add(now));
    }
    for (const [old, nows] of targets)
      if (nows.size === 1) forward.set(old, [...nows][0]);
      else forward.delete(old);
  }
  return (id: string): string => {
    let cur = id;
    // A chain, not a loop: an id renamed twice resolves twice. `seen` so a
    // malformed history cannot spin.
    const seen = new Set([cur]);
    for (;;) {
      const next = forward.get(cur);
      if (next === undefined || seen.has(next)) break;
      seen.add(next);
      cur = next;
    }
    return cur;
  };
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
  const same = entries.find((e) => e.date === entry.date);
  const earlier = same?.aliases;
  const merged = { ...entry };
  // Likewise what a new source brought: the rerun compares against the
  // day's earlier snapshot, where the source already is, and sees nothing.
  if (same?.broughtBy) {
    const broughtBy: Record<string, string[]> = { ...same.broughtBy };
    for (const [src, ids] of Object.entries(entry.broughtBy ?? {}))
      broughtBy[src] = [...new Set([...(broughtBy[src] ?? []), ...ids])];
    merged.broughtBy = broughtBy;
  }
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

/**
 * Models whose every figure comes from one of `sources` — a source's back
 * catalogue, not new models.
 *
 * `via` on a change is written by the refresh that first read a source, so
 * it marks only the models on the board the day it arrived. The rows a
 * board itself adds over the following days carry no `via`, and each outlet
 * that read `entered && !via` as "new model" announced them: JevBench was
 * indexed on 2026-09-23, and by 2026-09-27 the page's "New this week" named
 * 22 models of which 11 — Cygnet, Malkuth 2B, Standard One 8B and the rest
 * — had no figure anywhere but on it. The digest had corrected this for
 * itself two days earlier; one rule here, so the page and the mail cannot
 * disagree about what is new again (2026-09-27).
 *
 * Pure: takes the snapshot's scores and benchmarks, so the digest script
 * can call it under plain Node.
 */
export function backlogOf(
  sources: readonly string[],
  scores: readonly { modelId: string; benchmarkId: string }[],
  benchmarks: readonly { id: string; group: string }[],
): Set<string> {
  const out = new Set<string>();
  if (sources.length === 0) return out;
  const fresh = new Set(sources);
  const groupOf = new Map(benchmarks.map((b) => [b.id, b.group]));
  // A model is backlog only if it has figures and all of them are fresh:
  // one figure on an older board is the older board's word that it exists.
  const seen = new Map<string, boolean>();
  for (const s of scores) {
    const g = groupOf.get(s.benchmarkId);
    if (g === undefined) continue;
    seen.set(s.modelId, (seen.get(s.modelId) ?? true) && fresh.has(g));
  }
  for (const [id, allFresh] of seen) if (allFresh) out.add(id);
  return out;
}

export interface Change {
  id: string;
  name: string;
  org: string;
  /** `entered`: first appearance. `ranked`: gained an Overall rank. `unranked`: lost it, back to provisional. `moved`: rank changed by `delta`. `left`: no longer listed. */
  kind: 'entered' | 'ranked' | 'unranked' | 'moved' | 'left';
  /**
   * On `entered`: the source whose arrival listed this model, when every
   * figure it carries is from a source added since `from`. A board joining
   * with its whole back catalogue is one piece of news, not one per model —
   * three safety boards listed 170 "new" models in a day, and the page said
   * so for a week (2026-09-16). Readers filter on this; the count stays in
   * the feed under the source.
   */
  via?: string;
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
  const via = new Map<string, string>();
  for (const e of all)
    if (e.date > from.date && e.date <= to.date)
      for (const [src, ids] of Object.entries(e.broughtBy ?? {}))
        for (const bid of ids) via.set(bid, src);
  for (const [id, now] of Object.entries(to.models)) {
    const before = lineage(id, from, to, all);
    for (const b of before) if (from.models[b]) spokenFor.add(b);
    const was =
      from.models[id] ??
      before.map((b) => from.models[b]).find((m) => m !== undefined);
    if (!was) {
      // The record names the id the model carried when the source brought
      // it; renamed since, it is looked up under every id in its lineage —
      // or the page counted a renamed arrival as a new model (2026-09-20).
      const src = before.map((b) => via.get(b)).find((v) => v !== undefined);
      models.push({
        id,
        ...now,
        kind: 'entered',
        ...(src ? { via: src } : {}),
      });
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
  // Whether anyone alive in `to` spoke for it, or — when a model that
  // absorbed it has itself since left — whether it is in that model's
  // lineage: B merged into A on day 2 and A left on day 3 read as two
  // departures (2026-09-20).
  const absorbed = new Set<string>();
  for (const e of all)
    if (e.date > from.date && e.date <= to.date)
      for (const olds of Object.values(e.aliases ?? {}))
        for (const old of olds) absorbed.add(old);
  for (const [id, was] of Object.entries(from.models)) {
    if (!to.models[id] && !spokenFor.has(id) && !absorbed.has(id))
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
