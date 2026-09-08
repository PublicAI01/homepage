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

/* The mark inline: Satori renders without a network, and a card that gets
   screenshotted and reposted has to carry its source with it. White because
   the source file paints with currentColor, which has no meaning here. */
const MARK =
  'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjYxIDY0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBmaWxsPSIjRkZGRkZGIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02My43NDY5IDAuMTg3MzVDNjUuNjQwNiAyLjA4MzEyIDUyLjk0NzYgMTcuODYyOSAzNS4zOTYxIDM1LjQzMjVDMTcuODQ0NiA1My4wMDIzIDIuMDgwOTggNjUuNzA4NCAwLjE4NzE1NyA2My44MTI3Qy0wLjg4NzY5NCA2Mi43MzY2IDIuNzM2MjIgNTcuMTg4MiA5LjI4MDMgNDkuMzc4OEM4LjU3MzM0IDQ4LjQzNTggNy45Mjg0MyA0Ny40NTE0IDcuMzQ4MjcgNDYuNDMzMkM0Ljk1MzEyIDQyLjIyODQgMy42NjE2NSAzNy40MzY2IDMuNjYxNjUgMzIuNTExNUMzLjY2MTY1IDI1LjA1OCA2LjYxOTUxIDE3LjkwOTggMTEuODg0NSAxMi42Mzk0QzE3LjE0OTUgNy4zNjg5MyAyNC4yOTA0IDQuNDA4MDMgMzEuNzM2MyA0LjQwODAzQzM2LjY1NjMgNC40MDgwMyA0MS40NDMxIDUuNzAwODIgNDUuNjQzNiA4LjA5ODQ4QzQ2LjYzNDYgOC42NjQyMSA0Ny41OTMxIDkuMjkxNDYgNDguNTEzMSA5Ljk3Nzc3QzU2Ljc0MTkgMi45OTQ3NyA2Mi42MzUxIC0wLjkyNTcwNCA2My43NDY5IDAuMTg3MzVaTTE4Ljk5MDkgMzguNDUwN0MyMS45NDU4IDM1LjI4MDggMjUuMTUxNSAzMS45NTc0IDI4LjUzOCAyOC41Njc0QzMxLjY0OTEgMjUuNDUzMSAzNC43MDM5IDIyLjQ5MTcgMzcuNjM1NCAxOS43MzczQzM1LjgwMzUgMTguODg5NiAzMy43OTMxIDE4LjQzODQgMzEuNzM2MyAxOC40Mzg0QzI4LjAwNzcgMTguNDM4NCAyNC40MzE4IDE5LjkyMTEgMjEuNzk1MyAyMi41NjAzQzE5LjE1ODggMjUuMTk5NSAxNy42Nzc2IDI4Ljc3OTEgMTcuNjc3NiAzMi41MTE1QzE3LjY3NzYgMzQuNTgzMiAxOC4xMzM5IDM2LjYwNzkgMTguOTkwOSAzOC40NTA3Wk0xNi4xMTg2IDU1Ljg2MzFDMTYuMjUzOCA1NS45NTM1IDE2LjM4OTcgNTYuMDQzMSAxNi41MjYzIDU2LjEzMTFDMjEuMDI2NSA1OS4wMzQ5IDI2LjMwMSA2MC42MTM5IDMxLjczODEgNjAuNjEzOUMzOS4xODQgNjAuNjEzOSA0Ni4zMjQ3IDU3LjY1MzEgNTEuNTg5NyA1Mi4zODI3QzU2Ljg1NDcgNDcuMTEyMyA1OS44MTI5IDM5Ljk2MzkgNTkuODEyOSAzMi41MTA0QzU5LjgxMjkgMjcuMDY3NyA1OC4yMzU1IDIxLjc4NzggNTUuMzM0NiAxNy4yODI5QzU1LjI3MjggMTcuMTg3MyA1NS4yMTEgMTcuMDkyMSA1NS4xNDggMTYuOTk3M0M1My45MzQ2IDE4LjU3MzggNTIuNjEyOCAyMC4yMjAxIDUxLjE5MzkgMjEuOTIwNkM1Mi45NDM2IDI1LjE0MTggNTMuODg0IDI4Ljc3NzYgNTMuODg0IDMyLjUxMDRDNTMuODg0IDM4LjM4OTkgNTEuNTUwOCA0NC4wMjg1IDQ3LjM5NzYgNDguMTg1OUM0My4yNDQ1IDUyLjM0MzMgMzcuNjExNiA1NC42NzkgMzEuNzM4MSA1NC42NzlDMjcuOTczOCA1NC42NzkgMjQuMzA4MyA1My43MTk1IDIxLjA2NzkgNTEuOTM2M0MxOS4zNTM3IDUzLjM1MjIgMTcuNjk4MyA1NC42NjQ5IDE2LjExODYgNTUuODYzMVpNMjMuMDgzMyA1MC4yNDY3QzI1Ljc1MzcgNTEuNTUyMiAyOC43MSA1Mi4yNDk3IDMxLjczODEgNTIuMjQ5N0MzNi45Njc5IDUyLjI0OTcgNDEuOTgzMyA1MC4xNyA0NS42ODEzIDQ2LjQ2ODJDNDkuMzc5MyA0Mi43NjY0IDUxLjQ1NjkgMzcuNzQ1NSA1MS40NTY5IDMyLjUxMDRDNTEuNDU2OSAyOS41MDk2IDUwLjc3NDUgMjYuNTc5MyA0OS40OTUzIDIzLjkyNzVDNDguMDk1MiAyNS41NTk1IDQ2LjYxMjkgMjcuMjMzNyA0NS4wNTgzIDI4LjkzNzJDNDUuMzY3OCAzMC4wOTI4IDQ1LjUyODQgMzEuMjkzMyA0NS41Mjg0IDMyLjUxMDRDNDUuNTI4NCAzNi4xNzE1IDQ0LjA3NTQgMzkuNjgyNyA0MS40ODkyIDQyLjI3MTRDMzguOTAzMSA0NC44NjAyIDM1LjM5NTUgNDYuMzE0NyAzMS43MzgxIDQ2LjMxNDdDMzAuNTAyMyA0Ni4zMTQ3IDI5LjI4MzUgNDYuMTQ4OCAyOC4xMTE3IDQ1LjgyODlDMjYuMzk5MSA0Ny4zODA3IDI0LjcxODUgNDguODU2MSAyMy4wODMzIDUwLjI0NjdaIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTM1Ljc2NiA1MC4zODU1VjEzLjYxNDVIMTQxLjUzN1YyNC4yOThIMTQ5Ljk3M0MxNTUuMTM3IDI0LjI5OCAxNTcuNzE4IDI2LjkxNSAxNTcuNzE4IDMyLjE0OTFWNDIuNTM0NEMxNTcuNzE4IDQ3Ljc2ODUgMTU1LjEzNyA1MC4zODU1IDE0OS45NzMgNTAuMzg1NUgxMzUuNzY2Wk0xNDEuNTM3IDQ1LjMxNzFIMTQ5LjY3N0MxNTEuMTkgNDUuMzE3MSAxNTEuOTQ3IDQ0LjU1NTEgMTUxLjk0NyA0My4wMzEzVjMxLjY1MjJDMTUxLjk0NyAzMC4xMjgzIDE1MS4xOSAyOS4zNjY0IDE0OS42NzcgMjkuMzY2NEgxNDEuNTM3VjQ1LjMxNzFaIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNzUuNzk4MSAxNi4wOTlWNTAuMzg1NUg4MS44MTY2VjM4Ljg1NzNIOTIuMTc2NEM5Ny41MzcxIDM4Ljg1NzMgMTAwLjIxOCAzNi4xNzQgMTAwLjIxOCAzMC44MDc0VjI0LjE5ODZDMTAwLjIxOCAxOC43OTg5IDk3LjUzNzEgMTYuMDk5IDkyLjE3NjQgMTYuMDk5SDc1Ljc5ODFaTTkyLjAyODQgMzMuMzQxNkg4MS44MTY2VjIxLjYxNDdIOTIuMDI4NEM5My40NzU0IDIxLjYxNDcgOTQuMTk5IDIyLjMyNjkgOTQuMTk5IDIzLjc1MTRWMzEuMTU1M0M5NC4xOTkgMzIuNjEyOSA5My40NzU0IDMzLjM0MTYgOTIuMDI4NCAzMy4zNDE2WiIvPgo8cGF0aCBkPSJNMTA2LjQyMiAyNC4yOThWNDIuNTM0NEMxMDYuNDIyIDQ3Ljc2ODUgMTA5LjAyIDUwLjM4NTUgMTE0LjIxNiA1MC4zODU1SDEyOC4zNzVWMjQuMjk4SDEyMi42MDNWNDUuMzE3MUgxMTQuNDYzQzExMi45NSA0NS4zMTcxIDExMi4xOTQgNDQuNTU1MSAxMTIuMTk0IDQzLjAzMTNWMjQuMjk4SDEwNi40MjJaIi8+CjxwYXRoIGQ9Ik0xNjQuNTIyIDEzLjYxNDVWNTAuMzg1NUgxNzAuMjk0VjEzLjYxNDVIMTY0LjUyMloiLz4KPHBhdGggZD0iTTE3Ny41ODEgMTkuNzc2MVYxMy44NjI5SDE4My42NDhWMTkuNzc2MUgxNzcuNTgxWiIvPgo8cGF0aCBkPSJNMTc3LjcyOSA1MC4zODU1VjI0LjI5OEgxODMuNVY1MC4zODU1SDE3Ny43MjlaIi8+CjxwYXRoIGQ9Ik0xOTAuNDg2IDMyLjE0OTFWNDIuNTM0NEMxOTAuNDg2IDQ3Ljc2ODUgMTkzLjA4NCA1MC4zODU1IDE5OC4yOCA1MC4zODU1SDIxMC4yMTlWNDUuMzE3MUgxOTguNTI3QzE5Ny4wMTQgNDUuMzE3MSAxOTYuMjU4IDQ0LjU1NTEgMTk2LjI1OCA0My4wMzEzVjMxLjY1MjJDMTk2LjI1OCAzMC4xMjgzIDE5Ny4wMTQgMjkuMzY2NCAxOTguNTI3IDI5LjM2NjRIMjEwLjIxOVYyNC4yOThIMTk4LjI4QzE5My4wODQgMjQuMjk4IDE5MC40ODYgMjYuOTE1IDE5MC40ODYgMzIuMTQ5MVoiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMjcuODgzIDEzLjc4OTVMMjE1Ljk1NCA1MC4yMTA1SDIyMi44MjRMMjI1LjM1MyA0Mi4xODczSDI0MC4zNzVMMjQyLjg1MiA1MC4yMTA1SDI0OS42MjJMMjM3Ljg5OCAxMy43ODk1SDIyNy44ODNaTTIzOC42MzYgMzYuMzI4M0gyMjcuMTQ1TDIzMi4zNjMgMTkuNjQ4NUgyMzMuMzY1TDIzOC42MzYgMzYuMzI4M1oiLz4KPHBhdGggZD0iTTI1NC41NyAxMy43ODk1VjUwLjIxMDVIMjYxVjEzLjc4OTVIMjU0LjU3WiIvPgo8L2c+Cjwvc3ZnPgo=';
const ONE_LINER =
  "The LLM benchmark aggregator - the world's most comprehensive and robust LLM index.";

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
          'Scores 0-100; 50 is the average of the models each source lists. * placed or estimated from reports. Scores belong to their publishers.'
        }
      </div>
    </div>,
    { width: W, height: H },
  );
}
