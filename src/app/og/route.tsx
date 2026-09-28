import { ImageResponse } from 'next/og';

import { MARK } from './mark';

/**
 * The social card for a page that has no picture of its own.
 *
 * `blog/[slug]` has always fallen back to `/og?title=…` for a post with no
 * `image` in its metadata, and this route did not exist: every such post
 * shipped `og:image` pointing at a 404, so the first share of it rendered a
 * broken thumbnail. Every post published so far happened to carry a cover,
 * which is why nobody saw it (2026-09-26).
 *
 * Satori rules: a box with several children needs display:flex, and any
 * glyph outside Latin-1 makes it fetch a font, so the title is flattened to
 * ASCII first.
 */
export const runtime = 'nodejs';

const W = 1200;
const H = 630;
const ONE_LINER =
  "The LLM benchmark aggregator - the world's most comprehensive and robust LLM index.";

const ascii = (t: string) =>
  t
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/✱/g, '*');

/** Long titles wrap; a very long one is cut where a reader would stop. */
const MAX = 120;

export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('title') ?? 'PublicAI';
  const title = ascii(raw).slice(0, MAX).trim();

  return new ImageResponse(
    <div
      style={{
        width: W,
        height: H,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0B0B0D',
        padding: 72,
        fontFamily: 'sans-serif',
      }}>
      <div style={{ display: 'flex' }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws this; next/image has no part in it */}
        <img
          src={MARK}
          width={196}
          height={48}
          alt="PublicAI"
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 54 : 64,
            lineHeight: 1.15,
            color: '#FFFFFF',
            letterSpacing: -1,
          }}>
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#8E8BA0' }}>
          {ONE_LINER}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 22,
          color: '#6F6D7A',
        }}>
        <span>publicai.io</span>
        <span>PublicAI Index</span>
      </div>
    </div>,
    { width: W, height: H },
  );
}
