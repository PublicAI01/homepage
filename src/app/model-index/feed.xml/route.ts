import { changesSince, snapshots } from '../lib/changes';
import { INDEX_URL } from '../lib/query';

/**
 * One item per snapshot: what changed since the previous one. Readers,
 * Slack, n8n and the like subscribe to this; no account, no key.
 */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET() {
  const dates = snapshots();
  const items = dates
    .slice(1)
    .reverse()
    .slice(0, 30)
    .map((date, i, arr) => {
      const prev = dates[dates.indexOf(date) - 1];
      const c = changesSince(prev, 3, date);
      const lines = [
        c.newSources.length ? `New sources: ${c.newSources.join(', ')}.` : '',
        ...c.models
          .slice(0, 15)
          .map((m) =>
            m.kind === 'moved'
              ? `${m.name} ${m.delta! > 0 ? '↑' : '↓'} ${Math.abs(m.delta!)} to #${m.rank}`
              : m.kind === 'ranked'
                ? `${m.name} enters the Overall ranking at #${m.rank}`
                : m.kind === 'unranked'
                  ? `${m.name} leaves the Overall ranking (was #${m.previousRank})`
                  : m.kind === 'entered'
                    ? `${m.name} (${m.org}) listed`
                    : `${m.name} no longer listed`,
          ),
      ].filter(Boolean);
      void i;
      void arr;
      return `<item><title>${esc(`PublicAI Index — snapshot ${date}`)}</title><link>${INDEX_URL}</link><guid isPermaLink="false">publicai-index-${date}</guid><pubDate>${new Date(`${date}T06:00:00Z`).toUTCString()}</pubDate><description>${esc(lines.length ? lines.join(' · ') : 'Snapshot refreshed; no ranking moves of three places or more.')}</description></item>`;
    });
  const first = dates[0]
    ? `<item><title>${esc(`PublicAI Index — first snapshot ${dates[0]}`)}</title><link>${INDEX_URL}</link><guid isPermaLink="false">publicai-index-${dates[0]}</guid><pubDate>${new Date(`${dates[0]}T06:00:00Z`).toUTCString()}</pubDate><description>${esc('History begins.')}</description></item>`
    : '';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>PublicAI Index</title>
<link>${INDEX_URL}</link>
<description>What changed in the LLM benchmark aggregator: new sources, models entering the Overall ranking, moves of three places or more.</description>
<language>en</language>
${items.join('\n')}
${first}
</channel></rss>`;
  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
