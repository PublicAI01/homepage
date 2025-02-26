import type { Metadata } from 'next';

import DataAPISuite from '@/app/datahub/sections/DataAPISuite';
import DataHubWidget from '@/app/datahub/sections/DataHub';
import Index from '@/app/datahub/sections/Index';
import VectorDatabase from '@/app/datahub/sections/VectorDatabase';
import SectionWrapper from '@/components/SectionWrapper';

export const metadata: Metadata = {
  title: 'PublicAI Data Hub',
  description:
    'Data Hub is redefining AI by decentralizing data sourcing, validation, and application. Our platform ensures AI systems reflect the diversity, culture, and authenticity of real-world contributors, eliminating uniformity and bias. Contributors play a vital role—validating datasets, sourcing unique data, or sharing niche expertise —and are rewarded with PublicAI Points for their meaningful efforts. Join our global movement to build dynamic, inclusive AI that benefits everyone through a powerful Web3 pipeline.',
  keywords:
    'decentralized data sourcing, AI training, diversity in AI, avoiding bias, contributor rewards, Web3 pipeline, PublicAI Points, global AI movement, inclusive technology, decentralized ecosystem',
};

const DataHub = () => {
  return (
    <>
      <Index />
      <DataHubWidget />
      <VectorDatabase />
      <DataAPISuite />
      <SectionWrapper className="mt-24 md:mt-40">
        <hgroup className="mx-auto w-4/5">
          <h3 className="text-center text-base font-semibold text-white md:font-bold lg:text-2xl">
            Our global network of contributors sources diverse, authentic data,
            <br />
            crafting inclusive AI that mirrors humanity’s richness—free from
            bias and uniformity.
          </h3>
          <h4 className="text-p1 mt-8 text-center text-base font-semibold md:font-bold lg:text-2xl">
            Join the movement to build AI that uplifts everyone—dynamic,
            equitable, and unstoppable.
          </h4>
        </hgroup>
      </SectionWrapper>
    </>
  );
};

export default DataHub;
