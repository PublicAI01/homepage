'use client';

import clsx from 'clsx';
import Image from 'next/image';
import type { CSSProperties } from 'react';

import styles from '@/app/products/sections/VectorDatabase/VectorDatabase.module.css';
import aboutStyles from '@/app/sections/About/About.module.css';
import audio from '@/assets/svg/audio-type.svg?react';
import earth from '@/assets/svg/earth.svg';
import mapping from '@/assets/svg/mapping-type.svg?react';
import text from '@/assets/svg/text-type.svg?react';
import video from '@/assets/svg/video-type.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import SectionWrapper from '@/components/SectionWrapper';
import Title from '@/components/Title';

const VectorDatabase = () => {
  return (
    <SectionWrapper className="relative lg:mt-40">
      <Image
        className="-top-[10%] w-3/5 absolute inset-x-[20%]"
        src={earth}
        alt="decorative earth picture"
        aria-hidden
      />
      <div className="mb-10">
        <h3 className="text-xl font-bold text-center text-white md:text-4xl">
          Application
        </h3>
        <h4 className="my-2 text-2xl font-bold text-center text-white">
          Empower your AI with seamless data management.
        </h4>
        <h5 className="text-xl font-medium text-center text-white">
          Leverage the integration of Vector Database&apos;s rapid data
          retrieval and Data API Suite&apos;s versatile data services to{' '}
          <b className={clsx(styles.typing, 'font-bold text-p1 block mx-auto')}>
            enhance AI applications with precise and actionable insights.
          </b>
        </h5>
      </div>
      <section
        className={clsx(
          aboutStyles['animate-border'],
          'w-full p-5 mt-8 lg:px-20 lg:py-16',
        )}>
        <Title className="mx-auto">Vector Database</Title>
        <h4 className="mx-auto max-w-3xl mt-14 mb-5 text-sm font-medium text-center text-white md:mb-10 md:text-xl">
          A comprehensive collection of datasets meticulously curated to cater
          to a wide array of industries and modalities, providing the foundation
          for AI projects.
        </h4>
        <div className="grid flex-col grid-cols-2 gap-4 2xl:gap-32 lg:grid-cols-4 lg:gap-12">
          {[
            { Icon: text, title: 'Text' },
            { Icon: audio, title: 'Audio' },
            { Icon: video, title: 'Video' },
            { Icon: mapping, title: 'Mapping' },
          ].map((item, index) => (
            <article
              key={index}
              className={clsx(
                cardStyles.card,
                'rounded-xl frosted-card transition-colors hover:bg-white py-4 px-6 md:py-6 md:px-8 flex-1 self-stretch flex flex-col items-center justify-center',
              )}
              style={
                {
                  '--duration': '0.4',
                } as CSSProperties
              }
              onMouseEnter={(e) => {
                e.currentTarget.classList.remove('animate-card-flicker');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.add('animate-card-flicker');
              }}>
              <item.Icon className="size-9 md:size-11" />
              <h5 className="mt-4 text-lg font-bold transition-colors md:text-xl">
                {item.title}
              </h5>
            </article>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
};

export default VectorDatabase;
