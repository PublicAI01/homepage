import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { aggregate } from '../src/app/model-index/lib/aggregate.ts';
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
 * date; a rebuild on the same date replaces that date's entry.
 */
const DIR = join(process.cwd(), 'src', 'app', 'model-index', 'data');
const LIMIT = 120;

interface Entry {
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

const data = JSON.parse(await readFile(join(DIR, 'index.json'), 'utf8'));
let history: { entries: Entry[] } = { entries: [] };
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

const entry: Entry = {
  date: data.generatedAt.slice(0, 10),
  generatedAt: data.generatedAt,
  sources: [
    ...new Set<string>(data.benchmarks.map((b: { group: string }) => b.group)),
  ],
  models: {},
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

const entries = history.entries
  .filter((e) => e.date !== entry.date)
  .concat(entry)
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(-LIMIT);

await writeFile(
  join(DIR, 'history.json'),
  JSON.stringify({ entries }, null, 2) + '\n',
);
console.log(
  `history: ${entries.length} snapshot(s), latest ${entry.date}, ${rank} ranked of ${rows.length}`,
);
