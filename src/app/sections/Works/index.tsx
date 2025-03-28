import Image from 'next/image';

import styles from '@/app/sections/Works/Works.module.css';
import arrowToLeft from '@/assets/svg/arrow-to-left.svg';
import arrowToRight from '@/assets/svg/arrow-to-right.svg';
import consensusFn from '@/assets/svg/consensus-fn.svg';
import publicaiOutlined from '@/assets/svg/publicai-outlined.svg';
import requesters from '@/assets/svg/requesters.svg';
import rewardFn from '@/assets/svg/reward-fn.svg';
import workers from '@/assets/svg/workers.svg';
import SectionWrapper from '@/components/SectionWrapper';
import { cn } from '@/utils';

const Works = () => {
  return (
    <SectionWrapper
      className="bg-black py-6 max-md:px-4"
      title="How it works"
      useMobileContainerWidth={false}>
      <h3 className="my-6 text-center text-lg font-bold text-white md:my-9 md:text-2xl">
        <b className={styles.slogan}>PublicAI</b>
        <b className={styles.slogan}>&nbsp;Consensus RLHF</b>
        <b className={styles.slogan}>&nbsp;Loss Function</b>
      </h3>
      <Image
        className="h-auto w-full sm:w-2/3 md:w-4/5"
        src={consensusFn}
        width={500}
        alt="PublicAI consensus RLHF loss function"
        priority
      />
      <h3 className="my-6 text-center text-lg font-bold text-white md:my-9 md:text-2xl">
        <p className={styles.slogan}>Reward</p>
        <p className={styles.slogan}>&nbsp;Function</p>
      </h3>
      <Image
        className="h-auto w-full sm:w-1/4 md:w-2/4"
        src={rewardFn}
        width={500}
        alt="reward function"
        priority
      />
      <section className="my-16 flex flex-col justify-between max-md:mt-12 max-md:mb-6 md:flex-row md:items-center">
        <_Block
          className="flex-1"
          image={requesters}
          content="Requesters have tasks that need to be completed"
        />
        <div className="mb-14 flex h-6 w-20 max-md:mt-14 max-md:ml-2.5 max-md:rotate-90 md:h-10 md:w-28">
          <Image
            className={styles['arrow-animate']}
            src={arrowToRight}
            width={112}
            height={40}
            alt="arrow to right"
          />
        </div>
        <_Block
          className="flex-1"
          image={publicaiOutlined}
          content="PublicAI Marketplace"
        />
        <div className="mb-14 flex h-6 w-20 justify-end max-md:mt-14 max-md:ml-2.5 max-md:rotate-90 md:h-10 md:w-28">
          <Image
            className={styles['arrow-animate']}
            src={arrowToLeft}
            width={112}
            height={40}
            alt="arrow to left"
          />
        </div>
        <_Block
          className="flex-1"
          image={workers}
          content="Workers want to earn money and work on interesting tasks"
        />
      </section>
    </SectionWrapper>
  );
};

interface _BlockProps extends React.ComponentProps<'div'> {
  image: string;
  content: string;
}

const _Block = (props: _BlockProps) => {
  const { className, image, content, ...rest } = props;

  return (
    <div
      className={cn(
        'flex w-full items-center max-md:px-4 md:flex-col',
        className,
      )}
      {...rest}>
      <Image
        className="h-auto w-16 md:w-28"
        src={image}
        width={112}
        alt={content.toLocaleLowerCase()}
      />
      <p className="text-base text-white max-md:ml-4 md:mt-12 md:w-3/4 md:text-center">
        {content}
      </p>
    </div>
  );
};

export default Works;
