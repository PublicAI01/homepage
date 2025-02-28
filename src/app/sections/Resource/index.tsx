'use client';

import { YouTubeEmbed } from '@next/third-parties/google';
import Link from 'next/link';

import styles from '@/app/sections/Resource/Resource.module.css';
import developmentDoc from '@/assets/svg/development-doc.svg?react';
import dune from '@/assets/svg/dune.svg?react';
import productGuideline from '@/assets/svg/product-guideline.svg?react';
import { flickerProps } from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';
import { DOCS_LINK, DUNE_LINK, GITHUB_LINK } from '@/constant';
import { cn } from '@/utils';

const Resource = () => {
  return (
    <SectionWrapper
      title="Resource"
      anchorId="resource">
      <section className="mt-6 flex w-full flex-col items-center justify-center gap-6 md:mt-16 md:flex-row md:gap-12 lg:gap-28 lg:px-20">
        {[
          {
            Icon: productGuideline,
            title: 'Product Guideline',
            link: DOCS_LINK,
          },
          {
            Icon: developmentDoc,
            title: 'Development Doc',
            link: GITHUB_LINK,
          },
          {
            Icon: dune,
            title: 'Dune',
            link: DUNE_LINK,
          },
        ].map((item, index) => (
          <Link
            key={index}
            className="frosted-card app-card flex size-full flex-col items-center justify-center rounded-xl pt-7 pb-4"
            href={item.link}
            target="_blank"
            rel="external noreferrer"
            aria-label={`${item.title} link`}
            {...flickerProps}>
            <item.Icon className="size-10" />
            <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
          </Link>
        ))}
      </section>
      <div
        className={cn(
          styles['youtube-container'],
          'bg-b3 mt-8 h-auto overflow-hidden rounded-xl md:mt-28 lg:h-[600px]',
        )}>
        <YouTubeEmbed videoid="i0U8uaUrILs" />
      </div>
    </SectionWrapper>
  );
};

export default Resource;
