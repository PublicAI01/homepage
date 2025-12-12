import Image from 'next/image';

import SwiperCard from '@/app/components/SwiperCard';
import styles from '@/app/datahunter/sections/Index/Index.module.css';
import decorativeCone from '@/assets/image/decorative-cone.svg';
import HunterPreview1 from '@/assets/image/hunter-preview-1.png';
import HunterPreview2 from '@/assets/image/hunter-preview-2.png';
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
            PublicAI Data Hunter
          </em>{' '}
          Earn While You Browse
        </h1>
        <h2 className="mx-4 my-5 text-center text-xs font-light text-white md:text-xl md:font-normal">
          <b
            className={cn(
              styles.typing,
              'text-p1 mx-auto mt-3 block font-bold',
            )}>
            Turn daily browsing into a rewarding AI-building journey!
          </b>
        </h2>
      </hgroup>
      <SwiperCard
        title="Data Hunter"
        subTitle="Seamless Data Collection"
        content="Validate user data and activate AI-powered outreach — all in one click."
        images={[HunterPreview1, HunterPreview2]}
        imageAltPrefix="data hunter preview"
      />
    </section>
  );
};

export default Index;
