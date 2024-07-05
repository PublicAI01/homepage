'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import aboutStyles from '@/app/sections/About/About.module.css';
import audio from '@/assets/svg/audio-type.svg?react';
import mapping from '@/assets/svg/mapping-type.svg?react';
import text from '@/assets/svg/text-type.svg?react';
import video from '@/assets/svg/video-type.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import SectionWrapper from '@/components/SectionWrapper';

const VectorDatabase = () => {
	return (
		<SectionWrapper
			className="lg:mt-40"
			title="Vector Database">
			<section
				className={clsx(
					aboutStyles['animate-border'],
					'w-full pt-5 p-5 lg:pb-16 lg:px-20 mt-8',
				)}>
				<h3 className="text-xl md:text-3xl font-bold text-center text-white">
					Application
				</h3>
				<h4 className="mt-2 mb-5 md:mb-10 text-sm md:text-lg font-medium text-center text-white">
					A comprehensive collection of datasets meticulously curated to cater
					to a wide array of industries and modalities, providing the foundation
					for AI projects.
				</h4>
				<div className="grid gap-4 2xl:gap-32 lg:gap-12 flex-col grid-cols-2 lg:grid-cols-4">
					{[
						{ Icon: text, title: 'Text' },
						{ Icon: audio, title: 'Audio' },
						{ Icon: video, title: 'Video' },
						{ Icon: mapping, title: 'Mapping' },
					].map((item, index) => (
						<article
							key={index}
							className={clsx(
								cardStyles.card,
								'border rounded-xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur transition-colors border-white/10 hover:bg-white py-4 px-6 md:py-6 md:px-8 flex-1 self-stretch flex flex-col items-center justify-center',
							)}
							style={
								{
									'--duration': '0.4',
								} as CSSProperties
							}
							onMouseEnter={(e) => {
								e.currentTarget.classList.remove('animate-card-flicker');
							}}
							onMouseLeave={(e) => {
								e.currentTarget.classList.add('animate-card-flicker');
							}}>
							<item.Icon className="size-9 md:size-11" />
							<h5 className="mt-4 text-lg md:text-xl font-bold transition-colors">
								{item.title}
							</h5>
						</article>
					))}
				</div>
			</section>
		</SectionWrapper>
	);
};

export default VectorDatabase;
