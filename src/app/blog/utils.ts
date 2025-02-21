import fs from 'fs';
import type { MDXContent } from 'mdx/types';
import path from 'path';
import { cache } from 'react';

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

async function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(
      (file) =>
        new Promise<{
          metadata: Metadata;
          slug: string;
          MDX: MDXContent;
        }>(async (resolve, reject) => {
          try {
            const slug = path.basename(file, path.extname(file));
            const { default: MDX, metadata } = await import(
              `@/app/blog/posts/${slug}.mdx`
            );

            resolve({ metadata, slug, MDX });
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

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = '';

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = 'Today';
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
