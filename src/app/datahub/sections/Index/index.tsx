import Image from 'next/image';

import SwiperCard from '@/app/components/SwiperCard';
import styles from '@/app/datahub/sections/Index/Index.module.css';
import HubPreview1 from '@/assets/image/hub-preview-1.png';
import HubPreview2 from '@/assets/image/hub-preview-2.png';
import HubPreview3 from '@/assets/image/hub-preview-3.png';
import HubPreview4 from '@/assets/image/hub-preview-4.png';
import HubPreview5 from '@/assets/image/hub-preview-5.png';
import decorativeCone from '@/assets/svg/decorative-cone.svg';
import { cn } from '@/utils';

const Index = () => {
  return (
    <section className="relative flex flex-col overflow-hidden">
      <Image
        className="absolute -top-[calc(var(--spacing-header-height)*1.5)] -z-1 h-svh w-auto scale-150 -rotate-25 opacity-70 md:inset-x-1/6 md:-top-80 md:w-2/3 lg:h-auto lg:scale-75"
        src={decorativeCone}
        height={500}
        alt="decorative cone picture"
        aria-hidden
      />
      <hgroup className="flex flex-col pt-16 lg:pt-28">
        <h1 className="text-center text-lg font-semibold tracking-wide text-white md:text-3xl">
          <em className="mb-2 block text-3xl not-italic md:text-5xl">
            Redefine AI with
          </em>{' '}
          PublicAI Data Hub
        </h1>
        <h2 className="mx-4 my-5 text-center text-xs font-light text-white md:text-xl md:font-normal">
          <b
            className={cn(
              styles.typing,
              'text-p1 mx-auto mt-3 block font-bold',
            )}>
            Discover a decentralized revolution in AI development.
          </b>
        </h2>
      </hgroup>
      <SwiperCard
        title="Data Hub"
        subTitle="Upload & Vote for Rewards"
        content="Validate datasets, share unique insights, and earn PublicAI Points as you power a Web3 pipeline tackling real-world challenges."
        images={[
          HubPreview2,
          HubPreview3,
          HubPreview4,
          HubPreview5,
          HubPreview1,
        ]}
        imageAltPrefix="data hub preview"
      />
    </section>
  );
};

export default Index;
