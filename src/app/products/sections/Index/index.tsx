import clsx from 'clsx';

import SwiperGroup from '@/app/products/components/SwiperGroup';
import styles from '@/app/products/sections/Index/Index.module.css';

const Index = () => {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col pt-20 lg:pt-28">
        <h1 className="text-center text-xl font-semibold tracking-wide text-white md:text-3xl">
          <b className="mb-2 block text-3xl md:text-5xl">Building</b> Craft AI
          with Collective Intelligence
        </h1>
        <h2 className="mb-10 mt-5 text-center text-xs font-light text-white max-md:mt-6 md:text-xl md:font-normal">
          Harness the synergy of Data Hunter&apos;s seamless collection and Data
          Hub&apos;s collaborative validation to{' '}
          <b
            className={clsx(
              styles.typing,
              'mx-auto mt-3 block font-bold text-p1',
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
