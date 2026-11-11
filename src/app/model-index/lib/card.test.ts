import { describe, expect, it } from 'vitest';

import { models as textModels } from '../data';
import { imageData, videoData } from '../data/tracks';
import { cardCells, cardOf, sanitizeView } from './card';
import { familyOf } from './family';
import { rankModels } from './query';
import { decodeView } from './view-state';

const card = (query: string) => cardOf(decodeView(new URLSearchParams(query)));

describe('cardOf', () => {
  it('draws the track the link was on, not the text index', () => {
    const video = card('track=video');
    const videoIds = new Set(videoData.models.map((m) => m.id));
    expect(video.rows.length).toBeGreaterThan(0);
    for (const m of video.rows) expect(videoIds.has(m.id)).toBe(true);
    expect(video.title).toContain('Video');
    expect(video.generatedAt).toBe(videoData.generatedAt.slice(0, 10));

    const image = card('track=image');
    const imageIds = new Set(imageData.models.map((m) => m.id));
    for (const m of image.rows) expect(imageIds.has(m.id)).toBe(true);
    expect(image.title).toContain('Image');
  });

  it('is the text index by default, titled as before', () => {
    const text = card('');
    const textIds = new Set(textModels.map((m) => m.id));
    expect(text.rows.length).toBeGreaterThan(0);
    for (const m of text.rows) expect(textIds.has(m.id)).toBe(true);
    expect(text.title).toBe(`Top ${text.rows.length} - Overall`);
  });

  it('puts nothing on the card the index does not know', () => {
    // `rank=domain:<any text>` printed that text as the card's title under
    // publicai.io's name (2026-09-20).
    const forged = cardOf({
      ...decodeView(new URLSearchParams('rank=domain:FREE%20TOKENS%20HERE')),
    });
    expect(forged.title).not.toContain('FREE TOKENS');
    expect(forged.title).toContain('Overall');
    const family = cardOf({
      ...decodeView(new URLSearchParams('family=ClickThisLink')),
    });
    expect(family.title).not.toContain('ClickThisLink');
  });

  it('keeps a family filter whose models all sit past the API’s hundred rows', () => {
    // The whitelist was read off rankModels, which caps at 100 rows, so 146
    // of 168 families were "unknown" and their links previewed as the
    // unfiltered Overall top ten (2026-09-21).
    const top = rankModels({ limit: 100, minBoards: 0 });
    if ('error' in top) throw new Error(top.error);
    const seen = new Set(top.models.map((m) => m.family.toLowerCase()));
    const beyond = textModels
      .map((m) => familyOf(m.name))
      .find((f) => !seen.has(f.toLowerCase()));
    expect(beyond).toBeDefined();
    const c = card(`family=${encodeURIComponent(beyond!)}`);
    expect(c.title).toContain(beyond!);
    expect(c.rows.length).toBeGreaterThan(0);
    for (const m of c.rows) expect(m.family).toBe(beyond);
  });
});

describe('cardCells', () => {
  // The social card decided its marks from the link's own view while the
  // rows came from the sanitized one. On `rank=domain:General` — a name
  // the index no longer resolves — the rows were Overall's and the level
  // read "domain", so every unranked row in the top ten printed its
  // estimate as a plain figure (`<=53.4` as `53.4`) and wore the `*` the
  // legend reserves for reports (2026-11-11).
  it('prints an unresolved scope as Overall: estimates marked, no report star', () => {
    const q = 'rank=domain:General&family=Gemma';
    const raw = decodeView(new URLSearchParams(q));
    expect(raw.rank.level).toBe('domain');
    const card = cardOf(raw);
    expect(card.view.rank).toEqual({ level: 'overall' });
    const unranked = card.rows.filter((m) => m.index === null);
    expect(unranked.length).toBeGreaterThan(0);
    for (const m of unranked) {
      const cell = cardCells(card.view.rank.level, m);
      expect(cell.position).not.toContain('*');
      expect(cell.figure).toMatch(/^(~|<=|>=)\d+\.\d$/);
      // The raw view's level is what the route used to read; same rows,
      // wrong marks.
      const wrong = cardCells(raw.rank.level, m);
      expect(wrong.position).toContain('*');
      expect(wrong.figure).toMatch(/^\d+\.\d$/);
    }
    const ranked = card.rows.filter((m) => m.index !== null);
    for (const m of ranked)
      expect(cardCells(card.view.rank.level, m)).toEqual({
        position: String(m.position),
        figure: m.index!.toFixed(1),
        score: m.index,
      });
  });

  it('in a real scope, a report-placed row wears the star and no number', () => {
    const card = cardOf(
      decodeView(new URLSearchParams('rank=domain:Agentic coding&min=0')),
    );
    expect(card.view.rank.level).toBe('domain');
    const starred = card.rows.find((m) => !m.rankedInScope);
    if (starred) {
      const cell = cardCells(card.view.rank.level, starred);
      expect(cell.position).toBe('-*');
      expect(cell.figure).toBe(starred.scopeScore!.toFixed(1));
    }
    const placed = card.rows.find((m) => m.rankedInScope);
    expect(placed).toBeDefined();
    expect(cardCells(card.view.rank.level, placed!)).toEqual({
      position: String(placed!.position),
      figure: placed!.scopeScore!.toFixed(1),
      score: placed!.scopeScore,
    });
  });
});

describe('sanitizeView', () => {
  // The card was gated on 2026-09-20; the page's <title> and og:description
  // read the same `rank=` and `family=` verbatim and unfurled as any text
  // under publicai.io's name (2026-09-22). One gate for every outlet.
  it('drops a scope the index does not know, and canonicalises one it does', () => {
    const forged = sanitizeView(
      decodeView(
        new URLSearchParams(
          'rank=domain:Claim%20your%20prize%20at%20evil.example',
        ),
      ),
    );
    expect(forged.rank).toEqual({ level: 'overall' });
    const lower = sanitizeView(
      decodeView(new URLSearchParams('rank=domain:agentic%20coding')),
    );
    expect(lower.rank).toEqual({
      level: 'domain',
      category: 'Coding',
      domain: 'Agentic coding',
    });
    const category = sanitizeView(
      decodeView(new URLSearchParams('rank=category:FREE%20MONEY')),
    );
    expect(category.rank).toEqual({ level: 'overall' });
  });

  it('drops a family the snapshot does not carry and keeps one it does', () => {
    expect(
      sanitizeView(decodeView(new URLSearchParams('family=FREE%20MONEY')))
        .family,
    ).toBe('all');
    const known = familyOf(textModels[0].name);
    expect(
      sanitizeView(
        decodeView(new URLSearchParams(`family=${encodeURIComponent(known)}`)),
      ).family,
    ).toBe(known);
  });
});
