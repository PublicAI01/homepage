import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { aggregate } from '../src/app/model-index/lib/aggregate.ts';
import {
  appendEntry,
  type HistoryEntry,
} from '../src/app/model-index/lib/diff.ts';
import {
  MIN_SOURCES,
  OVERALL,
  PRIOR_FRACTION,
  weightsFor,
} from '../src/app/model-index/lib/weights.ts';

/**
 * Append today's snapshot to history.json — the compact record the change
 * feed, the RSS feed and the weekly digest read. Run by the refresh job
 * after the new index.json is in place:
 *
 *   node scripts/index-history.ts
 *
 * The Overall index and rank are computed here with the page's own
 * aggregate, so history and page never disagree. One entry per snapshot
 * date; a rebuild on the same date replaces that date's entry, keeping the
 * renames the earlier build recorded.
 */
const DIR = join(process.cwd(), 'src', 'app', 'model-index', 'data');
const LIMIT = 120;

interface Snapshot {
  models: { id: string }[];
  benchmarks: { id: string; group: string }[];
  scores: { modelId: string; benchmarkId: string; sourceLabel: string }[];
}

/**
 * Which of yesterday's ids each of today's models took over from.
 *
 * A model's id is its display name, slugged, and the name can change when
 * the naming rules do — "Qwen3" became "Qwen3 Max", two Grok rows became
 * one. To the change feed that looked like one model leaving and another
 * arriving; the first Index Weekly listed thirteen "new" models that were
 * renames (2026-09-14). What does not change with our rules is what each
 * source printed: every score carries the source's own label, and that
 * label pointed at some id yesterday. A new id whose figures yesterday sat
 * under an id that no longer exists is that id, renamed — or two of them,
 * merged.
 */
function aliasesFrom(previous: Snapshot | null, next: Snapshot) {
  if (!previous) return {};
  const key = (s: Snapshot['scores'][number]) =>
    `${s.benchmarkId}\u0000${s.sourceLabel}`;
  const wasAt = new Map(previous.scores.map((s) => [key(s), s.modelId]));
  const stillHere = new Set(next.models.map((m) => m.id));
  const took = new Map<string, Map<string, number>>();
  for (const s of next.scores) {
    const old = wasAt.get(key(s));
    if (old === undefined || old === s.modelId || stillHere.has(old)) continue;
    const m = took.get(s.modelId) ?? new Map<string, number>();
    m.set(old, (m.get(old) ?? 0) + 1);
    took.set(s.modelId, m);
  }
  const out: Record<string, string[]> = {};
  for (const [id, olds] of took)
    // Most figures first: for a merge, that is the row that named it.
    out[id] = [...olds.entries()].sort((a, b) => b[1] - a[1]).map(([o]) => o);
  return out;
}

/**
 * Which of today's models each newly added source brought with it.
 *
 * A board joins with its whole back catalogue. Three safety boards added
 * on 2026-09-15 listed 170 models the index had not carried, and to the
 * change feed each was a model that "entered" — the page then said
 * "200+ new" for a week, as if that many had been released (2026-09-16).
 * A model whose every figure is from a source absent yesterday is here
 * because of the source, and is recorded under it so the feed can say
 * "HELM Safety, with 60 models" once, rather than 60 times. A model that
 * an existing board also lists is genuinely new to the index and is not
 * recorded here.
 */
function broughtByFrom(
  previous: Snapshot | null,
  next: Snapshot,
  aliases: Record<string, string[]>,
) {
  if (!previous) return {};
  const before = new Set(previous.benchmarks.map((b) => b.group));
  const groupOf = new Map(next.benchmarks.map((b) => [b.id, b.group]));
  const added = [...new Set(next.benchmarks.map((b) => b.group))].filter(
    (g) => !before.has(g),
  );
  if (!added.length) return {};
  const known = new Set(previous.models.map((m) => m.id));
  const on = new Map<string, Map<string, number>>();
  for (const s of next.scores) {
    const m = on.get(s.modelId) ?? new Map<string, number>();
    const g = groupOf.get(s.benchmarkId) ?? '';
    m.set(g, (m.get(g) ?? 0) + 1);
    on.set(s.modelId, m);
  }
  const out: Record<string, string[]> = {};
  for (const m of next.models) {
    if (known.has(m.id) || aliases[m.id]) continue;
    const groups = on.get(m.id);
    if (!groups || [...groups.keys()].some((g) => before.has(g))) continue;
    // Under the new source with most of its figures; ties to the earlier
    // source in the snapshot's order.
    const [src] = [...groups.entries()].sort(
      (a, b) => b[1] - a[1] || added.indexOf(a[0]) - added.indexOf(b[0]),
    )[0];
    (out[src] ??= []).push(m.id);
  }
  return out;
}

/** The snapshot as committed, before today's copy — or null on a first run. */
function committedSnapshot(): Snapshot | null {
  try {
    const text = execFileSync(
      'git',
      ['show', 'HEAD:src/app/model-index/data/index.json'],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );
    return JSON.parse(text) as Snapshot;
  } catch {
    return null;
  }
}

const data = JSON.parse(await readFile(join(DIR, 'index.json'), 'utf8'));
let history: { entries: HistoryEntry[] } = { entries: [] };
try {
  history = JSON.parse(await readFile(join(DIR, 'history.json'), 'utf8'));
} catch {
  history = { entries: [] };
}

const rows = aggregate({
  models: data.models,
  benchmarks: data.benchmarks,
  scores: data.scores,
  weights: weightsFor(data.benchmarks),
  overall: OVERALL,
  priorFraction: PRIOR_FRACTION,
  minSources: MIN_SOURCES,
});

const committed = committedSnapshot();
const aliases = aliasesFrom(committed, data as Snapshot);
const broughtBy = broughtByFrom(committed, data as Snapshot, aliases);
const entry: HistoryEntry = {
  date: data.generatedAt.slice(0, 10),
  generatedAt: data.generatedAt,
  sources: [
    ...new Set<string>(data.benchmarks.map((b: { group: string }) => b.group)),
  ],
  models: {},
  ...(Object.keys(aliases).length ? { aliases } : {}),
  ...(Object.keys(broughtBy).length ? { broughtBy } : {}),
};
let rank = 0;
for (const r of rows) {
  entry.models[r.model.id] = {
    name: r.model.name,
    org: r.model.org,
    index: r.score === null ? null : Math.round(r.score * 10) / 10,
    rank: r.ranked ? ++rank : null,
    covered: r.covered,
  };
}

// Same-date reruns merge their aliases rather than replacing the day's
// entry; see appendEntry.
const entries = appendEntry(history.entries, entry, LIMIT);

await writeFile(
  join(DIR, 'history.json'),
  JSON.stringify({ entries }, null, 2) + '\n',
);
console.log(
  `history: ${entries.length} snapshot(s), latest ${entry.date}, ${rank} ranked of ${rows.length}${
    Object.keys(aliases).length
      ? `, ${Object.keys(aliases).length} renamed or merged: ${Object.entries(
          aliases,
        )
          .map(([n, o]) => `${o.join('+')} → ${n}`)
          .join(', ')}`
      : ''
  }${Object.entries(broughtBy)
    .map(([src, ids]) => `, ${src} brought ${ids.length}`)
    .join('')}`,
);
