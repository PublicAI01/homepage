'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import computerUpload from '@/assets/svg/computer-upload.svg?react';
import electronicsBoard from '@/assets/svg/electronics-board.svg?react';
import searchCheck from '@/assets/svg/search-check.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import Title from '@/components/Title';

const DataAPISuite = () => {
	return (
		<section className="container flex flex-col items-center mx-auto mt-20">
			<Title>Data API Suite</Title>
			<h1 className="mt-10 mb-2 text-3xl font-bold text-center text-white">
				Custom API Suite for Business
			</h1>
			<h2 className="text-lg font-medium text-center text-white">
				Enhance Your Business with Our Comprehensive Data Solutions.
			</h2>
			<section className="flex items-center gap-3 mt-10">
				{[
					{
						Icon: searchCheck,
						title: 'Tailored Solutions',
						content:
							'Each API is customizable to fit the unique requirements and workflows of various industries.',
					},
					{
						Icon: electronicsBoard,
						title: 'Scalable Architecture',
						content:
							'Build for the future with APIs that scale alongside your growing data needs.',
					},
					{
						Icon: computerUpload,
						title: 'Real-Time Data Processing',
						content:
							'Make informed, timely decisions with our real-time data processing capabilities.',
					},
				].map((item, index) => (
					<article
						key={index}
						className={clsx(
							cardStyles.card,
							'border rounded-xl bg-b2 transition-colors border-white hover:bg-white py-6 px-8 flex-1 self-stretch flex flex-col items-center justify-center',
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
						<item.Icon className="size-16" />
						<h1 className="my-4 text-xl font-bold transition-colors">
							{item.title}
						</h1>
						<h2 className="text-xs font-medium text-center transition-colors">
							{item.content}
						</h2>
					</article>
				))}
			</section>
		</section>
	);
};

export default DataAPISuite;
