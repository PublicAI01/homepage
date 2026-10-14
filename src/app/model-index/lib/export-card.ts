/**
 * One model's card, drawn to a canvas and saved as PNG. Client-only.
 *
 * The page is for reading; the card is for posting. It keeps the three
 * things a reader of a timeline needs — who, how high, and where it is
 * strong — at a size that survives a phone, and sends everything else back
 * to the page through the URL printed on it. Same frame as the table's
 * chart export (portrait, 4:5), so the two sit together in a thread.
 */
export interface CardRow {
  scope: string;
  score: number;
  position: number;
  total: number;
}

export interface CardSpec {
  /** "PublicAI Index", or the image/video track's title. */
  track: string;
  name: string;
  org: string;
  /** "· 1T params · open weights", already joined; empty when there is nothing to say. */
  tagline: string;
  /** The Overall index; null when the model is not ranked. */
  index: number | null;
  rank: number | null;
  rankedTotal: number;
  /** Only when `index` is null. */
  estimate: { words: string; score: number; position: number | null } | null;
  /** Why it is not ranked, when it is not. */
  unrankedReason: string;
  covered: number;
  coverable: number;
  /** Domain-level scopes the model is placed in — the "of N" in the section label. */
  domainsTotal: number;
  rows: CardRow[];
  /** "14 Oct 2026". */
  day: string;
  /** Printed as is: "publicai.io/model-index/m/muse-wonder". */
  url: string;
}

export const W = 1200;
const PAD = 72;
const ROW_H = 82;
export const ROWS = 8;
const LOGO = '/publicai-mark-white.svg';
const LOGO_W = 200;
/** Distance from par that fills a half bar, as on the page. */
const SPAN = 30;

const PURPLE = '#B08BFF';
const WHITE = '#FFFFFF';
const INK = '#D9D7E0';
const GREY = '#9C9AA8';
const DIM = '#6F6D7A';
const AMBER = '#E0B341';

/**
 * The scopes worth a card: domains a recognised board placed the model in,
 * best place first. Categories are left out — "Coding #4" next to "Agentic
 * coding #4" is one fact printed twice.
 */
export function bestDomains<
  T extends {
    level: 'category' | 'domain';
    position: number | null;
    score: number;
  },
>(standings: T[], n = ROWS): T[] {
  return standings
    .filter((s) => s.level === 'domain' && s.position !== null)
    .sort((a, b) => a.position! - b.position! || b.score - a.score)
    .slice(0, n);
}

/**
 * The largest size, from `start` down to `min`, at which `text` fits
 * `maxWidth`. A name that does not fit at `min` is cut with an ellipsis
 * rather than shrunk to a caption.
 */
export function fit(
  measure: (text: string, size: number) => number,
  text: string,
  maxWidth: number,
  start: number,
  min: number,
): { text: string; size: number } {
  for (let size = start; size >= min; size -= 2) {
    if (measure(text, size) <= maxWidth) return { text, size };
  }
  let cut = text;
  while (cut.length > 1 && measure(`${cut}…`, min) > maxWidth) {
    cut = cut.slice(0, -1).trimEnd();
  }
  return { text: `${cut}…`, size: min };
}

function loadMark(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = LOGO;
  });
}

