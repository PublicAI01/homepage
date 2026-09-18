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
