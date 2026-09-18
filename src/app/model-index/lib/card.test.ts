import { describe, expect, it } from 'vitest';

import { models as textModels } from '../data';
import { imageData, videoData } from '../data/tracks';
import { cardOf } from './card';
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
});
