import type { MDXContent } from 'mdx/types';

type Metadata = {
  title: string;
  publishedAt: string;
  lastUpdated: string;
  summary: string;
  image?: string;
  /**
   * Markets Insider
   * Yahoo! Finance
   * Associated Press
   * MarketWatch
   */
  slugs?: [string, string, string, string];
};

type BlogData = {
  metadata: Metadata;
  slug: string;
  MDX: MDXContent;
};

type SimpleBlogData = Omit<BlogData, 'MDX'>;

export type { BlogData, SimpleBlogData };
