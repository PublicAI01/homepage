import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { diff, type HistoryEntry } from '../src/app/model-index/lib/diff.ts';

/**
 * Index Weekly, as HTML and Markdown, from the last seven days of history:
 *
 *   node scripts/index-digest.ts [--since YYYY-MM-DD] [--out dir]
 *
 * Writes digest.html and digest.md. The refresh repository's weekly job
 * sends the HTML through Resend as a broadcast to the Audience; the
 * Markdown is for the changelog. Nothing here reads the network.
 */
const args = process.argv.slice(2);
const opt = (k: string) => {
  const i = args.indexOf(k);
  return i === -1 ? undefined : args[i + 1];
};
const DIR = join(process.cwd(), 'src', 'app', 'model-index', 'data');
const OUT = opt('--out') ?? process.cwd();
const history = JSON.parse(
  await readFile(join(DIR, 'history.json'), 'utf8'),
) as {
  entries: HistoryEntry[];
};
const entries = history.entries;
const to = entries[entries.length - 1];
const sinceDate =
  opt('--since') ??
  new Date(Date.parse(to.date) - 7 * 86400_000).toISOString().slice(0, 10);
const before = entries.filter((e) => e.date <= sinceDate);
const from = before[before.length - 1] ?? entries[0];
const c = diff(from, to, sinceDate, 3, entries);

const top = Object.entries(to.models)
  .filter(([, m]) => m.rank !== null)
  .sort((a, b) => a[1].rank! - b[1].rank!)
  .slice(0, 10);

const url = 'https://publicai.io/model-index';
// The MCP endpoint speaks JSON-RPC over POST, so a reader who clicks it
// in a mail client gets "Method not allowed". Send people to the page that
// explains it; the endpoint itself belongs in a config file, not a link.
const MCP_DOCS =
  'https://docs.publicai.io/publicai-documentation/publicai-index/mcp';
const line = (m: (typeof c.models)[number]) =>
  m.kind === 'moved'
    ? `${m.name} ${m.delta! > 0 ? '↑' : '↓'} ${Math.abs(m.delta!)} → #${m.rank}`
    : m.kind === 'ranked'
      ? `${m.name} enters the Overall ranking at #${m.rank}`
      : m.kind === 'entered'
        ? `${m.name} (${m.org}) listed`
        : `${m.name} no longer listed`;

const md = `# PublicAI Index Weekly — ${to.date}

Changes since ${c.since} (${c.snapshots} snapshot${c.snapshots === 1 ? '' : 's'}).

## Top 10 Overall
${top.map(([, m]) => `${m.rank}. ${m.name} — ${m.index}`).join('\n')}

## Movers
${
  c.models
    .filter((m) => m.kind === 'moved' || m.kind === 'ranked')
    .map(line)
    .map((l) => `- ${l}`)
    .join('\n') || '- No moves of three places or more.'
}

## New this week
${
  c.models
    .filter((m) => m.kind === 'entered')
    .slice(0, 20)
    .map(line)
    .map((l) => `- ${l}`)
    .join('\n') || '- No new models.'
}
${c.newSources.length ? `\n## New sources\n${c.newSources.map((s) => `- ${s}`).join('\n')}\n` : ''}
[Open the Index](${url}) · [RSS](${url}/feed.xml) · [MCP for agents](${MCP_DOCS})

Scores are 0–100 standardized; 50 is the average of the models each source lists. Scores belong to their publishers; PublicAI normalizes and weights them.
`;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = `<!doctype html><html><body style="margin:0;background:#0B0B0D;color:#fff;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 24px">
<p style="font-size:12px;letter-spacing:3px;color:#8E8BFF;margin:0 0 8px">PUBLICAI INDEX WEEKLY</p>
<h1 style="font-size:24px;margin:0 0 6px">Snapshot ${to.date}</h1>
<p style="color:#8E8BA0;margin:0 0 24px">Changes since ${c.since}.</p>
<img src="${url}/og" width="552" alt="Top ten on the PublicAI Index" style="width:100%;border-radius:12px;margin-bottom:24px">
<h2 style="font-size:16px;margin:0 0 8px">Top 10 Overall</h2>
<ol style="padding-left:20px;margin:0 0 24px;color:#D9D7E0">${top.map(([, m]) => `<li>${esc(m.name)} <span style="color:#8E8BA0">${m.index}</span></li>`).join('')}</ol>
<h2 style="font-size:16px;margin:0 0 8px">Movers</h2>
<ul style="padding-left:20px;margin:0 0 24px;color:#D9D7E0">${
  c.models
    .filter((m) => m.kind === 'moved' || m.kind === 'ranked')
    .map((m) => `<li>${esc(line(m))}</li>`)
    .join('') || '<li>No moves of three places or more.</li>'
}</ul>
<h2 style="font-size:16px;margin:0 0 8px">New this week</h2>
<ul style="padding-left:20px;margin:0 0 24px;color:#D9D7E0">${
  c.models
    .filter((m) => m.kind === 'entered')
    .slice(0, 20)
    .map((m) => `<li>${esc(line(m))}</li>`)
    .join('') || '<li>No new models.</li>'
}</ul>
${c.newSources.length ? `<h2 style="font-size:16px;margin:0 0 8px">New sources</h2><ul style="padding-left:20px;margin:0 0 24px;color:#D9D7E0">${c.newSources.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
<p><a href="${url}" style="color:#B08BFF">Open the Index</a> · <a href="${url}/feed.xml" style="color:#B08BFF">RSS</a> · <a href="${MCP_DOCS}" style="color:#B08BFF">MCP for agents</a></p>
<p style="font-size:12px;color:#6F6D7A;margin-top:32px">Scores are 0–100 standardized; 50 is the average of the models each source lists. Scores belong to their publishers; PublicAI normalizes and weights them. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#6F6D7A">Unsubscribe</a></p>
</div></body></html>`;

await writeFile(join(OUT, 'digest.md'), md);
await writeFile(join(OUT, 'digest.html'), html);
console.log(
  `digest: ${to.date} since ${c.since}; ${c.models.length} change(s), ${c.newSources.length} new source(s)`,
);
