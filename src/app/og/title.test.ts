import { describe, expect, it } from 'vitest';

import { cardTitle, cardUrl, DEFAULT_TITLE, PAGE_TITLES } from './title';

const q = (params: Record<string, string>) => new URLSearchParams(params);
const posts = async (slug: string) => {
  if (slug !== 'the-human-loop-is-live') throw new Error('Cannot find module');
  return 'The Human Loop Is Live';
};

describe('cardTitle', () => {
  it('never draws text the caller supplied', async () => {
    // The card printed any `title` beside the PublicAI mark (2026-10-06).
    expect(
      await cardTitle(
        q({ title: 'Claim your airdrop at evil.example' }),
        posts,
      ),
    ).toBe(DEFAULT_TITLE);
    expect(await cardTitle(q({ post: 'no-such-post' }), posts)).toBe(
      DEFAULT_TITLE,
    );
    expect(await cardTitle(q({}), posts)).toBe(DEFAULT_TITLE);
  });

  it('asks for a post only by something shaped like a slug', async () => {
    const asked: string[] = [];
    const spy = async (slug: string) => (asked.push(slug), 'x');
    for (const post of ['../../../package', 'A Title', '', 'a/b'])
      expect(await cardTitle(q({ post }), spy)).toBe(DEFAULT_TITLE);
    expect(asked).toEqual([]);
  });

  it('draws the site’s own titles', async () => {
    expect(await cardTitle(q({ post: 'the-human-loop-is-live' }), posts)).toBe(
      'The Human Loop Is Live',
    );
    for (const title of PAGE_TITLES) {
      const params = new URL(cardUrl(title)).searchParams;
      expect(await cardTitle(params, posts)).toBe(title);
    }
  });
});
