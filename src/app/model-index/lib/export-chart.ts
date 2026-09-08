/**
 * A bar chart of the rows on screen, drawn to a canvas and saved as PNG.
 * Client-only. Muted palette on a solid ground, so it drops into a slide or
 * a paper without shouting; the snapshot date and URL are printed on it so
 * the figure stays citable once it leaves the page.
 */
export interface ChartRow {
  rank: number | null;
  name: string;
  org: string;
  score: number;
  covered: number;
  coverable: number;
}

export interface ChartSpec {
  title: string;
  scope: string;
  rows: ChartRow[];
  generatedAt: string;
  url: string;
}

/* Portrait, not landscape: the chart is made to be posted, and a wide image
   on a phone timeline scales down until the model names are unreadable. At
   1200x1500 it is 4:5 — the tallest X shows without cropping — and twenty
   rows fill it rather than ten floating in white space. */
const W = 1200;
const PAD = 56;
const ROW_H = 58;
/** The mark ships white: loaded as an <img>, its currentColor would go black. */
const LOGO = '/publicai-mark-white.svg';
const LOGO_W = 224;
const ONE_LINER =
  "The LLM benchmark aggregator \u2014 the world's most comprehensive and robust LLM index.";
const FONT = '"Inter", "Helvetica Neue", Arial, sans-serif';
const MONO = '"JetBrains Mono", "SF Mono", Menlo, monospace';

/** The mark, loaded once per export. Same-origin, so the canvas stays clean. */
function loadMark(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = LOGO;
  });
}

export async function drawChart(spec: ChartSpec): Promise<HTMLCanvasElement> {
  const { rows } = spec;
  const mark = await loadMark();
  const H = PAD * 2 + 160 + rows.length * ROW_H + 36;
  const canvas = document.createElement('canvas');
  const dpr = 2;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);

  // ground
  ctx.fillStyle = '#0B0B0D';
  ctx.fillRect(0, 0, W, H);

  // Brand lockup, top right: the mark with INDEX set under it, the way a
  // chart that will be screenshotted and reposted has to carry its source.
  if (mark) {
    const h = (mark.height / mark.width) * LOGO_W || LOGO_W / 4;
    ctx.drawImage(mark, W - PAD - LOGO_W, PAD - 14, LOGO_W, h);
    ctx.fillStyle = '#B08BFF';
    ctx.font = `700 30px ${FONT}`;
    ctx.letterSpacing = '4px';
    ctx.textAlign = 'right';
    ctx.fillText('INDEX', W - PAD, PAD + h + 20);
    ctx.letterSpacing = '0px';
    ctx.textAlign = 'left';
  }

  // header
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 34px ${FONT}`;
  ctx.fillText(spec.title, PAD, PAD + 24);
  ctx.fillStyle = '#B9B7C4';
  ctx.font = `400 15px ${FONT}`;
  ctx.fillText(ONE_LINER, PAD, PAD + 52);
  ctx.fillStyle = '#9C9AA8';
  ctx.font = `400 13px ${FONT}`;
  ctx.fillText(
    `Ranked by ${spec.scope} · 0–100 standardized, 50 = average of the models each source lists · snapshot ${spec.generatedAt.slice(0, 10)}`,
    PAD,
    PAD + 76,
  );

  // bars
  const labelW = 330;
  const x0 = PAD + labelW;
  const barMax = W - PAD - x0 - 150;
  const top = PAD + 140;
  // The axis starts a tick below the lowest bar, not at zero: on a 0–100
  // scale where the top ten sit within ten points, a zero-based axis would
  // hide the very differences the chart is for. Ticks are labelled so the
  // truncation is visible.
  const scores = rows.map((r) => r.score);
  const max = Math.max(...scores, 1);
  const min = Math.min(...scores);
  const floor = Math.max(0, Math.floor((min - 5) / 10) * 10);
  const span = Math.max(1, Math.ceil((max + 2) / 10) * 10 - floor);

  // gridlines
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.fillStyle = '#6F6D7A';
  ctx.font = `400 12px ${MONO}`;
  for (let v = floor; v <= floor + span; v += 10) {
    const x = x0 + ((v - floor) / span) * barMax;
    ctx.beginPath();
    ctx.moveTo(x, top - 12);
    ctx.lineTo(x, top + rows.length * ROW_H);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillText(String(v), x, top - 18);
  }
  ctx.textAlign = 'left';

  rows.forEach((r, i) => {
    const y = top + i * ROW_H;
    ctx.fillStyle = '#6F6D7A';
    ctx.font = `500 15px ${MONO}`;
    ctx.fillText(r.rank ? String(r.rank) : '—', PAD, y + 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `600 17px ${FONT}`;
    const name = r.name.length > 30 ? `${r.name.slice(0, 29)}…` : r.name;
    ctx.fillText(name, PAD + 44, y + 30);
    const nameW = ctx.measureText(name).width;
    ctx.fillStyle = '#9C9AA8';
    ctx.font = `400 14px ${FONT}`;
    ctx.fillText(r.org, PAD + 44 + nameW + 10, y + 30);

    const w = ((r.score - floor) / span) * barMax;
    ctx.fillStyle = r.rank
      ? 'rgba(142,139,255,0.85)'
      : 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.roundRect(x0, y + 12, Math.max(4, w), 26, 4);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `600 16px ${MONO}`;
    ctx.fillText(r.score.toFixed(1), x0 + Math.max(4, w) + 12, y + 31);
    ctx.fillStyle = '#6F6D7A';
    ctx.font = `400 12px ${MONO}`;
    ctx.textAlign = 'right';
    ctx.fillText(`${r.covered}/${r.coverable} boards`, W - PAD, y + 31);
    ctx.textAlign = 'left';
  });

  // footer
  ctx.fillStyle = '#6F6D7A';
  ctx.font = `400 13px ${FONT}`;
  ctx.fillText(
    `Scores belong to their publishers; PublicAI normalizes and weights them. Provisional rows (no rank) are scored by fewer boards. ${spec.url}`,
    PAD,
    H - PAD + 30,
  );
  return canvas;
}

export async function downloadChart(spec: ChartSpec, filename: string) {
  const canvas = await drawChart(spec);
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = filename;
  a.click();
}
