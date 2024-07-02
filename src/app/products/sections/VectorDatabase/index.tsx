'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import styles from '@/app/products/sections/VectorDatabase/VectorDatabase.module.css';
import audio from '@/assets/svg/audio-type.svg?react';
import mapping from '@/assets/svg/mapping-type.svg?react';
import text from '@/assets/svg/text-type.svg?react';
import video from '@/assets/svg/video-type.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import Title from '@/components/Title';

const VectorDatabase = () => {
	return (
		<section className="container flex flex-col items-center mx-auto mt-40">
			<Title>Vector Database</Title>
			<section
				className={clsx(
					styles['animate-border'],
					'w-full pt-5 pb-16 px-20 mt-8',
				)}>
				<h1 className="text-3xl font-bold text-center text-white">
					Application
				</h1>
				<h2 className="mt-2 mb-10 text-lg font-medium text-center text-white">
					A comprehensive collection of datasets meticulously curated to cater
					to a wide array of industries and modalities, providing the foundation
					for AI projects.
				</h2>
				<div className="flex items-center gap-32 lg:gap-20">
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
								'border rounded-xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur transition-colors border-white/10 hover:bg-white py-6 px-8 flex-1 self-stretch flex flex-col items-center justify-center',
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
							<item.Icon className="size-11" />
							<h1 className="mt-4 text-xl font-bold transition-colors">
								{item.title}
							</h1>
						</article>
					))}
				</div>
			</section>
		</section>
	);
};

export default VectorDatabase;
