import type { Metadata } from 'next';

import DataAPISuite from '@/app/products/sections/DataAPISuite';
import DataHub from '@/app/products/sections/DataHub';
import DataHunter from '@/app/products/sections/DataHunter';
import Index from '@/app/products/sections/Index';
import PublicAIArena from '@/app/products/sections/PublicAIArena';
import Showcase from '@/app/products/sections/Showcase';
import VectorDatabase from '@/app/products/sections/VectorDatabase';

export const metadata: Metadata = {
  title: 'PublicAI Product - Data Hunter and Data Hub',
  description:
    'Use the Data Hunter Chrome Extension to collect Twitter and ChatGPT data, validate and label text data, TTS data, and graphic data in the Data Hub, and earn cryptocurrency rewards.',
  keywords:
    'Public AI, data annotation, label to earn, decentralized, AI companies, AI training, data labeling, data collection',
};

const Products = () => {
  return (
    <>
      <Index />
      <DataHunter />
      <DataHub />
      <PublicAIArena />
      <VectorDatabase />
      <DataAPISuite />
      <Showcase />
    </>
  );
};

export default Products;
