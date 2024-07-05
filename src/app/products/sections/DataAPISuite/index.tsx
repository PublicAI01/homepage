'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import computerUpload from '@/assets/svg/computer-upload.svg?react';
import electronicsBoard from '@/assets/svg/electronics-board.svg?react';
import searchCheck from '@/assets/svg/search-check.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import SectionWrapper from '@/components/SectionWrapper';

const DataAPISuite = () => {
	return (
		<SectionWrapper
			className="lg:mt-40"
			title="Data API Suite">
			<h3 className="mt-10 mb-2 text-xl md:text-3xl font-bold text-center text-white">
				Custom API Suite for Business
			</h3>
			<h4 className="text-sm md:text-lg font-medium text-center text-white">
				Enhance Your Business with Our Comprehensive Data Solutions.
			</h4>
			<section className="flex items-center gap-3 mt-5 md:mt-10 md:flex-row flex-col">
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
							'border rounded-xl flex-1 bg-b2 transition-colors border-white hover:bg-white lg:py-6 lg:px-8 p-4 self-stretch flex flex-col items-center justify-center',
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
						<item.Icon className="size-10 lg:size-16" />
						<h5 className="my-2 lg:my-4 text-lg lg:text-xl text-center font-bold transition-colors">
							{item.title}
						</h5>
						<p className="text-sm lg:text-xs font-medium text-center transition-colors">
							{item.content}
						</p>
					</article>
				))}
			</section>
		</SectionWrapper>
	);
};

export default DataAPISuite;
