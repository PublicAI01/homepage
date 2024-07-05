import clsx from 'clsx';
import Image from 'next/image';
import type { FC } from 'react';

import styles from '@/app/sections/Works/Works.module.css';
import arrowToLeft from '@/assets/svg/arrow-to-left.svg';
import arrowToRight from '@/assets/svg/arrow-to-right.svg';
import consensusFn from '@/assets/svg/consensus-fn.svg';
import publicaiOutlined from '@/assets/svg/publicai-outlined.svg';
import requesters from '@/assets/svg/requesters.svg';
import rewardFn from '@/assets/svg/reward-fn.svg';
import workers from '@/assets/svg/workers.svg';
import SectionWrapper from '@/components/SectionWrapper';

const Works = () => {
	return (
		<SectionWrapper
			className="py-6 bg-black max-md:px-4"
			title="How it works"
			useMobileContainerWidth={false}>
			<h3 className="my-6 text-lg font-bold text-center text-white md:my-9 md:text-2xl">
				<b className={styles.slogan}>PublicAI</b>
				<b className={styles.slogan}>&nbsp;Consensus RLHF</b>
				<b className={styles.slogan}>&nbsp;Loss Function</b>
			</h3>
			<Image
				className="w-full h-auto md:w-4/5 sm:w-2/3"
				src={consensusFn}
				alt="PublicAI consensus RLHF loss function"
			/>
			<h3 className="my-6 text-lg font-bold text-center text-white md:my-9 md:text-2xl">
				<p className={styles.slogan}>Reward</p>
				<p className={styles.slogan}>&nbsp;Function</p>
			</h3>
			<Image
				className="w-full h-auto md:w-2/3 sm:w-1/3"
				src={rewardFn}
				alt="reward function"
			/>
			<section className="flex flex-col justify-between my-16 max-md:mt-12 max-md:mb-6 md:flex-row md:items-center">
				<_Block
					className="flex-1"
					image={requesters}
					content="Requesters have tasks they need to be completed"
				/>
				<div className="flex h-6 w-20 md:w-28 md:h-10 mb-14 max-md:mt-14 max-md:ml-2.5 max-md:rotate-90">
					<Image
						className={styles['arrow-animate']}
						src={arrowToRight}
						alt="arrow to right"
					/>
				</div>
				<_Block
					className="flex-1"
					image={publicaiOutlined}
					content="PublicAI Marketplace"
				/>
				<div className="flex justify-end h-6 w-20 md:w-28 md:h-10 mb-14 max-md:mt-14 max-md:ml-2.5 max-md:rotate-90">
					<Image
						className={styles['arrow-animate']}
						src={arrowToLeft}
						alt="arrow to left"
					/>
				</div>
				<_Block
					className="flex-1"
					image={workers}
					content="Workers want to earn money and work on interesting tasks"
				/>
			</section>
		</SectionWrapper>
	);
};

const _Block: FC<{ className?: string; image: string; content: string }> = ({
	className,
	image,
	content,
}) => {
	return (
		<article
			className={clsx(
				'w-full flex items-center max-md:px-4 md:flex-col',
				className,
			)}>
			<Image
				className="w-16 h-auto md:w-28"
				src={image}
				alt={content.toLocaleLowerCase()}
			/>
			<p className="text-base text-white max-md:ml-4 md:w-3/4 md:mt-12 md:text-center">
				{content}
			</p>
		</article>
	);
};

export default Works;
