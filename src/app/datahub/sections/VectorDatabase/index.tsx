'use client';

import Image from 'next/image';

import borderStyles from '@/app/components/AnimatedBorder/AnimatedBorder.module.css';
import styles from '@/app/datahub/sections/VectorDatabase/VectorDatabase.module.css';
import vectorDatabasePicture from '@/assets/image/vector-database-picture.png';
import zeroG from '@/assets/partners/0g.png';
import glacier from '@/assets/partners/glacier.png';
import solana from '@/assets/partners/solana.png';
import audio from '@/assets/svg/audio-type.svg?react';
import earth from '@/assets/svg/earth.svg';
import mapping from '@/assets/svg/mapping-type.svg?react';
import text from '@/assets/svg/text-type.svg?react';
import video from '@/assets/svg/video-type.svg?react';
import { flickerProps } from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';
import Title from '@/components/Title';
import { cn } from '@/utils';

const VectorDatabase = () => {
  return (
    <SectionWrapper
      className="relative lg:mt-40"
      anchorId="database">
      <Image
        className="absolute inset-x-0 -z-1 opacity-40 md:inset-x-[20%] md:-top-[10%] md:w-3/5"
        src={earth}
        height={500}
        alt="decorative earth picture"
        aria-hidden
      />
      <hgroup className="mb-10">
        <h1 className="mb-2 text-center text-3xl font-bold text-white md:text-5xl">
          Application
        </h1>
        <h2 className="text-center text-lg font-bold text-white md:text-3xl">
          Empower your AI with seamless data management
        </h2>
        <h3 className="mt-5 text-center text-xs font-medium text-white max-md:mt-6 md:text-xl">
          Leverage the integration of Vector Database&apos;s rapid data
          retrieval and Data API Suite&apos;s versatile data services to{' '}
          <b
            className={cn(
              styles.typing,
              'text-p1 mx-auto mt-3 block font-bold',
            )}>
            enhance AI applications with precise and actionable insights.
          </b>
        </h3>
      </hgroup>
      <section
        className={cn(
          borderStyles['animated-border'],
          'w-full p-5 lg:px-20 lg:py-16',
        )}>
        <Title className="mx-auto">Vector Database</Title>
        <h3 className="mx-auto mt-7 mb-5 max-w-3xl text-center text-sm font-medium text-white md:mt-14 md:mb-10 md:text-xl">
          A comprehensive collection of datasets meticulously curated to cater
          to a wide array of industries and modalities, providing the foundation
          for AI projects.
        </h3>
        <div className="grid grid-cols-2 flex-col gap-4 lg:grid-cols-4 lg:gap-12 2xl:gap-32">
          {[
            { Icon: text, title: 'Text' },
            { Icon: audio, title: 'Audio' },
            { Icon: video, title: 'Video' },
            { Icon: mapping, title: 'Mapping' },
          ].map((item, index) => (
            <div
              key={index}
              className="frosted-card app-card flex flex-1 flex-col items-center justify-center self-stretch rounded-xl px-6 py-4 md:px-8 md:py-6"
              {...flickerProps}>
              <item.Icon className="size-9 md:size-11" />
              <h4 className="mt-4 text-base font-bold md:text-xl">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
        <div className="frosted-card my-5 rounded-xl px-2 py-5 md:my-14 md:px-7">
          <Image
            className="h-auto w-full"
            src={vectorDatabasePicture}
            height={500}
            alt="publicai vector database process description picture"
            priority
          />
        </div>
        <div className="container flex flex-wrap items-center justify-center gap-6 md:justify-between lg:gap-10 xl:gap-14 2xl:gap-20">
          {[
            { image: solana, name: 'solana' },
            { image: glacier, name: 'glacier' },
            { image: zeroG, name: '0G' },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/5 bg-linear-to-br from-white/15 to-black/5 px-3 py-2.5 backdrop-blur-sm">
              <Image
                className="mx-auto h-9 w-auto md:h-11"
                src={item.image}
                height={44}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
};

export default VectorDatabase;
