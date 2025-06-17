import Image from 'next/image';

import StarTrack from '@/app/components/StarTrack';
import styles from '@/app/sections/Index/Index.module.css';
import decorativeCone from '@/assets/svg/decorative-cone.svg';
import indexBall from '@/assets/svg/earth.svg';
import Anchor from '@/components/Anchor';
import Button from '@/components/Button';
import { CHROME_EXTENSION_LINK, PUBLIC_AI_DATA_HUB_LINK } from '@/constant';
import { cn } from '@/utils';

const Index = () => {
  return (
    <section
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden',
        styles.section,
      )}>
      <Anchor
        className="max-md:scroll-mt-[100vh]"
        id="home"
      />
      <Image
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-70 md:scale-150"
        src={decorativeCone}
        width={384}
        style={{
          clipPath: 'inset(50% 0 0 50%)',
        }}
        alt="decorative cone picture"
        aria-hidden
      />
      <div
        className="absolute -right-2/5 flex size-full items-center justify-center max-md:-bottom-1/4 md:[clip-path:inset(0_40%_0_0)]"
        aria-hidden>
        <Image
          className="absolute -z-1 size-32 max-md:right-[35%] md:size-72"
          src={indexBall}
          width={288}
          height={288}
          alt="ball image"
          aria-hidden
        />
        <StarTrack
          className="absolute w-[140%] pb-[140%] md:w-full md:pb-[100%]"
          ballSize={['0.5rem', '1rem']}
        />
        <StarTrack
          className="absolute w-[100%] pb-[100%] md:w-[70%] md:pb-[70%]"
          ballSize={['0.5rem', '1rem']}
        />
        <StarTrack
          className="absolute w-[60%] pb-[60%] md:w-[40%] md:pb-[40%]"
          ballSize={['0.5rem', '1rem']}
        />
      </div>
      <div className="relative mb-24 flex flex-col">
        <div className="bg-primary/80 absolute top-1/2 -left-10 size-12 rounded-full md:-left-1/4 md:size-24"></div>
        <div className="bg-primary/80 absolute -top-1/4 size-8 rounded-full max-md:right-0 md:-top-1/2 md:left-1/4"></div>
        <div className="bg-primary/80 absolute size-4 rounded-full max-md:-bottom-12 md:-top-full md:-right-1/3 md:size-20"></div>
        <h1 className="mx-auto max-w-xs text-center text-2xl font-semibold tracking-wider text-white md:max-w-4xl md:text-5xl">
          Building Human Layer of AI
        </h1>
        <h2 className="mx-auto mt-3 mb-12 text-center text-base font-normal text-white max-md:max-w-xs md:mt-6 md:text-xl">
          Powering Exceptional AI with Equitable Global Expertise
        </h2>
        <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
          <Button
            href={PUBLIC_AI_DATA_HUB_LINK}
            aria-label="to data hub website">
            Launch Data Hub
          </Button>
          <a
            className="text-p1/80 text-center text-sm underline"
            href={CHROME_EXTENSION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="to download data hunter chrome extension">
            Download Data Hunter
          </a>
        </div>
      </div>
    </section>
  );
};

export default Index;
