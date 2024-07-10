import Image from 'next/image';

import Swiper from '@/app/components/Swiper';
import styles from '@/app/sections/About/About.module.css';
import dataCollection from '@/assets/image/data-collection.png';
import dataLabeling from '@/assets/image/data-labeling.png';
import modelEvaluation from '@/assets/image/modal-evaluation.png';
import competitiveWorkforce from '@/assets/svg/builder-icon.svg?react';
import costEfficiency from '@/assets/svg/cost-efficiency.svg?react';
import dashArrowAnimateToBottom from '@/assets/svg/dash-arrow-animate-to-bottom.svg';
import dashArrowAnimateToLeft from '@/assets/svg/dash-arrow-animate-to-left.svg';
import dashArrowAnimateToRight from '@/assets/svg/dash-arrow-animate-to-right.svg';
import mutualModalData from '@/assets/svg/mutual-modal-data.svg?react';
import qualityControl from '@/assets/svg/quality-control.svg?react';
import Card from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';
import { cn } from '@/utils';

const About = () => {
  return (
    <SectionWrapper
      title="About PublicAI"
      marginTop={false}>
      <h3 className="container mt-12 text-center text-base font-medium text-g1 md:text-2xl">
        AI data infra: open to every human contributing data to train AI and
        sharing the revenue. The team includes world-class AI scientists, IEEE
        fellows, professors, and PhDs from Stanford and CUHK. Our mission is to
        monetize all human knowledge to train Public AGI.
      </h3>
      <div className="container mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-4 lg:mt-20 lg:grid-cols-3 xl:grid-cols-4">
        {[
          {
            Icon: competitiveWorkforce,
            title: 'Competitive Workforce',
            content:
              'Without barriers from international banking and central platforms, one can access to the best workers, from anywhere in the world.',
          },
          {
            Icon: qualityControl,
            title: 'Quality Control',
            content:
              'Through DAO governance and QC oracle systems, one can rest assured that work will be done with meticulousness.',
          },
          {
            Icon: costEfficiency,
            title: 'Cost Efficiency',
            content:
              'Via on-chain staking and liability mechanisms, PublicAI reduces work/cost redundancy required in traditional platforms.',
          },
          {
            Icon: mutualModalData,
            title: 'Mutual Modal Data',
            content:
              "We support the collection and annotation of mutual modal data such as text, audio, video, and mapping data, providing the world's largest decentralized data collection/annotation platform.",
          },
        ].map((item, index) => (
          <Card
            key={index}
            title={item.title}
            content={item.content}>
            {<item.Icon />}
          </Card>
        ))}
      </div>
      <section
        className={cn(
          'container mt-10 flex flex-col items-center p-12 max-md:px-5 md:flex-row md:gap-2 lg:gap-4',
          styles['animate-border'],
        )}>
        <Swiper />
        <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-4 max-md:mt-10 md:w-1/3">
          <div className="flex size-full items-end justify-end">
            <Image
              className="h-3/4 w-auto"
              src={dashArrowAnimateToRight}
              height={120}
              alt="bottom to left arrow"
            />
          </div>

          <div className="relative h-0 w-full pb-[100%]">
            <Image
              className="absolute inset-0 h-auto w-full"
              src={dataCollection}
              width={120}
              height={120}
              alt="data collection picture"
              priority
            />
          </div>

          <div className="flex size-full items-end">
            <Image
              className="h-[70%] w-auto"
              src={dashArrowAnimateToBottom}
              height={120}
              alt="right to bottom arrow"
            />
          </div>

          <div className="relative h-0 w-full pb-[100%]">
            <Image
              className="absolute inset-0 h-auto w-full"
              src={modelEvaluation}
              width={120}
              height={120}
              alt="modal evaluation picture"
              priority
            />
          </div>

          <div className="flex size-full items-center justify-center">
            <Image
              className="h-auto w-[70%]"
              src={dashArrowAnimateToLeft}
              height={120}
              alt="right to bottom arrow"
            />
          </div>

          <div className="relative h-0 w-full pb-[100%]">
            <Image
              className="absolute inset-0 h-auto w-full"
              src={dataLabeling}
              width={120}
              height={120}
              alt="data labeling picture"
              priority
            />
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default About;
