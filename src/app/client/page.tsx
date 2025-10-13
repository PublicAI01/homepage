import type { Metadata } from 'next';
import Image from 'next/image';

import Demo1 from '@/assets/image/demo1.png';
import Demo2 from '@/assets/image/demo2.png';
import Demo3 from '@/assets/image/demo3.png';
import BBF from '@/assets/partners/bbf.png';
import Chasm from '@/assets/partners/chasm.png';
import ForesightVentures from '@/assets/partners/foresight-ventures.png';
import G20 from '@/assets/partners/g20.png';
import IBCGroup from '@/assets/partners/ibc-group.png';
import IOBCCapital from '@/assets/partners/iobc-capital.png';
import MHVentures from '@/assets/partners/mh-ventures.png';
import SolanaFoundation from '@/assets/partners/solana-foundation.png';
import Stc from '@/assets/partners/stc.png';
import TAISU from '@/assets/partners/taisu.png';
import AudioWave from '@/assets/svg/audio-wave.svg?react';
import CHASM from '@/assets/svg/chasm.svg?react';
import DataCollection from '@/assets/svg/data-collection.svg?react';
import Earth from '@/assets/svg/earth-pixel.svg?react';
import Flag from '@/assets/svg/flag.svg?react';
import MhVentures from '@/assets/svg/mh-ventures.svg?react';
import Microphone from '@/assets/svg/microphone.svg?react';
import NearFoundation from '@/assets/svg/near-foundation.svg?react';
import Record from '@/assets/svg/record.svg?react';
import Stack from '@/assets/svg/stack.svg?react';
import StcGroup from '@/assets/svg/stc.svg?react';
import Voting from '@/assets/svg/voting-icon.svg?react';
import Button from '@/components/Button';
import SectionWrapper from '@/components/SectionWrapper';
import { BUSINESS_LINK } from '@/constant';
import { cn } from '@/utils';

export const metadata: Metadata = {
  title: 'PublicAI - Web3 AI Data Infrastructure',
  description:
    'PublicAI provides high-quality ASR (Automatic Speech Recognition) and TTS (Text-to-Speech) datasets to improve the accuracy and performance of AI systems, such as speech recognition, voice assistants, and multilingual AI applications.',
  keywords:
    'PublicAI, AI data, human-centric AI, ASR datasets, TTS datasets, speech recognition, voice assistants, multilingual AI, AI performance, AI accuracy, translations, Multilingual speech synthesis, dubbing',
};

