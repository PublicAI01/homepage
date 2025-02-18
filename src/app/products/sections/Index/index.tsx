import SwiperGroup from '@/app/products/components/SwiperGroup';
import styles from '@/app/products/sections/Index/Index.module.css';
import { cn } from '@/utils';

const Index = () => {
  return (
    <section className="flex flex-col">
      <hgroup className="flex flex-col pt-16 lg:pt-28">
        <h1 className="text-center text-lg font-semibold tracking-wide text-white md:text-3xl">
          <em className="mb-2 block text-3xl not-italic md:text-5xl">
            Building
          </em>{' '}
          Craft AI with Collective Intelligence
        </h1>
        <h2 className="mx-4 mt-5 mb-10 text-center text-xs font-light text-white max-md:mt-6 md:text-xl md:font-normal">
          Harness the synergy of Data Hunter&apos;s seamless collection and Data
          Hub&apos;s collaborative validation to{' '}
          <b
            className={cn(
              styles.typing,
              'text-p1 mx-auto mt-3 block font-bold',
            )}>
            supercharge AI with tailored large language models.
          </b>
        </h2>
      </hgroup>
      <SwiperGroup />
    </section>
  );
};

export default Index;
