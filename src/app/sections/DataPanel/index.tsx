'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import styles from '@/app/sections/DataPanel/DataPanel.module.css';
import buildersData from '@/assets/svg/builders-data.svg?react';
import datasetSizeData from '@/assets/svg/dataset-size-data.svg?react';
import partnersData from '@/assets/svg/partners-data.svg?react';
import validatorsData from '@/assets/svg/validators-data.svg?react';
import workersData from '@/assets/svg/workers-data.svg?react';

const DataPanel = () => {
	return (
		<section className="container flex items-center justify-around gap-16 mx-auto mt-20">
			{[
				{ Icon: workersData, title: 'Workers', data: '400K+' },
				{ Icon: validatorsData, title: 'Validators', data: '300K+' },
				{ Icon: buildersData, title: 'Builders', data: '200K+' },
				{ Icon: datasetSizeData, title: 'Dataset Size', data: '100T+' },
				{ Icon: partnersData, title: 'Partners', data: '50+' },
			].map((item, index) => (
				<article
					key={index}
					className={clsx(
						styles.card,
						'flex flex-col pt-7 pb-4 items-center justify-center size-full hover:bg-white rounded-xl border-white/5 border-2 bg-b3 hover:border-white',
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
					<item.Icon className="transition-colors size-10" />
					<h6 className="my-4 text-xl font-bold transition-colors">
						{item.data}
					</h6>
					<p className="text-base font-normal transition-colors">
						{item.title}
					</p>
				</article>
			))}
		</section>
	);
};

export default DataPanel;