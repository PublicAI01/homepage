import { ImageResponse } from 'next/og';

import { rankModels } from '../lib/query';
import { SIZE_TIERS } from '../lib/size';
import { decodeView, rankName, rankScope } from '../lib/view-state';

/**
 * The social card for a shared view: the same top ten the reader filtered,
 * drawn as bars. Whatever the table showed when the link was copied is what
 * the card shows when the link is posted — never the unfiltered page.
 *
 * Satori rules: a box with several children needs display:flex, and any
 * glyph outside Latin-1 makes it fetch a font, so text is single strings
 * and ASCII ("*" for the report mark).
 */
export const runtime = 'nodejs';

const W = 1200;
const H = 630;

const ascii = (t: string) =>
  t.replace(/≤/g, '<=').replace(/[–—]/g, '-').replace(/✱/g, '*');

export async function GET(request: Request) {
  const view = decodeView(new URL(request.url).searchParams);
  const result = rankModels({
    scope: rankScope(view.rank),
    family: view.family === 'all' ? undefined : view.family,
    size: view.size === 'all' ? undefined : view.size,
    minBoards: view.minBoards,
    reports: view.reports,
    q: view.q || undefined,
    must: view.must,
    limit: 10,
  });
  const rows = 'error' in result ? [] : result.models;
  const scope = rankName(view.rank);
  const tier = SIZE_TIERS.find((t) => t.id === view.size);
  const title = ascii(
    `Top ${rows.length} - ${scope}${tier ? ` · ${tier.label}` : ''}${view.family !== 'all' ? ` · ${view.family}` : ''}`,
  );
  const scoreOf = (m: (typeof rows)[number]) =>
    m.scopeScore ?? m.index ?? m.estimatedIndex?.score ?? null;
  const scores = rows.map(scoreOf).filter((n): n is number => n !== null);
  const max = Math.max(...scores, 1);
  const min = Math.min(...scores, max);
  const floor = Math.max(0, Math.floor((min - 5) / 10) * 10);
  const span = Math.max(1, Math.ceil((max + 2) / 10) * 10 - floor);
  const generated = 'error' in result ? '' : result.generatedAt.slice(0, 10);

  const bar = (m: (typeof rows)[number]) => {
    const v = scoreOf(m);
    const w = v === null ? 0 : ((v - floor) / span) * 640;
    const byReport = view.rank.level !== 'overall' && !m.rankedInScope;
    const estimated =
      view.rank.level === 'overall' && m.index === null && m.estimatedIndex;
    return (
      <div
        key={m.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 44,
          fontSize: 19,
        }}>
        <div style={{ display: 'flex', width: 44, color: '#8E8BA0' }}>
          {`${m.position ?? '-'}${byReport ? '*' : ''}`}
        </div>
        <div
          style={{
            display: 'flex',
            width: 340,
            alignItems: 'baseline',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}>
          <span style={{ fontWeight: 600 }}>{ascii(m.name)}</span>
          <span style={{ color: '#8E8BA0', fontSize: 15, marginLeft: 8 }}>
            {ascii(m.org)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            width: Math.max(6, w),
            height: 22,
            borderRadius: 4,
            background: m.ranked
              ? 'rgba(142,139,255,0.85)'
              : 'rgba(255,255,255,0.28)',
          }}
        />
        <div style={{ display: 'flex', marginLeft: 12, fontWeight: 600 }}>
          {`${v === null ? '-' : v.toFixed(1)}${estimated ? '*' : ''}`}
        </div>
      </div>
    );
  };

  return new ImageResponse(
    <div
      style={{
        width: W,
        height: H,
        display: 'flex',
        flexDirection: 'column',
        background: '#0B0B0D',
        color: '#FFFFFF',
        padding: '44px 56px',
        fontFamily: 'sans-serif',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 15, letterSpacing: 3, color: '#8E8BFF' }}>
            PUBLICAI INDEX
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }}>
            {title}
          </div>
        </div>
        <div style={{ fontSize: 15, color: '#8E8BA0' }}>
          {`snapshot ${generated} · publicai.io/model-index`}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 26,
          flexGrow: 1,
        }}>
        {rows.length ? (
          rows.map(bar)
        ) : (
          <div style={{ color: '#8E8BA0', fontSize: 22 }}>
            Nothing matches this view.
          </div>
        )}
      </div>

      <div style={{ fontSize: 14, color: '#6F6D7A' }}>
        {
          'Scores 0-100, standardized across the models each source lists; 50 is average. * placed or estimated from reports. Scores belong to their publishers; PublicAI normalizes and weights them.'
        }
      </div>
    </div>,
    { width: W, height: H },
  );
}
