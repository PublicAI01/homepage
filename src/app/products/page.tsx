import type { Metadata } from 'next';
import Image from 'next/image';

import DataAPISuite from '@/app/products/sections/DataAPISuite';
import DataHub from '@/app/products/sections/DataHub';
import DataHunter from '@/app/products/sections/DataHunter';
import Index from '@/app/products/sections/Index';
import PublicAIArena from '@/app/products/sections/PublicAIArena';
import Showcase from '@/app/products/sections/Showcase';
import VectorDatabase from '@/app/products/sections/VectorDatabase';
import decorativeCone from '@/assets/svg/decorative-cone.svg';

export const metadata: Metadata = {
  title: 'PublicAI Product - Data Hunter and Data Hub',
  description:
    'Use the Data Hunter Chrome Extension to collect Twitter and ChatGPT data, validate and label text data, TTS data, and graphic data in the Data Hub, and earn cryptocurrency rewards.',
  keywords:
    'Public AI, data annotation, label to earn, decentralized, AI companies, AI training, data labeling, data collection',
};

const Products = () => {
  return (
    <main
      className="relative pb-32"
      style={{
        marginTop: 'var(--header-height)',
      }}>
      <Image
        className="absolute -top-[calc(var(--header-height)_*_1.5)] -z-1 h-screen w-auto -rotate-[25deg] scale-150 opacity-70 md:inset-x-[16.666667%] md:-top-80 md:w-2/3 lg:h-auto lg:scale-75"
        src={decorativeCone}
        height={500}
        alt="decorative cone picture"
        aria-hidden
      />

      <Index />
      <DataHunter />
      <DataHub />
      <PublicAIArena />
      <VectorDatabase />
      <DataAPISuite />
      <Showcase />
    </main>
  );
};

export default Products;
