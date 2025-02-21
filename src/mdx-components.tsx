import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import React from 'react';

import { shimmer, toBase64 } from '@/utils';

function handleLink(href?: string) {
  if (!href) {
    return href;
  }

  try {
    const url = new URL(href);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set('utm_source', 'homepage');
    url.search = searchParams.toString();
    return url.toString();
  } catch {
    return undefined;
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
  const { alt, ...rest } = props;

  return (
    <Image
      className="mx-auto rounded-lg"
      alt={alt}
      width={700}
      height={394}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 394))}`}
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

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    img: RoundedImage,
    a: CustomLink,
    ...components,
  };
}
