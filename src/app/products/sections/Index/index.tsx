import clsx from 'clsx';

import SwiperGroup from '@/app/products/components/SwiperGroup';
import styles from '@/app/products/sections/Index/Index.module.css';

const Index = () => {
  return (
    <section className="flex flex-col justify-center lg:min-h-screen">
      <div className="flex flex-col lg:justify-center max-lg:pt-28 max-md:min-h-screen">
        <h1 className="text-xl font-semibold tracking-wide text-center text-white md:text-3xl">
          <b className="block mb-2 text-3xl md:text-5xl">Building</b> Craft AI
          with Collective Intelligence
        </h1>
        <h2 className="mt-5 mb-10 text-sm font-light text-center text-white max-md:mt-12 md:text-xl md:font-normal">
          Harness the synergy of Data Hunter&apos;s seamless collection and Data
          Hub&apos;s collaborative validation to{' '}
          <b
            className={clsx(
              styles.typing,
              'text-p1 block font-bold mx-auto mt-3',
            )}>
            supercharge AI with tailored large language models.
          </b>
        </h2>
      </div>
      <SwiperGroup />
    </section>
  );
};

export default Index;
