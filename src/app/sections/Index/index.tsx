import Image from 'next/image';

import StarTrack from '@/app/components/StarTrack';
import styles from '@/app/sections/Index/Index.module.css';
import decorativeCone from '@/assets/image/decorative-cone.svg';
import indexBall from '@/assets/image/earth.svg';
import Anchor from '@/components/Anchor';
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
          className="absolute -z-1 size-32 max-md:right-7/20 md:size-72"
          src={indexBall}
          width={288}
          height={288}
          alt="ball image"
          aria-hidden
        />
        <StarTrack className="absolute w-6/5 md:w-3/5" />
        <StarTrack className="absolute w-9/10 md:w-9/20" />
        <StarTrack className="absolute w-3/5 md:w-3/10" />
      </div>
      <div className="relative mb-24 flex flex-col">
        <div className="bg-primary/80 absolute top-1/2 -left-10 size-12 rounded-full md:-left-1/4 md:size-24"></div>
        <div className="bg-primary/80 absolute -top-1/4 size-8 rounded-full max-md:right-0 md:-top-1/2 md:left-1/4"></div>
        <div className="bg-primary/80 absolute size-4 rounded-full max-md:-bottom-12 md:-top-full md:-right-1/3 md:size-20"></div>
        <h1 className="mx-auto max-w-xs text-center text-2xl font-semibold tracking-wider text-white md:max-w-4xl md:text-5xl">
          Building the Human Layer of AI
        </h1>
        <h2 className="mx-auto mt-3 text-center text-base font-normal text-white max-md:max-w-xs md:mt-6 md:text-xl">
          Get paid for contributing your expertise and experience to power
          exceptional AI.
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 md:mt-12">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="relative w-60 cursor-not-allowed rounded-sm bg-[#4808FE]/40 py-2 text-center text-base font-medium text-white/60 shadow-[0.125rem_0.125rem_0_0] shadow-white/30 select-none md:text-xl">
            Earn on Trajector
          </button>
          <span className="bg-primary/20 text-p1 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold whitespace-nowrap uppercase">
            Coming soon
          </span>
        </div>
      </div>
    </section>
  );
};

export default Index;
