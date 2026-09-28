import { ImageResponse } from 'next/og';

import { MARK } from '../../og/mark';
import { cardOf } from '../lib/card';
import { estimateMark } from '../lib/estimate';
import { decodeView } from '../lib/view-state';

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

const ONE_LINER =
  "The LLM benchmark aggregator - the world's most comprehensive and robust LLM index.";

const ascii = (t: string) =>
  t
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/[–—]/g, '-')
    .replace(/✱/g, '*');

export async function GET(request: Request) {
  const view = decodeView(new URL(request.url).searchParams);
  const card = cardOf(view);
  const rows = card.rows;
  const title = ascii(card.title);
  const scoreOf = (m: (typeof rows)[number]) =>
    m.scopeScore ?? m.index ?? m.estimatedIndex?.score ?? null;
  const scores = rows.map(scoreOf).filter((n): n is number => n !== null);
  const max = Math.max(...scores, 1);
  const min = Math.min(...scores, max);
  const floor = Math.max(0, Math.floor((min - 5) / 10) * 10);
  const span = Math.max(1, Math.ceil((max + 2) / 10) * 10 - floor);
  const generated = card.generatedAt;

  const bar = (m: (typeof rows)[number]) => {
    const v = scoreOf(m);
    const w = v === null ? 0 : ((v - floor) / span) * 640;
    const byReport = view.rank.level !== 'overall' && !m.rankedInScope;
    // An estimate wears its own mark (~, <=, >=), never the report mark:
    // `55.0*` under a legend reading "from reports" called a figure
    // anchored on boards a launch-post number (2026-09-21).
    const estimated =
      view.rank.level === 'overall' && m.index === null
        ? m.estimatedIndex
        : null;
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
          {`${estimated ? estimateMark(estimated.bound, true) : ''}${v === null ? '-' : v.toFixed(1)}`}
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
          alignItems: 'flex-start',
        }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 38, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 17, color: '#B9B7C4', marginTop: 8 }}>
            {ONE_LINER}
          </div>
          <div style={{ fontSize: 14, color: '#8E8BA0', marginTop: 6 }}>
            {`snapshot ${generated} \u00b7 publicai.io/model-index`}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori */}
          <img
            src={MARK}
            width={214}
            height={52}
            alt=""
          />
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 4,
              color: '#B08BFF',
              marginTop: 4,
            }}>
            INDEX
          </div>
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

      <div style={{ fontSize: 14, color: '#6F6D7A', flexShrink: 0 }}>
        {
          'Scores 0-100; 50 is the average of the models each source lists. * placed by reports; ~ <= >= estimated, never ranked. Scores belong to their publishers.'
        }
      </div>
    </div>,
    {
      width: W,
      height: H,
      // The most expensive route on the site, keyed by a query string: a
      // card rendered once a day is right for a daily snapshot, and a
      // scraper cycling parameters hits the cache, not Satori (2026-09-20).
      headers: {
        'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    },
  );
}
