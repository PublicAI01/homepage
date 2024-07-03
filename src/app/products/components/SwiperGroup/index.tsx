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
import HunterPreview1 from '@/assets/image/hunter-preview-1.png';
import HunterPreview2 from '@/assets/image/hunter-preview-2.png';

const SwiperGroup = () => {
	return (
		<section className="container flex items-center gap-12 mx-auto flex-col md:flex-row">
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
				images={[HubPreview1, HubPreview2]}
			/>
		</section>
	);
};

const SwiperCard: FC<{
	title: string;
	subTitle: string;
	content: string;
	images: StaticImageData[];
}> = ({ title, subTitle, content, images }) => {
	return (
		<article className="md:p-6 py-5 px-4 border border-white rounded-2xl bg-b3/65 max-md:mx-auto w-[var(--mobile-container-width)] md:w-[calc(50%_-_1.5rem)] self-stretch flex flex-col justify-between">
			<div>
				<h3 className="text-2xl font-semibold md:font-bold text-white">
					{title}
				</h3>
				<h4 className="text-2xl font-semibold md:font-bold text-white">
					{subTitle}
				</h4>
				<p className="my-3 text-base font-medium text-g1">{content}</p>
			</div>
			<Swiper
				className={clsx('md:max-w-xl max-w-full', styles.swiper)}
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
							className="w-auto mx-auto mb-6 border h-48 md:h-96 rounded-xl border-b4"
							src={item}
							alt={`data hunter preview ${index}`}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</article>
	);
};

export default SwiperGroup;
