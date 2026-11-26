import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { unrankedReason } from '../lib/unranked';

/**
 * The table is a client component with no DOM harness in this repo, so the
 * contract is held at the source: every sentence it prints about why a row
 * is provisional must come from `unrankedReason`, the one rule the model
 * page already uses (lib/unranked.ts, 2026-11-21).
 *
 * Hardcoded as "fewer than 2 independent publishers", the expanded card and
 * the # cell's hover gave the wrong reason for 57 of the 984 provisional
 * rows on 2026-11-26 — GPT-5.5, Claude Opus 4.7 and Qwen4 Max among them,
 * each scored by two publishers and short only on measured weighting.
 */
const source = readFileSync(join(__dirname, 'index-table.tsx'), 'utf8');

describe('index-table provisional wording', () => {
  it('never states the publisher count as the whole rule', () => {
    expect(source).not.toMatch(
      /Provisional — fewer than \$?\{MIN_SOURCES\} independent publishers/,
    );
    expect(source).not.toMatch(
      /Provisional = fewer than \{MIN_SOURCES\} independent publishers\./,
    );
  });

  it('reads the reason off the row through the shared rule', () => {
    expect(source).toMatch(/unrankedReason\(row\)/);
    // The rule itself still tells weighting apart from publishers.
    expect(
      unrankedReason({ measuredWeight: 0.4, overallPublishers: 2 }),
    ).not.toMatch(/publisher/);
  });
});
