'use client';

import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';

import Image, { type StaticImageData } from 'next/image';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import styles from '@/app/products/components/SwiperGroup/SwiperGroup.module.css';
import ArenaPreview1 from '@/assets/image/arena-preview-1.png';
import ArenaPreview2 from '@/assets/image/arena-preview-2.png';
import HubPreview1 from '@/assets/image/hub-preview-1.png';
import HubPreview2 from '@/assets/image/hub-preview-2.png';
import HubPreview3 from '@/assets/image/hub-preview-3.png';
import HubPreview4 from '@/assets/image/hub-preview-4.png';
import HunterPreview1 from '@/assets/image/hunter-preview-1.png';
import HunterPreview2 from '@/assets/image/hunter-preview-2.png';
import SectionWrapper from '@/components/SectionWrapper';
import { cn } from '@/utils';

const SwiperGroup = () => {
  return (
    <>
      <SectionWrapper
        className="gap-12 lg:flex-row"
        marginTop={false}>
        <SwiperCard
          title="Data Hunter"
          subTitle="Seamless Data Collection"
          content="Collect, contribute, and empower AI learning instantly with a simple click."
          images={[HunterPreview1, HunterPreview2]}
        />

        <SwiperCard
          title="Data Hub"
          subTitle="Collaborative AI Validation"
          content="Participate in consensus-driven validation, enhance AI accuracy, refine AI models, and earn rewards."
          images={[HubPreview1, HubPreview2, HubPreview3, HubPreview4]}
        />
      </SectionWrapper>
      <SectionWrapper>
        <SwiperCard
          title="PublicAI Arena"
          subTitle="Innovative Model Evaluation"
          content="Engage in interactive AI experiences and contribute to the evolution of AI models through collective intelligence."
          images={[ArenaPreview1, ArenaPreview2]}
          isBlock
        />
      </SectionWrapper>
    </>
  );
};

interface SwiperCardProps extends React.ComponentProps<'div'> {
  title: string;
  subTitle: string;
  content: string;
  images: StaticImageData[];
  isBlock?: boolean;
}

const SwiperCard = (props: SwiperCardProps) => {
  const {
    className,
    title,
    subTitle,
    content,
    images,
    isBlock = false,
    ...rest
  } = props;
  return (
    <div
      className={cn(
        'bg-b3/65 flex flex-col justify-between self-stretch rounded-2xl border border-white px-4 py-5 lg:w-[calc(50%_-_1.5rem)] lg:p-6',
        isBlock &&
          'lg:w-full lg:flex-row lg:items-center lg:gap-12 lg:px-32 xl:gap-20 xl:px-48',
        className,
      )}
      {...rest}>
      <hgroup>
        <h3 className="text-base font-semibold text-white md:font-bold lg:text-2xl">
          {title}
        </h3>
        <h4 className="text-base font-semibold text-white md:font-bold lg:text-2xl">
          {subTitle}
        </h4>
        <p className="text-g1 my-3 text-sm font-medium lg:text-base">
          {content}
        </p>
      </hgroup>
      <Swiper
        className={cn('max-w-full', isBlock && 'lg:w-1/2', styles.swiper)}
        slidesPerView={1}
        spaceBetween={0}
        mousewheel
        navigation
        pagination={{
          clickable: true,
        }}
        modules={[Mousewheel, Navigation, Pagination]}
        style={
          {
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
            '--swiper-pagination-bottom': '0',
            '--swiper-pagination-bullet-inactive-color': '#fff',
            '--swiper-pagination-bullet-inactive-opacity': '0.5',
            '--swiper-navigation-sides-offset': '0',
          } as React.CSSProperties
        }>
        {images.map((item, index) => (
          <SwiperSlide key={index}>
            <Image
              className={cn(
                'border-b4 mx-auto mb-6 h-48 w-auto rounded-xl border md:h-96',
                isBlock && 'h-[560px]',
              )}
              src={item}
              height={isBlock ? 560 : 384}
              alt={`data hunter preview ${index}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperGroup;
