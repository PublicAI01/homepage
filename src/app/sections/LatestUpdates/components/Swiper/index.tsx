'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import type { SimpleBlogData } from '@/app/blog/type';
import EmblaCarousel from '@/app/components/EmblaCarousel';
import { useMediaQuery } from '@/app/hooks';
import { chunk, cn, formatDate, shimmer, toBase64 } from '@/utils';

const Swiper = (props: { blogs: SimpleBlogData[] }) => {
  const { blogs } = props;

  const blogsGroup = useMemo(
    () =>
      chunk(
        blogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .slice(0, 9),
        3,
      ),
    [blogs],
  );

  const isMobile = useMediaQuery('(max-width: 1024px)');
  const allBlogs = useMemo(() => {
    if (isMobile) {
      return blogsGroup[0];
    }
    return blogsGroup;
  }, [blogsGroup, isMobile]);

  return (
    <EmblaCarousel<SimpleBlogData | SimpleBlogData[]>
      className="mt-9 md:w-9/10"
      options={{ loop: true }}
      slides={allBlogs}
      slideClassName="max-lg:flex-[0_0_70%] self-stretch"
      slideBuilder={(item, index) => {
        const isArray = Array.isArray(item);
        return (
          <section
            className={cn(
              'grid h-full grid-cols-3 gap-2 md:gap-7',
              isArray ? 'grid-cols-3' : 'grid-cols-1',
            )}
            aria-label={`group ${index + 1} of blogs`}>
            {isArray ? (
              item.map((post) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                />
              ))
            ) : (
              <BlogCard post={item} />
            )}
          </section>
        );
      }}
    />
  );
};

const BlogCard = (
  props: Omit<
    React.ComponentProps<typeof Link>,
    'href' | 'aria-label' | 'children'
  > & { post: SimpleBlogData },
) => {
  const { className, post, ...rest } = props;

  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={`check out the blog "${post.metadata.title}"`}
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-white p-2 md:gap-2 md:p-5',
        className,
      )}
      {...rest}>
      {post.metadata.image && (
        <Image
          className="aspect-video w-full rounded-md object-cover"
          width={160}
          height={90}
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(160, 90))}`}
          src={post.metadata.image}
          alt={`${post.metadata.title} cover picture`}
        />
      )}
      <time
        dateTime={post.metadata.publishedAt}
        className="text-p1 text-xs tabular-nums md:text-base">
        {formatDate(post.metadata.publishedAt)}
      </time>
      <h3
        className="truncate text-sm font-semibold tracking-tight text-white md:text-2xl"
        title={post.metadata.title}>
        {post.metadata.title}
      </h3>
      <p
        className="text-g1 line-clamp-2 text-xs md:text-base"
        title={post.metadata.summary}>
        {post.metadata.summary}
      </p>
    </Link>
  );
};

export default Swiper;
