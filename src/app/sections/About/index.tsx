import clsx from 'clsx';
import Image from 'next/image';
import type { FC } from 'react';

import Swiper from '@/app/components/Swiper';
import styles from '@/app/sections/About/About.module.css';
import dataCollection from '@/assets/image/data-collection.png';
import dataLabeling from '@/assets/image/data-labeling.png';
import modelEvaluation from '@/assets/image/modal-evaluation.png';
import dashArrowAnimateToBottom from '@/assets/svg/dash-arrow-animate-to-bottom.svg';
import dashArrowAnimateToLeft from '@/assets/svg/dash-arrow-animate-to-left.svg';
import dashArrowAnimateToRight from '@/assets/svg/dash-arrow-animate-to-right.svg';
import Card from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';

const About = () => {
	return (
		<SectionWrapper
			title="About PublicAI"
			marginTop={false}>
			<h3 className="text-g1 container mt-12 text-base font-medium max-md:text-center">
				PublicAI is a distributed AI network enables every human: contribute to
				AI and share the benefits that connects businesses and individuals with
				a global network of workers. It simplifies the process of outsourcing a
				wide range of tasks, from data annotation to more complex research
				related to AI. This platform allows organizations to tap into the
				collective skills of a vast, structured workforce to enhance data
				analysis and speed up the development of machine learning models.
			</h3>
			<div className="container grid grid-cols-1 gap-8 mt-12 lg:grid-cols-3 lg:mt-20 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
				{[
					{
						title: 'Competitive Workforce',
						content:
							'Without barriers from international banking and central platforms, one can access to the best workers, from anywhere in the world.',
					},
					{
						title: 'Quality Control',
						content:
							'Through DAO governance and QC oracle systems, one can rest assured that work will be done with meticulousness.',
					},
					{
						title: 'Cost Efficiency',
						content:
							'Via on-chain staking and liability mechanisms, PublicAI reduces work/cost redundancy required in traditional platforms.',
					},
					{
						title: 'Mutual Modal Data',
						content:
							"We support the collection and annotation of mutual modal data such as text, audio, video, and mapping data, providing the world's largest decentralized data collection/annotation platform.",
					},
				].map((item, index) => (
					<Card
						key={index}
						item={{ index, ...item }}
					/>
				))}
			</div>
			<section
				className={clsx(
					'container flex flex-col items-center p-12 mt-10 max-md:px-5 md:flex-row',
					styles['animate-border'],
				)}>
				<Swiper />
				<div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4 max-md:mt-10 md:w-1/3">
					<div className="size-full flex justify-end items-end">
						<Image
							className="w-auto h-3/4"
							src={dashArrowAnimateToRight}
							alt="bottom to left arrow"
						/>
					</div>

					<div className="w-full h-0 pb-[100%] relative">
						<Image
							className="w-full h-auto absolute inset-0"
							src={dataCollection}
							alt="data collection picture"
							priority
						/>
					</div>

					<div className="size-full flex items-end">
						<Image
							className="w-auto h-[70%]"
							src={dashArrowAnimateToBottom}
							alt="right to bottom arrow"
						/>
					</div>

					<div className="w-full h-0 pb-[100%] relative">
						<Image
							className="w-full h-auto absolute inset-0"
							src={modelEvaluation}
							alt="modal evaluation picture"
							priority
						/>
					</div>

					<div className="size-full flex justify-center items-center">
						<Image
							className="w-[70%] h-auto"
							src={dashArrowAnimateToLeft}
							alt="right to bottom arrow"
						/>
					</div>

					<div className="w-full h-0 pb-[100%] relative">
						<Image
							className="w-full h-auto absolute inset-0"
							src={dataLabeling}
							alt="data labeling picture"
							priority
						/>
					</div>
				</div>
			</section>
		</SectionWrapper>
	);
};

const _Card: FC<{
	titleClassName?: string;
	title: string;
	imageClassName?: string;
	image: string;
}> = ({ titleClassName, title, imageClassName, image }) => {
	return (
		<div
			className="w-full h-0 pb-[100%] relative rounded-xl border border-white/10 shadow-xl shadow-black/60"
			style={{
				background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #181818 100%)',
			}}>
			<div
				className="absolute inset-2.5 rounded border border-dashed border-white/10 flex flex-col items-center justify-center"
				style={{
					background:
						'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(6,6,6,0) 100%)',
				}}>
				<p
					className={clsx('mb-3 text-xs font-bold text-white', titleClassName)}>
					{title}
				</p>
				<Image
					className={clsx('w-12 h-auto', imageClassName)}
					src={image}
					alt={`${title.toLocaleLowerCase()} image`}
				/>
			</div>
		</div>
	);
};

export default About;
