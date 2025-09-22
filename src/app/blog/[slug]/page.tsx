import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBlogPosts } from '@/app/blog/utils';
import AsSeenIn from '@/app/components/AsSeenIn';
import { baseUrl } from '@/app/sitemap';
import ArrowLeft from '@/assets/svg/arrow-left.svg?react';
import ScrollToTop from '@/components/ScrollToTop';
import { formatDate } from '@/utils';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const post = (await getBlogPosts()).find((post) => post.slug === slug);
  if (!post) {
    return {};
  }

  const {
    title,
    publishedAt: publishedTime,
    lastUpdated: modifiedTime,
    summary: description,
    image,
  } = post.metadata;
  const ogImage = image
    ? `${baseUrl}${image}`
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      modifiedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = (await getBlogPosts()).find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ScrollToTop />
      <section className="mx-auto mb-6 flex max-w-[85ch] flex-col items-center max-md:px-[calc(var(--spacing-mobile-padding-x)*2)] md:mb-10">
        <Link
          className="my-2 self-start"
          href="/blog"
          aria-label="return to blog list">
          <ArrowLeft className="h-auto w-6 text-neutral-200 md:w-8" />
        </Link>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.lastUpdated,
              description: post.metadata.summary,
              image: post.metadata.image
                ? `${baseUrl}${post.metadata.image}`
                : `/og?title=${encodeURIComponent(post.metadata.title)}`,
              url: `${baseUrl}/blog/${post.slug}`,
              author: {
                '@type': 'Organization',
                name: 'PublicAI',
                url: baseUrl,
                logo: {
                  '@type': 'ImageObject',
                  url: `${baseUrl}/favicon.ico`,
                  height: '32',
                  width: '32',
                },
              },
            }),
          }}
        />
        <dl>
          <dt className="visually-hidden">Published on</dt>
          <dd className="text-base leading-6 font-medium text-gray-400">
            <time dateTime={post.metadata.publishedAt}>
              {formatDate(post.metadata.publishedAt)}
            </time>
          </dd>
        </dl>
        <h1 className="text-center text-xl font-extrabold tracking-tight text-gray-100 sm:text-2xl md:text-3xl">
          {post.metadata.title}
        </h1>
        <article className="prose prose-invert prose-figcaption:text-center max-w-[85ch]!">
          <post.MDX />
        </article>
        <dl className="my-8 flex w-full items-center gap-2 italic">
          <dt className="text-base font-light text-gray-400">
            Last updated on
          </dt>
          <dd className="text-base leading-6 font-medium text-gray-400">
            <time dateTime={post.metadata.lastUpdated}>
              {new Date(post.metadata.lastUpdated).toLocaleString('en')}
            </time>
          </dd>
        </dl>
        {post.metadata.slugs && <AsSeenIn slugs={post.metadata.slugs} />}
      </section>
    </>
  );
}

export const dynamicParams = false;
