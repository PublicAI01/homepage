import { describe, expect, it } from 'vitest';

import { models as textModels } from '../data';
import { imageData, videoData } from '../data/tracks';
import { cardOf } from './card';
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
