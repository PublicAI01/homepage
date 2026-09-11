import { describe, expect, it } from 'vitest';

import { models } from '../data';
import { headlineTaxonomy, positionIn, rankModels } from '../lib/query';
import { GET } from './route';

const svgFor = (query: string) =>
  GET(new Request(`https://publicai.io/model-index/badge?${query}`)).text();

/** A scope with more rows than the API returns, and a model placed past that cap. */
function beyondTheCap() {
  for (const [, domains] of headlineTaxonomy())
    for (const domain of domains) {
      const scope = `domain:${domain}`;
      for (const m of models) {
        const row = positionIn(m.id, { scope, minBoards: 0 });
        if (row && row.position !== null && row.position > 100)
          return { scope, id: m.id, row };
      }
    }
  return null;
}

describe('positionIn', () => {
  it('agrees with rankModels on every row the API returns', () => {
    const scope = 'domain:Agentic coding';
    const list = rankModels({ scope, minBoards: 0, limit: 100 });
    if ('error' in list) throw new Error(list.error);
    for (const m of list.models) {
      const row = positionIn(m.id, { scope, minBoards: 0 });
      expect(row?.position).toBe(m.position);
      expect(row?.scopeScore).toBe(m.scopeScore);
      expect(row?.rankedInScope).toBe(m.rankedInScope);
    }
    expect(positionIn('no-such-model', { scope })).toBeNull();
    expect(positionIn(list.models[0].id, { scope: 'zzz' })).toBeNull();
  });
});

describe('badge', () => {
  it('prints the measured position of a model the API’s first hundred rows do not reach', async () => {
    // The snapshot lists several hundred models in the wide scopes, so a
    // real model sits past the cap. The badge used to answer "not scored".
    const found = beyondTheCap();
    expect(found).not.toBeNull();
    const { scope, id, row } = found!;
    const svg = await svgFor(
      `model=${encodeURIComponent(id)}&scope=${encodeURIComponent(scope)}`,
    );
    expect(svg).not.toContain('not scored');
    expect(svg).toContain(`#${row.position}`);
  });

  it('says a scope is unknown rather than denying a listed model', async () => {
    const svg = await svgFor(`model=${models[0].id}&scope=zzz-not-a-scope`);
    expect(svg).toContain('unknown scope');
    expect(svg).not.toContain('not listed');
    expect(svg).toContain(models[0].name.replace(/&/g, '&amp;'));
  });
});
