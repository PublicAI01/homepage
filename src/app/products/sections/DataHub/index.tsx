'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import styles from '@/app/products/sections/DataHub/DataHub.module.css';
import datasetIcon from '@/assets/svg/dataset-icon.svg?react';
import rewardIcon from '@/assets/svg/reward-icon.svg?react';
import votingIcon from '@/assets/svg/voting-icon.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import Title from '@/components/Title';

const DataHub = () => {
	return (
		<section className="container flex flex-col items-center mx-auto mt-40">
			<Title>Data Hub</Title>
			<h1 className="text-lg font-medium text-center text-g1 mt-7">
				Data Hub empowers users to earn tokens by validating datasets,{' '}
				<b className={clsx(styles.typing, 'font-bold text-p1 block mx-auto')}>
					fostering a decentralized Train-AI-To-Earn ecosystem.
				</b>
			</h1>

			<section className="flex items-center gap-2 mt-20">
				{[
					{
						Icon: datasetIcon,
						title: 'Dataset Selection',
						content:
							'Choose from a variety of datasets to validate, tailored to your expertise.',
					},
					{
						Icon: votingIcon,
						title: 'MCQ Quiz Voting',
						content:
							'Contribute to AI training by answering multiple-choice questions on data authenticity.',
					},
					{
						Icon: rewardIcon,
						title: 'Consensus Rewards',
						content:
							'Earn $PUBLIC tokens when your responses align with the majority consensus.',
					},
				].map((item, index) => (
					<article
						key={index}
						className={clsx(
							cardStyles.card,
							'border rounded-xl bg-b2 transition-colors border-white hover:bg-white p-7 flex-1 self-stretch',
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
						<h1 className="my-4 text-xl font-bold transition-colors">
							{item.title}
						</h1>
						<h2 className="text-xs font-medium transition-colors">
							{item.content}
						</h2>
					</article>
				))}
			</section>
		</section>
	);
};

export default DataHub;
