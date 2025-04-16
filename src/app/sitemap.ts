import { MetadataRoute } from 'next';

import { getBlogPosts } from '@/app/blog/utils';

export const baseUrl = 'https://publicai.io';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/datahub',
    '/datahunter',
    '/blog',
    '/official-verification',
    '/privacy',
    '/terms',
  ].map<MetadataRoute.Sitemap[number]>((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly',
  }));

  const blogs = (await getBlogPosts()).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  return [...routes, ...blogs];
}
