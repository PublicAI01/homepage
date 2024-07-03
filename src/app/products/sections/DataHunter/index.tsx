'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import styles from '@/app/products/sections/DataHunter/DataHunter.module.css';
import datasetIcon from '@/assets/svg/dataset-icon.svg?react';
import rewardIcon from '@/assets/svg/reward-icon.svg?react';
import trackingIcon from '@/assets/svg/tracking-icon.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import SectionWrapper from '@/components/SectionWrapper';

const DataHunter = () => {
	return (
		<SectionWrapper title="Data Hunter">
			<h1 className="md:text-lg text-base font-medium text-g1 mt-7 text-center">
				Data Hunter empowers users to instantly contribute valuable data and
				earn rewards{' '}
				<b className={clsx(styles.typing, 'font-bold text-p1 block mx-auto')}>
					with a simple click.
				</b>
			</h1>

			<section className="flex items-center gap-2 mt-10 md:mt-20 flex-col md:flex-row">
				{[
					{
						Icon: datasetIcon,
						title: 'Seamless Data Collection',
						content:
							'Collect high-quality data from social media and ChatGPT conversation with a click of a button.',
					},
					{
						Icon: rewardIcon,
						title: 'Instant Reward System',
						content:
							'Earn $PUBLIC tokens on the spot for every approved data upload.',
					},
					{
						Icon: trackingIcon,
						title: 'Real-Time Contribution Tracking',
						content:
							'Monitor the progress and impact of your uploads in real-time.',
					},
				].map((item, index) => (
					<article
						key={index}
						className={clsx(
							cardStyles.card,
							'border rounded-xl bg-b2 transition-colors border-white hover:bg-white p-4 md:p-7 self-stretch',
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
						<h1 className="my-2 md:my-4 text-lg md:text-xl font-bold transition-colors">
							{item.title}
						</h1>
						<h2 className="text-xs font-medium transition-colors">
							{item.content}
						</h2>
					</article>
				))}
			</section>
		</SectionWrapper>
	);
};

export default DataHunter;
