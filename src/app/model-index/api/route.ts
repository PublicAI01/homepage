import { NextResponse } from 'next/server';

import { changesSince } from '../lib/changes';
import type { RankQuery } from '../lib/query';
import { trackOf, TRACKS } from '../lib/tracks';

/**
 * The same three answers as the MCP server, over plain GET, for agents and
 * scripts that do not speak MCP.
 *
 *   /model-index/api                        → describe_index
 *   /model-index/api?model=claude-fable-5-1 → get_model
 *   /model-index/api?since=2026-09-01       → whats_new (changes since that snapshot)
 *   /model-index/api?scope=coding&limit=10  → rank_models
 *     (also org, family, minBoards, openWeights, callable, reports=false, size=small|medium|large|xlarge|undisclosed)
 *   /model-index/api?track=image&scope=text-to-image → the same, on the image track
 *     (track=text|image|video; text is the default. `since` is text-only.)
 */
const SIZES = ['small', 'medium', 'large', 'xlarge', 'undisclosed'] as const;
const DATE = /^\d{4}-\d\d-\d\d$/;

const bad = (message: string) =>
  NextResponse.json(
    { error: message },
    { status: 400, headers: { 'access-control-allow-origin': '*' } },
  );

export function GET(request: Request) {
  const p = new URL(request.url).searchParams;
  const bool = (k: string) => (p.has(k) ? p.get(k) !== 'false' : undefined);
  // A parameter that does not parse is an error, not an empty answer:
  // `limit=abc` sliced to nothing with total still reported, `minBoards=abc`
  // switched the filter off, `since=yesterday` compared as a string and
  // always found "no change" (2026-09-20). The MCP server validates with a
  // schema; this is the same contract by hand.
  const problems: string[] = [];
  const int = (k: string, min: number) => {
    if (!p.has(k)) return undefined;
    const n = Number(p.get(k));
    if (!Number.isInteger(n) || n < min)
      problems.push(`${k} must be an integer ≥ ${min}`);
    return n;
  };
  const track = trackOf(p.get('track') ?? 'text');
  if (!track) {
    return NextResponse.json(
      {
        error: `Unknown track "${p.get('track')}". One of: ${Object.keys(TRACKS).join(', ')}.`,
      },
      { status: 404, headers: { 'access-control-allow-origin': '*' } },
    );
  }
  const { describeIndex, getModel, rankModels } = track.index;

  const size = p.get('size') ?? undefined;
  if (size !== undefined && !(SIZES as readonly string[]).includes(size))
    problems.push(`size must be one of ${SIZES.join(', ')}`);
  const since = p.get('since') ?? undefined;
  if (since !== undefined && !DATE.test(since))
    problems.push('since must be a date, YYYY-MM-DD');
  if (since !== undefined && track.id !== 'text')
    problems.push('since is only kept for the text track');
  const minDelta = int('minDelta', 0);
  const minBoards = int('minBoards', 0);
  const limit = int('limit', 1);
  if (problems.length) return bad(problems.join('; '));

  const body = since
    ? changesSince(since, minDelta ?? 3)
    : p.has('model')
      ? getModel(p.get('model')!)
      : p.has('scope') || p.has('org') || p.has('limit') || p.has('minBoards')
        ? rankModels({
            scope: p.get('scope') ?? undefined,
            org: p.get('org') ?? undefined,
            family: p.get('family') ?? undefined,
            minBoards,
            limit,
            openWeights: bool('openWeights'),
            callable: bool('callable'),
            reports: bool('reports'),
            size: size as RankQuery['size'],
            // Documented since launch but never read; the UI filter that
            // used to set it is gone, the API filter stays.
            must: p.get('must')?.split(',').filter(Boolean),
          })
        : describeIndex();

  return NextResponse.json(body, {
    status: 'error' in body ? 404 : 200,
    headers: {
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}
