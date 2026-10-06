/**
 * What the site-wide social card may say.
 *
 * The card took `?title=` and drew whatever it was given beside the
 * PublicAI mark, so `publicai.io/og?title=Claim your airdrop at …` was an
 * official-looking image anyone could mint (2026-10-06) — the hole closed
 * on the index's own card on 2026-09-20 and reopened by this one six days
 * later. The text now has to be the site's own: a page title listed here,
 * or the title of a published post, looked up by its slug. Anything else
 * gets the default card.
 */
export const DEFAULT_TITLE = 'PublicAI';

/** Pages with no post behind them. A page links its card through `cardUrl`. */
export const PAGE_TITLES = ['How the PublicAI Index is built'] as const;

const SLUG = /^[a-z0-9][a-z0-9-]*$/;

export async function cardTitle(
  params: URLSearchParams,
  /** The title of the post with this slug; throws or returns nothing when there is none. */
  postTitle: (slug: string) => Promise<string | undefined>,
): Promise<string> {
  const title = params.get('title');
  if (title !== null && (PAGE_TITLES as readonly string[]).includes(title))
    return title;
  const slug = params.get('post');
  if (slug === null || !SLUG.test(slug)) return DEFAULT_TITLE;
  try {
    return (await postTitle(slug)) || DEFAULT_TITLE;
  } catch {
    return DEFAULT_TITLE;
  }
}

export const cardUrl = (title: (typeof PAGE_TITLES)[number]) =>
  `https://publicai.io/og?title=${encodeURIComponent(title)}`;