export default function Client() {
  const sectionClassName =
    'max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))] container mx-auto';
  const marginClassName = '2xl:my-14 xl:my-12 lg:my-10 md:my-8 my-6';
  return (
    <>
      <section
        className={cn(
          sectionClassName,
          marginClassName,
          'flex flex-col justify-between gap-6 lg:flex-row',
        )}>
        <div className="flex flex-1 flex-col justify-center gap-6 self-stretch">
          <hgroup className="flex flex-col gap-3">
            <h1 className="text-black-alpha-950 text-3xl font-medium text-balance md:text-4xl lg:text-5xl 2xl:text-6xl">
              Unlock the World’s Most Comprehensive ASR
              <sup className="font-light">*</sup> and TTS
              <sup className="font-light">*</sup> Datasets
            </h1>
            <em className="text-black-alpha-600 text-sm font-light md:text-base xl:text-lg">
              *Automatic Speech Recognition and Text-to-Speech
            </em>
          </hgroup>
          <h2 className="text-lg font-medium md:text-xl xl:text-2xl">
            Unlock the Power of Data for Your Business
          </h2>
          <div className="flex items-center gap-4">
            <Button
              className={cn(
                'w-fit text-xs',
                'px-3 py-2 xl:px-3.5 xl:py-2.5 2xl:px-4 2xl:py-3',
              )}
              theme="primary"
              href={BUSINESS_LINK}
              target="_blank"
              aria-label="fill in the business cooperation form">
              Connect with our AI experts
            </Button>
            <Button
              className={cn(
                'w-fit text-xs',
                'px-3 py-2 xl:px-3.5 xl:py-2.5 2xl:px-4 2xl:py-3',
              )}
              target="_blank"
              href="/business.pdf"
              aria-label="to business pdf">
              Power Your AI
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <Image
            className="rounded-10 size-full object-cover lg:rounded-2xl"
            src={Demo1}
            alt="Unlock the Power of Data for Your Business"
            width={750}
            height={500}
          />
        </div>
      </section>

      <section className={cn(sectionClassName, marginClassName, 'py-8')}>
        <ul
          className={cn(
            'flex flex-wrap items-center gap-4 md:gap-6',
            'lg:bg-b2 lg:rounded-2xl lg:border lg:p-6',
          )}>
          {[
            { name: 'Decentralized participants', value: 3500000 },
            { name: 'Multimodal Data Set Samples', value: 9000000 },
            { name: 'Satisfied Applied AI Clients', value: 14 },
            { name: 'Countries', value: 80 },
            { name: 'Hours of Human In The Loop work', value: 1000000 },
          ].map(({ name, value }) => (
            <li
              key={name}
              className={cn(
                'border-black-alpha-700 flex flex-1 flex-col self-stretch lg:not-last:border-r',
                'min-w-30 md:min-w-40',
                'gap-1.5 lg:gap-6 lg:not-last:pr-6',
                'max-lg:bg-b2 max-lg:rounded-10 max-lg:border max-lg:p-3',
              )}>
              <h5 className="font-darker-grotesque text-p1 text-5xl font-semibold lg:text-6xl 2xl:text-7xl">
                {Intl.NumberFormat('en', { notation: 'compact' }).format(value)}
                +
              </h5>
              <p className="text-xs font-normal md:text-base">{name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className={cn(
          sectionClassName,
          marginClassName,
          'p-4 lg:p-6',
          'from-b2/80 to-b2/40 rounded-10 flex flex-col items-center border border-dashed border-white/50 bg-linear-180 backdrop-blur-sm lg:flex-row lg:rounded-2xl',
        )}>
        <h2
          className={cn(
            'border-black-alpha-700 font-medium max-lg:self-stretch',
            'text-xl md:text-2xl lg:text-3xl 2xl:text-4xl',
            'max-lg:mb-4 max-lg:border-b max-lg:pb-4 lg:mr-6 lg:border-r lg:pr-6',
          )}>
          Partners
        </h2>
        <ul className="flex flex-1 flex-wrap items-center justify-around">
          {[
            { title: 'STCGroup', Icon: StcGroup },
            { title: 'MHVentures', Icon: MhVentures },
            { title: 'NEARFoundation', Icon: NearFoundation },
            { title: 'CHASM', Icon: CHASM },
          ].map(({ title, Icon }) => (
            <li key={title}>
              <Icon className="h-12 w-auto md:h-14 lg:h-16 xl:h-18 2xl:h-20" />
            </li>
          ))}
        </ul>
      </section>

      <SectionWrapper
        className="lg:bg-b3 lg:p-6"
        title="Our Solutions"
        titleClassName={marginClassName}>
        <hgroup className="flex flex-col gap-2 text-center text-balance md:gap-4">
          <h3 className="text-p1 text-base font-semibold lg:text-xl xl:text-2xl">
            The World’s Premier Automatic Speech Recognition (ASR) &
            Text-To-Speech (TTS) Dataset Collection
          </h3>
          <h4 className="text-xs font-normal md:text-sm lg:text-lg">
            At <b>PublicAI</b>, we specialize in delivering{' '}
            <b>high-quality Automatic Speech Recognition (ASR)</b> and{' '}
            <b>Text-to-Speech (TTS) datasets</b> designed to power the next
            generation of AI applications.
          </h4>
        </hgroup>

        <div
          className={cn(
            marginClassName,
            'flex w-full flex-col gap-4 lg:flex-row lg:gap-8',
          )}>
          <div className="flex-1">
            <Image
              className="rounded-10 size-full object-cover lg:rounded-2xl"
              src={Demo2}
              alt="Unlock the Power of Data for Your Business"
              width={750}
              height={500}
            />
          </div>
          <ul
            className={cn(
              'border-black-alpha-700 flex flex-1 flex-col justify-between gap-3 self-stretch',
              'max-lg:border-t max-lg:pt-4 lg:border-l lg:pl-8',
            )}>
            {[
              {
                Icon: Earth,
                title: 'Countries & Regions',
                description:
                  'Diverse recordings from Asia, Europe, the Middle East, and the Americas.',
              },
              {
                Icon: Microphone,
                title: 'Languages',
                description: (
                  <>
                    44+ supported, with a core focus on 12 major global
                    languages:{' '}
                    <b className="text-2xl text-white">
                      🇰🇷 🇯🇵 🇬🇧 🇺🇸 🇹🇭 🇩🇪 🇫🇷 🇨🇳 🇮🇹 🇪🇸 🇷🇺 🇦🇪
                    </b>
                  </>
                ),
              },
              {
                Icon: Record,
                title: 'Total Volume',
                description: `${Intl.NumberFormat('en').format(101000)}+ hours of professionally collected and verified audio`,
              },
            ].map(({ Icon, title, description }) => (
              <li
                key={title}
                className={cn(
                  'flex flex-col self-stretch',
                  'gap-2 p-3 md:gap-4 md:p-6',
                  'rounded-10 border border-transparent hover:border-[#858585]',
                  'from-b3/70 to-[#7439ff]/25 hover:bg-linear-36',
                )}>
                <hgroup className="flex items-center gap-2 md:gap-3">
                  <Icon className="h-auto w-6 md:w-8" />
                  <h3 className="text-base font-normal lg:text-xl xl:text-2xl">
                    {title}
                  </h3>
                </hgroup>
                <p className="text-black-alpha-900 text-xs font-light md:text-base lg:text-lg">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex w-full flex-wrap items-center gap-4 md:gap-6">
          {[
            { title: 'Acceptance Rate', value: 0.95 },
            { title: 'Faster', value: 0.2 },
            { title: 'Less Cost', value: 0.5 },
            { title: 'Industry Coverage', value: 0.99 },
          ].map(({ title, value }) => (
            <li
              key={title}
              className="bg-b2 rounded-10 rounded-se-20 flex min-w-30 flex-1 flex-col justify-between border border-white p-3 md:rounded-se-4xl xl:p-6">
              <h3 className="text-xs font-light md:text-base xl:text-lg">
                {title}
              </h3>
              <em className="font-darker-grotesque text-p1 text-right text-4xl font-semibold not-italic lg:text-5xl 2xl:text-7xl">
                {Intl.NumberFormat('en', { style: 'percent' }).format(value)}
              </em>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <SectionWrapper
        title="Data Quality"
        titleClassName={marginClassName}>
        <ul className="lg:frosted-card lg:rounded-20 flex flex-wrap items-center gap-3 lg:gap-6 lg:p-6">
          {[
            {
              title: 'Audio Specs',
              description: '24kHz / 16bit WAV (minimum 16kHz), single channel.',
            },
            {
              title: 'Accuracy',
              description:
                '>98% text-audio alignment, with <2% word error rate.',
            },
            {
              title: 'Diversity',
              description:
                'Wide speaker distribution; per language ≥10 speakers with 100+ hours each.',
            },
            {
              title: 'Usability',
              description:
                'Real-world recordings free from distortion, clipped frames, or unusable noise (SNR >10dB).',
            },
          ].map(({ title, description }) => (
            <li
              key={title}
              className={cn(
                'border-black-alpha-700 flex min-w-30 flex-1 flex-col self-stretch',
                'gap-1.5 lg:gap-6 lg:not-last:border-r lg:not-last:pr-6',
                'max-lg:frosted-card max-lg:rounded-10 max-lg:border max-lg:p-3',
              )}>
              <h3 className="text-base font-medium lg:text-xl xl:text-2xl">
                {title}
              </h3>
              <p className="text-black-alpha-800 text-xs font-light text-balance lg:text-base xl:text-lg">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <SectionWrapper
        title="Why PublicAI?"
        titleClassName={marginClassName}>
        <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {[
            {
              Icon: Stack,
              title: 'Scale',
              description:
                'Industry-leading volume with 100k+ hours across dozens of languages.',
            },
            {
              Icon: DataCollection,
              title: 'Quality',
              description:
                'Rigorous multi-stage quality control with near-perfect alignment.',
            },
            {
              Icon: Voting,
              title: 'Legality',
              description:
                'All data is collected with proper consent, rights, and usage authorization',
            },
            {
              Icon: AudioWave,
              title: 'Flexibility',
              description:
                'Custom subsets available by language, region, or scenario.',
            },
            {
              Icon: Flag,
              title: 'Future-Proof',
              description:
                'Optimized for both ASR training and TTS voice synthesis.',
            },
          ].map(({ Icon, title, description }) => (
            <li
              key={title}
              className={cn(
                'bg-b2 rounded-10 border-black-alpha-700 flex flex-1 flex-col gap-2 self-stretch border p-4 md:p-6',
                'min-w-30 md:min-w-60',
              )}>
              <div className="mb-3 flex aspect-square size-fit items-center justify-center rounded-full bg-purple-400 p-3">
                <Icon className="h-auto w-6 md:w-8" />
              </div>
              <h3 className="text-base font-medium md:text-lg">{title}</h3>
              <p className="text-xs font-light md:text-sm xl:text-base">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <section
        className={cn(
          sectionClassName,
          marginClassName,
          'lg:bg-b3 flex flex-col items-center justify-between gap-8 py-10 lg:flex-row lg:p-8',
        )}>
        <div className="border-black-alpha-900 flex flex-1 flex-col gap-4">
          <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl 2xl:text-4xl">
            Audio Collection and Annotation
          </h3>
          <div className="flex flex-col gap-4">
            <p className="text-black-alpha-600 text-sm font-medium md:text-base xl:text-lg">
              Our datasets are carefully curated across everyday and
              professional domains, enabling robust model training:
            </p>
            <ul className="list-disc ps-5 marker:text-[#5708fe]">
              {[
                'Business meetings & negotiations',
                'Education & classroom dialogue',
                'Travel & tourism conversations',
                'Daily life & household communication',
                'Social interactions & family discussions',
                'Public speaking, storytelling, and presentations',
              ].map((label) => (
                <li
                  key={label}
                  className="text-black-alpha-900 text-sm font-light md:text-base xl:text-lg">
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-1 lg:border-l lg:pl-8">
          <Image
            className="rounded-10 size-full object-cover lg:rounded-2xl"
            src={Demo3}
            alt="Unlock the Power of Data for Your Business"
            width={648}
            height={432}
          />
        </div>
      </section>

      <section
        className={cn(
          sectionClassName,
          'frosted-card rounded-10 flex flex-col p-5 lg:flex-row lg:p-6 xl:p-7',
        )}>
        <h2
          className={cn(
            'border-black-alpha-700 self-stretch font-medium',
            'text-xl md:text-2xl lg:text-3xl 2xl:text-4xl',
            'max-lg:mb-5 max-lg:border-b max-lg:pb-5 lg:mr-6 lg:border-r lg:pr-6',
          )}>
          Investor
        </h2>
        <ul
          className={cn(
            'flex flex-1 flex-wrap items-center justify-center',
            'gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7',
          )}>
          {[
            { image: BBF, name: 'Blockchain Builders Fund' },
            { image: MHVentures, name: 'MH Ventures' },
            { image: Chasm, name: 'Chasm' },
            { image: IBCGroup, name: 'IBC Invest Incubate Accelerate' },
            { image: ForesightVentures, name: 'Foresight Ventures' },
            { image: G20, name: 'G20 Group' },
            { image: SolanaFoundation, name: 'Solana Foundation' },
            { image: IOBCCapital, name: 'IOBC Capital' },
            { image: TAISU, name: 'TAISU' },
            { image: Stc, name: 'Stc Group' },
          ].map(({ image, name }) => (
            <li key={name}>
              <Image
                className="3xl:h-14 h-6 w-auto md:h-8 lg:h-10 xl:h-12"
                src={image}
                height={80}
                alt={name}
                title={name}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
