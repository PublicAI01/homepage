'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';
import ReactYouTube from 'react-youtube';

import developmentDoc from '@/assets/svg/development-doc.svg?react';
import dune from '@/assets/svg/dune.svg?react';
import productGuideline from '@/assets/svg/product-guideline.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import SectionWrapper from '@/components/SectionWrapper';
import { DOCS_LINK, DUNE_LINK, GITHUB_LINK } from '@/constant';

const Resource = () => {
	return (
		<SectionWrapper
			title="Resource"
			anchorId="resource">
			<section className="flex flex-col items-center justify-center w-full mt-6 md:mt-16 gap-6 md:gap-28 md:flex-row">
				{[
					{
						Icon: productGuideline,
						title: 'Product Guideline',
						link: DOCS_LINK,
					},
					{
						Icon: developmentDoc,
						title: 'Development Doc',
						link: GITHUB_LINK,
					},
					{
						Icon: dune,
						title: 'Dune',
						link: DUNE_LINK,
					},
				].map((item, index) => (
					<a
						key={index}
						href={item.link}
						target="_blank"
						rel="external noreferrer"
						className={clsx(
							cardStyles.card,
							'flex flex-col pt-7 pb-4 items-center justify-center size-full hover:bg-white rounded-xl border-white/10 border bg-gradient-to-r from-white/10 to-white/5 backdrop-blur transition-colors hover:border-white',
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
						<h1 className="mt-6 text-xl font-bold transition-colors">
							{item.title}
						</h1>
					</a>
				))}
			</section>
			<ReactYouTube
				videoId="i0U8uaUrILs"
				className="bg-b3 w-full mt-8 md:mt-36 h-80 md:h-[600px] rounded-md overflow-hidden"
				opts={{
					width: '100%',
					height: '100%',
				}}
			/>
		</SectionWrapper>
	);
};

export default Resource;
