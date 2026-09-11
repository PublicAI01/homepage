import { getModel, positionIn, resolveScope, scopeLabel } from '../lib/query';

/**
 * An SVG badge for a model's README or launch post:
 *
 *   /model-index/badge?model=claude-fable-5-1            → "PublicAI Index · #1 · 69.1"
 *   /model-index/badge?model=k2-horizon-375b-a23b&scope=domain:Tool use
 *
 * Renders the live position, so a badge never goes stale; the tooltip
 * carries the snapshot date. Provisional models show "provisional", an
 * estimate shows "~55✱", and a position placed by reports alone shows ✱.
 *
 * The position comes from the scope's full list, not the API's first
 * hundred rows: a model at #120 in Agentic coding is measured there, and
 * a badge that said "not scored" was stating the opposite of the record.
 * A scope that does not resolve says so, rather than "not listed", which
 * would deny a model that is (2026-09-11).
 */
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const width = (s: string) => Math.round(s.length * 6.6) + 16;

export function GET(request: Request) {
  const p = new URL(request.url).searchParams;
  const modelQ = p.get('model') ?? '';
  const scope = resolveScope(p.get('scope') ?? undefined);
  const found = getModel(modelQ);
  let label = 'PublicAI Index';
  let value = 'not listed';
  let title = 'No such model on the PublicAI Index';
  let tone = '#6F6D7A';
  if (!('error' in found)) {
    const m = found.model;
    title = `${m.name} on the PublicAI Index, snapshot ${found.generatedAt.slice(0, 10)}. Scores are 0–100 standardized; ✱ from reports.`;
    if (!scope) {
      value = 'unknown scope';
    } else if (scope.level === 'overall') {
      value = m.ranked
        ? `#${m.rank} · ${m.index?.toFixed(1)}`
        : m.estimatedIndex
          ? `~${m.estimatedIndex.score.toFixed(1)}✱ provisional`
          : 'provisional';
      tone = m.ranked ? '#4000C8' : '#6F6D7A';
    } else {
      const where = scopeLabel(scope);
      const row = positionIn(m.id, {
        scope: p.get('scope') ?? undefined,
        minBoards: 0,
      });
      if (row) {
        // A place only reports ✱ made has a score but no number.
        value = `${where} ${row.position === null ? '—✱' : `#${row.position}`} · ${row.scopeScore?.toFixed(1)}`;
        tone = row.rankedInScope ? '#4000C8' : '#7A5CFF';
      } else {
        value = `${where}: not scored`;
      }
    }
  }
  const lw = width(label);
  const vw = width(value);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${lw + vw}" height="20" role="img" aria-label="${esc(`${label}: ${value}`)}"><title>${esc(title)}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><rect rx="3" width="${lw + vw}" height="20" fill="#0B0B0D"/><rect x="${lw}" rx="3" width="${vw}" height="20" fill="${tone}"/><rect x="${lw}" width="4" height="20" fill="${tone}"/><rect rx="3" width="${lw + vw}" height="20" fill="url(#s)"/><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11"><text x="${lw / 2}" y="14">${esc(label)}</text><text x="${lw + vw / 2}" y="14">${esc(value)}</text></g></svg>`;
  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
      'access-control-allow-origin': '*',
    },
  });
}
