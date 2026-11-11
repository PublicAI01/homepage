import { estimateLabel } from './estimate';
import { familyOf } from './family';
import { SIZE_TIERS } from './size';
import type { ModelSummary } from './track';
import { TRACKS } from './tracks';
import { rankName, rankScope, type ViewState } from './view-state';

/**
 * What a shared view's card shows: the top ten of the view, on the track
 * the view was on. The social card used to read the text index whatever
 * the link said, so a link to the video ranking previewed as ten LLMs
 * under the video ranking's title (2026-09-18). One place decides the rows
 * and the title, and the card only draws them.
 */
/**
 * The view with anything the index does not know taken out — the one
 * gate every outlet that prints a shared view's words must pass through.
 *
 * `rank=domain:<anything>` printed that text 38px tall on the social card
 * under publicai.io's name (2026-09-20); the card was fixed, and the page's
 * <title>, og:title and og:description kept reflecting the same parameter
 * verbatim, so a link could still unfurl as "Claim your prize at
 * evil.example — PublicAI Index" (2026-09-22). One function, so the title
 * and the card cannot disagree again. An unknown scope is Overall; a known
 * one comes back under its canonical name, whatever case the link used;
 * an unknown family is no family.
 */
export function sanitizeView(view: ViewState): ViewState {
  const track = TRACKS[view.track];
  const scope = track.index.resolveScope(rankScope(view.rank));
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
  return { ...view, rank: scope ?? { level: 'overall' }, family };
}

export function cardOf(view: ViewState) {
  view = sanitizeView(view);
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
    /**
     * The view the rows were drawn for — sanitized, so the caller reads
     * the scope the rows are in and not the one the link asked for. The
     * card route kept its own copy of the raw view to decide the marks:
     * on a link whose scope did not resolve (`rank=domain:General`, a
     * name the index no longer uses) the rows were Overall's while the
     * level read "domain", so every unranked row printed its estimate
     * as a plain figure — `≤53.4` as `53.4` — and wore the `*` the
     * legend reserves for reports (2026-11-11).
     */
    view,
    rows,
    title,
    generatedAt: 'error' in result ? '' : result.generatedAt.slice(0, 10),
  };
}

/**
 * What the card prints for one row, from the scope the rows are in: the
 * position cell and the figure. One function beside the gate, so the
 * marks cannot be decided from a view the rows were not drawn for.
 *
 * In a scope, a row only reports ✱ placed has no number and wears `*`.
 * On Overall, a row with no index prints its estimate with its own mark
 * (`~`, `<=`, `>=`, never `*`), ASCII because Satori fetches a font for
 * anything outside Latin-1.
 */
export function cardCells(
  level: ViewState['rank']['level'],
  m: ModelSummary,
): { position: string; figure: string; score: number | null } {
  const score = m.scopeScore ?? m.index ?? m.estimatedIndex?.score ?? null;
  const byReport = level !== 'overall' && !m.rankedInScope;
  const estimated =
    level === 'overall' && m.index === null ? m.estimatedIndex : null;
  return {
    position: `${m.position ?? '-'}${byReport ? '*' : ''}`,
    figure: estimated
      ? estimateLabel(estimated, true)
      : score === null
        ? '-'
        : score.toFixed(1),
    score,
  };
}
