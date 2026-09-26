import { describe, expect, it } from 'vitest';

import { benchmarks, scores } from '../data';
import { figuresOn, groupBoards } from './boards';

const boards = groupBoards(benchmarks);

/** The measure ids a model has a figure on, the way the table builds it. */
const scoredBy = (modelId: string) =>
  new Map(
    scores
      .filter((s) => s.modelId === modelId)
      .map((s) => [s.benchmarkId, s] as const),
  );

describe('figuresOn', () => {
  it('finds a board that scored a model on something other than its headline measure', () => {
    // Not a fixture: the case the badge strip got wrong exists in the live
    // snapshot. Find one and assert the rule reads it the way a reader does.
    const found = boards
      .filter((b) => b.measures.length > 1)
      .flatMap((board) => {
        const others = board.measures.filter((m) => m.id !== board.headline.id);
        const on = new Set(
          scores
            .filter((s) => others.some((m) => m.id === s.benchmarkId))
            .map((s) => s.modelId),
        );
        const headlined = new Set(
          scores
            .filter((s) => s.benchmarkId === board.headline.id)
            .map((s) => s.modelId),
        );
        const missed = [...on].filter((id) => !headlined.has(id));
        return missed.length > 0 ? [{ board, modelId: missed[0] }] : [];
      });
    expect(found.length).toBeGreaterThan(0);

    for (const { board, modelId } of found) {
      const scored = scoredBy(modelId);
      // The rule the badge now uses: the board did measure this model.
      expect(figuresOn(board, scored).length).toBeGreaterThan(0);
      // The rule it used before: the headline measure alone said it did not.
      expect(scored.has(board.headline.id)).toBe(false);
    }
  });

  it('agrees with the coverage count: a board with a figure is a board that counts', () => {
    // Badge and count read the same snapshot; they must not disagree on any
    // row. Coverage counts a source when any of its measures scored.
    for (const board of boards.slice(0, 40)) {
      for (const m of board.measures) {
        const one = scores.find((s) => s.benchmarkId === m.id);
        if (!one) continue;
        expect(figuresOn(board, scoredBy(one.modelId))).toContainEqual(m);
      }
    }
  });
});