export async function drawCard(spec: CardSpec): Promise<HTMLCanvasElement> {
  // The page's own faces, so the card matches what was on screen. The
  // webfont is already loaded by the time anyone can click the button, but
  // waiting costs nothing and a fallback face on a canvas is permanent.
  await document.fonts.ready;
  const SANS = getComputedStyle(document.body).fontFamily || 'sans-serif';
  const MONO =
    'ui-monospace, "SF Mono", Menlo, "JetBrains Mono", Consolas, monospace';
  const mark = await loadMark();

  // The card is as tall as its rows: eight make the 4:5 frame the table's
  // chart uses, two make a short one, not a tall one with a hole in it.
  const heroExtra = spec.index === null && spec.estimate ? 44 : 0;
  const rowsTop = PAD + 150 + 46 + 150 + 54 + heroExtra + 60 + 62 + 30;
  const H = rowsTop + Math.max(1, spec.rows.length) * ROW_H + 220;

  const canvas = document.createElement('canvas');
  const dpr = 2;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  const font = (weight: number, size: number, face = SANS) =>
    `${weight} ${size}px ${face}`;
  const text = (
    s: string,
    x: number,
    y: number,
    color: string,
    f: string,
    align: CanvasTextAlign = 'left',
  ) => {
    ctx.fillStyle = color;
    ctx.font = f;
    ctx.textAlign = align;
    ctx.fillText(s, x, y);
    ctx.textAlign = 'left';
  };
  const width = (s: string, f: string) => {
    ctx.font = f;
    return ctx.measureText(s).width;
  };

  // ground
  ctx.fillStyle = '#0B0B0D';
  ctx.fillRect(0, 0, W, H);

  // brand lockup, top right; the track, top left
  let y = PAD;
  if (mark) {
    const h = (mark.height / mark.width) * LOGO_W || LOGO_W / 4;
    ctx.drawImage(mark, W - PAD - LOGO_W, y - 8, LOGO_W, h);
    ctx.letterSpacing = '4px';
    text('INDEX', W - PAD, y + h + 22, PURPLE, font(700, 26), 'right');
    ctx.letterSpacing = '0px';
  }
  ctx.letterSpacing = '3px';
  text(spec.track.toUpperCase(), PAD, y + 14, DIM, font(600, 18));
  ctx.letterSpacing = '0px';

  // the model
  y = PAD + 150;
  const name = fit(
    (t, s) => width(t, font(700, s)),
    spec.name,
    W - PAD * 2,
    88,
    48,
  );
  text(name.text, PAD, y, WHITE, font(700, name.size));
  y += 46;
  text(`${spec.org}${spec.tagline}`, PAD, y, GREY, font(400, 30));

  // the number
  y += 150;
  if (spec.index !== null) {
    const big = font(700, 160, MONO);
    text(spec.index.toFixed(1), PAD, y, PURPLE, big);
    const w = width(spec.index.toFixed(1), big);
    text('/ 100', PAD + w + 18, y, '#4A4A52', font(500, 44));
    if (spec.rank !== null) {
      text(`#${spec.rank}`, W - PAD, y, WHITE, font(700, 112, MONO), 'right');
    }
    y += 54;
    if (spec.rank !== null) {
      text(
        `of ${spec.rankedTotal} ranked`,
        W - PAD,
        y,
        GREY,
        font(400, 28),
        'right',
      );
    }
    text(
      `Overall · 50 is average · measured by ${spec.covered} of ${spec.coverable} boards`,
      PAD,
      y,
      GREY,
      font(400, 28),
    );
  } else {
    text('Not ranked', PAD, y, WHITE, font(700, 104));
    y += 54;
    text(
      spec.estimate
        ? `Looks like ${spec.estimate.words} ${spec.estimate.score.toFixed(1)}${spec.estimate.position ? `, around #${spec.estimate.position} if ranked` : ''}`
        : spec.unrankedReason,
      PAD,
      y,
      AMBER,
      font(500, 34),
    );
    if (spec.estimate) {
      y += 44;
      text(
        `${spec.unrankedReason} · measured by ${spec.covered} of ${spec.coverable} boards`,
        PAD,
        y,
        GREY,
        font(400, 26),
      );
    }
  }

  // rule
  y += 60;
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(PAD, y, W - PAD * 2, 2);

  // where it stands
  y += 62;
  ctx.letterSpacing = '3px';
  text(
    spec.rows.length
      ? spec.rows.length < spec.domainsTotal
        ? `WHERE IT STANDS · BEST ${spec.rows.length} OF ${spec.domainsTotal} DOMAINS`
        : `WHERE IT STANDS · ${spec.domainsTotal} DOMAINS`
      : 'WHERE IT STANDS',
    PAD,
    y,
    DIM,
    font(600, 18),
  );
  ctx.letterSpacing = '0px';

  const labelW = 380;
  const barX = PAD + labelW + 20;
  const barW = 340;
  const scoreX = barX + barW + 80;
  y += 30;
  if (spec.rows.length === 0) {
    text(
      'No recognised board places this model in a domain yet.',
      PAD,
      y + 48,
      GREY,
      font(400, 28),
    );
  }
  spec.rows.forEach((r, i) => {
    const top = y + i * ROW_H;
    const mid = top + ROW_H / 2;
    if (i > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(PAD, top, W - PAD * 2, 1);
    }
    const scope = fit(
      (t, s) => width(t, font(600, s)),
      r.scope,
      labelW,
      30,
      30,
    );
    text(scope.text, PAD, mid + 10, WHITE, font(600, 30));

    // bar from par, as on the page
    ctx.fillStyle = '#1C1C21';
    ctx.beginPath();
    ctx.roundRect(barX, mid - 10, barW, 20, 5);
    ctx.fill();
    const d = Math.max(-SPAN, Math.min(SPAN, r.score - 50));
    const half = barW / 2;
    const len = Math.max(4, (Math.abs(d) / SPAN) * half);
    if (d >= 0) {
      const g = ctx.createLinearGradient(barX + half, 0, barX + half + len, 0);
      g.addColorStop(0, '#7C5CFF');
      g.addColorStop(1, '#B08BFF');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(barX + half, mid - 10, len, 20, 5);
    } else {
      ctx.fillStyle = '#3E3E48';
      ctx.beginPath();
      ctx.roundRect(barX + half - len, mid - 10, len, 20, 5);
    }
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(barX + half - 1, mid - 14, 2, 28);

    text(
      r.score.toFixed(1),
      scoreX,
      mid + 10,
      INK,
      font(600, 28, MONO),
      'right',
    );
    // Two fixed columns, so "of 46" and "of 345" start under each other.
    const ofX = W - PAD - 104;
    text(`of ${r.total}`, ofX, mid + 10, DIM, font(400, 24, MONO));
    text(
      `#${r.position}`,
      ofX - 14,
      mid + 10,
      r.position <= 3 ? PURPLE : WHITE,
      font(700, 30, MONO),
      'right',
    );
  });

  // footer, anchored to the bottom
  const line = fit(
    (t, s) => width(t, font(500, s)),
    `Snapshot ${spec.day}  ·  ${spec.url}`,
    W - PAD * 2,
    24,
    18,
  );
  text(line.text, PAD, H - PAD - 34, GREY, font(500, line.size));
  text(
    '0–100 on the PublicAI Index scale; 50 is the average of the models each source lists. Scores belong to their publishers.',
    PAD,
    H - PAD,
    DIM,
    font(400, 19),
  );
  return canvas;
}

export async function downloadCard(spec: CardSpec, filename: string) {
  const canvas = await drawCard(spec);
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = filename;
  a.click();
}
