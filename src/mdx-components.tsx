import { YouTubeEmbed } from '@next/third-parties/google';
import type { MDXComponents } from 'mdx/types';
import Image, { type ImageProps } from 'next/image';
import Link from 'next/link';
import React from 'react';

import { baseUrl } from '@/app/sitemap';
import { shimmer, toBase64 } from '@/utils';

function handleLink(href?: string) {
  if (!href) {
    return href;
  }

  const isOriginallyAbsolute = /^(?:[a-z]+:)?\/\//i.test(href);

  try {
    const url = new URL(href, baseUrl);

    const searchParams = new URLSearchParams(url.search);
    searchParams.set('utm_source', 'homepage');
    url.search = searchParams.toString();

    if (isOriginallyAbsolute) {
      return url.toString();
    } else {
      return url.pathname + url.search + url.hash;
    }
  } catch {
    return href;
  }
}

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href: link, ...rest } = props;
  const href = handleLink(link);

  if (href?.startsWith('/')) {
    return (
      <Link
        href={href}
        {...rest}
      />
    );
  }

  if (href?.startsWith('#')) {
    return (
      <a
        href={href}
        {...rest}
      />
    );
  }

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...rest}
    />
  );
}

function RoundedImage(props: ImageProps) {
  const { alt = '', width = 700, height = 394, ...rest } = props;
  const [, ext] = (props.src ?? '').toString().split('.');

  return (
    <Image
      className="mx-auto rounded-lg"
      alt={alt}
      width={width}
      height={height}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
      unoptimized={ext.toLocaleLowerCase() === 'gif'}
      {...rest}
    />
  );
}

function slugify(str: React.ReactNode) {
  return str
    ?.toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(children);
    return React.createElement(`h${level}`, { id: slug }, [
      React.createElement(
        'a',
        {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor no-underline',
        },
        children,
      ),
    ]);
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

function YouTube(props: { id?: string }) {
  if (!props.id) {
    return <></>;
  }

  return (
    <YouTubeEmbed
      {...{
        class:
          'w-full h-auto max-w-none! rounded-lg overflow-hidden 2xl:mt-8 xl:mt-7 lg:mt-6 md:mt-5 mt-4',
      }}
      videoid={props.id}
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    img: RoundedImage,
    Image: RoundedImage,
    a: CustomLink,
    YouTube,
    ...components,
  };
}
