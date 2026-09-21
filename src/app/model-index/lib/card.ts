import { familyOf } from './family';
import { SIZE_TIERS } from './size';
import { TRACKS } from './tracks';
import { rankName, rankScope, type ViewState } from './view-state';

/**
 * What a shared view's card shows: the top ten of the view, on the track
 * the view was on. The social card used to read the text index whatever
 * the link said, so a link to the video ranking previewed as ten LLMs
 * under the video ranking's title (2026-09-18). One place decides the rows
 * and the title, and the card only draws them.
 */
export function cardOf(view: ViewState) {
  const track = TRACKS[view.track];
  // Only what the index knows goes on the card: `rank=domain:<anything>`
  // printed that text 38px tall under publicai.io's name, and every new
  // string was a fresh render (2026-09-20). An unknown scope is Overall;
  // an unknown family is no family.
  const scope = track.index.resolveScope(rankScope(view.rank))
    ? view.rank
    : ({ level: 'overall' } as const);
  // Over every model in the snapshot, not the rows an API call returns:
  // rankModels caps at 100 rows however large a limit is asked for, so a
  // whitelist read off it held the families of the top hundred only — 22
  // of 168 — and a link filtered to any other family (K2, Mixtral, Falcon)
  // previewed as the unfiltered Overall top ten (2026-09-21).
  const families = new Set(
    track.index.data.models.map((m) => familyOf(m.name).toLowerCase()),
  );
  const family =
    view.family !== 'all' && families.has(view.family.toLowerCase())
      ? view.family
      : 'all';
  view = { ...view, rank: scope, family };
  const result = track.index.rankModels({
    scope: rankScope(view.rank),
    family: view.family === 'all' ? undefined : view.family,
    size: view.size === 'all' ? undefined : view.size,
    minBoards: view.minBoards,
    reports: view.reports,
    q: view.q || undefined,
    limit: 10,
  });
  const rows = 'error' in result ? [] : result.models;
  const tier = SIZE_TIERS.find((t) => t.id === view.size);
  const title = `Top ${rows.length} - ${rankName(view.rank)}${tier ? ` · ${tier.label}` : ''}${view.family !== 'all' ? ` · ${view.family}` : ''}${track.id !== 'text' ? ` · ${track.label}` : ''}`;
  return {
    track,
    rows,
    title,
    generatedAt: 'error' in result ? '' : result.generatedAt.slice(0, 10),
  };
}
