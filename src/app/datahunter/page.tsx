import type { Metadata } from 'next';
import Image from 'next/image';

import DataHunterWidget from '@/app/datahunter/sections/DataHunter';
import Index from '@/app/datahunter/sections/Index';
import Showcase from '@/app/datahunter/sections/Showcase';
import earth from '@/assets/svg/earth.svg';
import Button from '@/components/Button';
import SectionWrapper from '@/components/SectionWrapper';
import { CHROME_EXTENSION_LINK } from '@/constant';

export const metadata: Metadata = {
  title: 'PublicAI Data Hunter',
  description:
    'Data Hunter is a seamless Chrome extension that empowers users to contribute to AI development while earning rewards effortlessly. Simply log in with your PublicAI account, and you can actively engage by replying to high-quality tweets using the AI Reply feature or passively collect points by keeping your browser open. Your contributions help shape the future of AI, and you can track your daily gains in the Data Hub Dashboard.',
  keywords:
    'data collection, AI development, Chrome extension, earn rewards, AI Reply feature, passive earning, PublicAI points, decentralized AI, Web3 tool, tweet engagement',
};

const DataHunter = () => {
  return (
    <>
      <Index />
      <DataHunterWidget />
      <SectionWrapper className="relative md:mt-40">
        <Image
          className="absolute inset-x-0 -z-1 opacity-40 md:inset-x-1/5 md:-top-1/5 md:w-3/5"
          src={earth}
          height={500}
          alt="decorative earth picture"
          aria-hidden
        />
        <Button
          theme="primary"
          href={CHROME_EXTENSION_LINK}
          aria-label="to download data hunter chrome extension">
          Install Now
        </Button>
        <h3 className="mt-5 text-center text-base font-semibold text-white lg:text-3xl">
          Shape the future of AI, one click at a time!
        </h3>
      </SectionWrapper>
      <Showcase />
    </>
  );
};

export default DataHunter;
