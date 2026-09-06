import { NextResponse } from 'next/server';

import { describeIndex, getModel, rankModels } from '../lib/query';

/**
 * The same three answers as the MCP server, over plain GET, for agents and
 * scripts that do not speak MCP.
 *
 *   /model-index/api                        → describe_index
 *   /model-index/api?model=claude-fable-5-1 → get_model
 *   /model-index/api?scope=coding&limit=10  → rank_models
 *     (also org, minBoards, openWeights, callable)
 */
export function GET(request: Request) {
  const p = new URL(request.url).searchParams;
  const bool = (k: string) => (p.has(k) ? p.get(k) !== 'false' : undefined);
  const int = (k: string) => (p.has(k) ? Number(p.get(k)) : undefined);

  const body = p.has('model')
    ? getModel(p.get('model')!)
    : p.has('scope') || p.has('org') || p.has('limit') || p.has('minBoards')
      ? rankModels({
          scope: p.get('scope') ?? undefined,
          org: p.get('org') ?? undefined,
          minBoards: int('minBoards'),
          limit: int('limit'),
          openWeights: bool('openWeights'),
          callable: bool('callable'),
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
