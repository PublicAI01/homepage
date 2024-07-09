import Image from 'next/image';

import StarTrack from '@/app/components/StarTrack';
import indexBall from '@/assets/image/index-ball.png';
import decorativeCone from '@/assets/svg/decorative-cone.svg';
import Anchor from '@/components/Anchor';
import Button from '@/components/Button';
import { CHROME_EXTENSION_LINK, PUBLIC_AI_DATA_HUNTER_LINK } from '@/constant';

const Index = () => {
  return (
    <section className="relative flex h-screen flex-col items-center justify-center">
      <Anchor
        className="max-md:scroll-mt-[100vh]"
        id="home"
      />
      <Image
        className="absolute left-0 top-0 -m-[33.333333%] h-auto w-2/3 scale-150 opacity-70 md:-m-48 md:w-96 md:scale-[2]"
        src={decorativeCone}
        width={384}
        style={{
          clipPath: 'inset(50% 0 0 50%)',
        }}
        alt="decorative cone picture"
        aria-hidden
      />
      <div
        className="absolute -right-1/4 -z-2 flex size-full items-center justify-center max-md:-bottom-1/4 md:-right-[40%]"
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
          className="absolute"
          trackSize={['140vw', '100vw']}
          ballSize={['0.5rem', '1rem']}
        />
        <StarTrack
          className="absolute"
          trackSize={['100vw', '70vw']}
          ballSize={['0.5rem', '1rem']}
        />
        <StarTrack
          className="absolute"
          trackSize={['60vw', '40vw']}
          ballSize={['0.5rem', '1rem']}
        />
      </div>
      <article className="relative mb-24 flex flex-col">
        <div
          className="absolute -left-10 top-1/2 size-12 rounded-full bg-primary/80 md:-left-1/4 md:size-24"
          style={{
            clipPath: 'inset(0 30% 0 0)',
          }}></div>
        <div className="absolute -top-1/4 size-8 rounded-full bg-primary/80 max-md:right-0 md:-top-1/2 md:left-1/4"></div>
        <div className="absolute size-4 rounded-full bg-primary/80 max-md:-bottom-12 md:-right-1/3 md:-top-full md:size-20"></div>
        <h1 className="mx-auto max-w-xs text-center text-2xl font-semibold tracking-wider text-white md:max-w-4xl md:text-5xl">
          Web3 AI Data Infrastructure, create 4 Billion Data Jobs in 2050.
        </h1>
        <h2 className="mx-auto mb-12 mt-3 text-center text-base font-normal text-white max-md:max-w-xs md:mt-6 md:text-xl">
          Enable Every Human: Contribute to AI and Share the Benefits.
        </h2>
        <div className="flex flex-col items-center justify-center gap-5 md:flex-row md:gap-11">
          <Button
            href={CHROME_EXTENSION_LINK}
            ariaLabel="to download data hunter chrome extension">
            Download Data Hunter
          </Button>
          <Button
            theme="primary"
            href={PUBLIC_AI_DATA_HUNTER_LINK}
            ariaLabel="to data hub website">
            Launch Data Hub
          </Button>
        </div>
      </article>
    </section>
  );
};

export default Index;
