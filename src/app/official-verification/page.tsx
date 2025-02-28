import type { Metadata } from 'next';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Image from 'next/image';

import Error from '@/app/official-verification/error';
import VerifyForm from '@/app/official-verification/verify-form';
import decorativeCone from '@/assets/svg/decorative-cone.svg';
import PublicAI from '@/assets/svg/publicai.svg?react';

export const metadata: Metadata = {
  title: 'PublicAI Verify',
  description:
    'Stay safe from scammers. Enter email address, Telegram, or social media accounts to check if the source is verified and officially from PublicAI.',
  keywords:
    'Public AI, data annotation, label to earn, decentralized, AI companies, training data, data labeling',
};

const OfficialVerification = () => {
  return (
    <ErrorBoundary errorComponent={Error}>
      <section className="relative container mx-auto flex-1 pt-20 max-sm:overflow-hidden md:pt-40">
        <Image
          className="absolute inset-x-1/10 top-0 -z-1 h-auto w-4/5 scale-120 rotate-100 opacity-30 md:inset-x-3/20 md:-top-60 md:w-7/10 lg:scale-80"
          src={decorativeCone}
          height={500}
          alt="decorative cone picture"
          aria-hidden
        />
        <hgroup className="mx-auto max-sm:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))] lg:w-4/5">
          <h1 className="flex items-center justify-center gap-2 text-center text-2xl text-white md:text-3xl lg:gap-4 lg:text-4xl xl:text-5xl">
            <PublicAI
              className="inline h-8 w-auto md:h-9.5 lg:h-11 xl:h-14"
              aria-label="publicai logo"
            />
            Verify
          </h1>
          <h2 className="my-5 text-center text-sm font-normal text-white/80 lg:my-10 lg:text-2xl">
            Stay safe from scammers. Enter email address, Telegram, or social
            media accounts to check if the source is verified and officially
            from PublicAI.
          </h2>
        </hgroup>
        <VerifyForm />
      </section>
    </ErrorBoundary>
  );
};

export default OfficialVerification;
