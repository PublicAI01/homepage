'use client';

import clsx from 'clsx';
import type { CSSProperties, FC } from 'react';

import competitiveWorkforce from '@/assets/svg/builder-icon.svg?react';
import costEfficiency from '@/assets/svg/cost-efficiency.svg?react';
import mutualModalData from '@/assets/svg/mutual-modal-data.svg?react';
import qualityControl from '@/assets/svg/quality-control.svg?react';
import styles from '@/components/Card/Card.module.css';

interface CardItem {
	index: number;
	title: string;
	content: string;
}

const ICON_LIST = [
	competitiveWorkforce,
	qualityControl,
	costEfficiency,
	mutualModalData,
];

const Card: FC<{ item: CardItem }> = ({ item }) => {
	const Icon = ICON_LIST[item.index];

	return (
		<article
			className={clsx(
				'rounded-xl border border-white bg-b2 p-6 transition-colors hover:bg-white',
				styles.card,
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
			<Icon className="size-11" />
			<h4 className="my-4 text-xl font-bold transition-colors">{item.title}</h4>
			<p className="text-xs font-medium transition-colors">{item.content}</p>
		</article>
	);
};

export default Card;
