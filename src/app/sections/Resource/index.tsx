'use client';

import { YouTubeEmbed } from '@next/third-parties/google';
import clsx from 'clsx';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import styles from '@/app/sections/Resource/Resource.module.css';
import developmentDoc from '@/assets/svg/development-doc.svg?react';
import dune from '@/assets/svg/dune.svg?react';
import productGuideline from '@/assets/svg/product-guideline.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import SectionWrapper from '@/components/SectionWrapper';
import { DOCS_LINK, DUNE_LINK, GITHUB_LINK } from '@/constant';

const Resource = () => {
  return (
    <SectionWrapper
      title="Resource"
      anchorId="resource">
      <section className="w-full flex flex-col justify-center items-center gap-6 mt-6 lg:gap-28 lg:px-20 md:flex-row md:gap-12 md:mt-16">
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
            className={clsx(
              cardStyles.card,
              'flex flex-col pt-7 pb-4 items-center justify-center size-full hover:bg-white rounded-xl frosted-card transition-colors hover:border-white',
            )}
            style={
              {
                '--duration': '0.4',
              } as CSSProperties
            }
            href={item.link}
            target="_blank"
            rel="external noreferrer"
            aria-label={`${item.title} link`}
            onMouseEnter={(e) => {
              e.currentTarget.classList.remove('animate-card-flicker');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.classList.add('animate-card-flicker');
            }}>
            <item.Icon className="size-10 transition-colors" />
            <h3 className="mt-6 text-xl font-bold transition-colors">
              {item.title}
            </h3>
          </Link>
        ))}
      </section>
      <div
        className={clsx(
          styles['youtube-container'],
          'bg-b3 h-auto overflow-hidden mt-8 rounded-xl lg:h-[600px] md:mt-28',
        )}>
        <YouTubeEmbed videoid="i0U8uaUrILs" />
      </div>
    </SectionWrapper>
  );
};

export default Resource;
