'use client';

import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';

import clsx from 'clsx';
import Image, { type StaticImageData } from 'next/image';
import type { FC } from 'react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import styles from '@/app/products/components/SwiperGroup/SwiperGroup.module.css';
import HubPreview1 from '@/assets/image/hub-preview-1.png';
import HubPreview2 from '@/assets/image/hub-preview-2.png';
import HubPreview3 from '@/assets/image/hub-preview-3.png';
import HubPreview4 from '@/assets/image/hub-preview-4.png';
import HunterPreview1 from '@/assets/image/hunter-preview-1.png';
import HunterPreview2 from '@/assets/image/hunter-preview-2.png';
import SectionWrapper from '@/components/SectionWrapper';

const SwiperGroup = () => {
  return (
    <SectionWrapper
      className="gap-12 lg:flex-row"
      marginTop={false}>
      <SwiperCard
        title="Data Hunter"
        subTitle="Seamless Data Collection"
        content="Collect, contribute, and empower AI learning instantly with simple click."
        images={[HunterPreview1, HunterPreview2]}
      />

      <SwiperCard
        title="Data Hub"
        subTitle="Collaborative AI Validation"
        content="Participate in consensus-driven validation, enhance AI accuracy, refine AI models and earn rewards."
        images={[HubPreview1, HubPreview2, HubPreview3, HubPreview4]}
      />
    </SectionWrapper>
  );
};

const SwiperCard: FC<{
  title: string;
  subTitle: string;
  content: string;
  images: StaticImageData[];
}> = ({ title, subTitle, content, images }) => {
  return (
    <article className="flex flex-col justify-between self-stretch rounded-2xl border border-white bg-b3/65 px-4 py-5 lg:w-[calc(50%_-_1.5rem)] lg:p-6">
      <div>
        <h3 className="text-base font-semibold text-white md:font-bold lg:text-2xl">
          {title}
        </h3>
        <h4 className="text-base font-semibold text-white md:font-bold lg:text-2xl">
          {subTitle}
        </h4>
        <p className="my-3 text-sm font-medium text-g1 lg:text-base">
          {content}
        </p>
      </div>
      <Swiper
        className={clsx('max-w-full', styles.swiper)}
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
          } as React.CSSProperties
        }>
        {images.map((item, index) => (
          <SwiperSlide key={index}>
            <Image
              className="mx-auto mb-6 h-48 w-auto rounded-xl border border-b4 md:h-96"
              src={item}
              height={384}
              alt={`data hunter preview ${index}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </article>
  );
};

export default SwiperGroup;
