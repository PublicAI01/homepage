import fs from 'fs';
import path from 'path';
import { cache } from 'react';

import type { BlogData } from '@/app/blog/type';

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

async function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(
      (file) =>
        new Promise<BlogData>(async (resolve, reject) => {
          try {
            const slug = path.basename(file, path.extname(file));
            const { default: MDX, metadata } = await import(
              `@/app/blog/posts/${slug}.mdx`
            );
            const stats = await fs.promises.stat(path.join(dir, file));
            const publishedAt = stats.ctime.toISOString();
            const lastUpdated = stats.mtime.toISOString();

            resolve({
              metadata: {
                ...metadata,
                publishedAt: metadata.publishedAt ?? publishedAt,
                lastUpdated,
              },
              slug,
              MDX,
            });
          } catch (error) {
            reject(error);
          }
        }),
    ),
  );
}

export const getBlogPosts = cache(function fn() {
  return getMDXData(path.join(process.cwd(), 'src', 'app', 'blog', 'posts'));
});
