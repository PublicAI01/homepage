'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';
import ReactYouTube from 'react-youtube';

import styles from '@/app/sections/Resource/Resource.module.css';
import developmentDoc from '@/assets/svg/development-doc.svg?react';
import dune from '@/assets/svg/dune.svg?react';
import productGuideline from '@/assets/svg/product-guideline.svg?react';
import Title from '@/components/Title';

const Resource = () => {
	return (
		<>
			<div
				aria-hidden
				id="resource"
				className="w-screen h-0"></div>
			<section className="container flex flex-col items-center mx-auto mt-20">
				<Title>Resource</Title>
				<section className="flex items-center justify-center w-full mt-16 gap-28">
					{[
						{
							Icon: productGuideline,
							title: 'Product Guideline',
							link: 'https://docs.publicai.io/publicai-documentation',
						},
						{
							Icon: developmentDoc,
							title: 'Development Doc',
							link: 'https://github.com/PublicAI01',
						},
						{
							Icon: dune,
							title: 'Dune',
							link: 'https://dune.com/publicaiweb3/publicai-dashboard',
						},
					].map((item, index) => (
						<a
							key={index}
							href={item.link}
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
							<h6 className="mt-6 text-xl font-bold transition-colors">
								{item.title}
							</h6>
						</a>
					))}
				</section>
				<ReactYouTube
					videoId="i0U8uaUrILs"
					className="bg-b3 w-full mt-36 h-[600px] rounded-md overflow-hidden"
					opts={{
						width: '100%',
						height: '100%',
					}}
				/>
			</section>
		</>
	);
};

export default Resource;
