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
			<h3 className="text-lg md:text-2xl font-bold text-white my-6 md:my-9 text-center">
				<b className={styles.slogan}>PublicAI</b>
				<b className={styles.slogan}>&nbsp;Consensus RLHF</b>
				<b className={styles.slogan}>&nbsp;Loss Function</b>
			</h3>
			<Image
				className="md:w-2/3 w-full h-auto"
				src={consensusFn}
				alt="PublicAI consensus RLHF loss function"
			/>
			<h3 className="text-lg md:text-2xl text-center font-bold text-white my-6 md:my-9">
				<p className={styles.slogan}>Reward</p>
				<p className={styles.slogan}>&nbsp;Function</p>
			</h3>
			<Image
				className="md:w-1/3 w-full h-auto"
				src={rewardFn}
				alt="reward function"
			/>
			<section className="flex flex-col md:items-center justify-between my-16 max-md:mb-6 max-md:mt-12 md:flex-row">
				<_Block
					className="flex-1"
					image={requesters}
					content="Requesters have tasks they need to be completed"
				/>
				<div className="flex h-10 w-20 md:w-28 mb-14 max-md:mt-14 max-md:rotate-90">
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
				<div className="flex justify-end w-20 h-10 md:w-28 mb-14 max-md:mt-14 max-md:rotate-90">
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
				'flex md:flex-col w-full items-center max-md:px-4',
				className,
			)}>
			<Image
				className="h-auto w-20 md:w-28"
				src={image}
				alt={content.toLocaleLowerCase()}
			/>
			<p className="md:w-3/4 md:mt-12 max-md:ml-4 text-base md:text-center text-white">
				{content}
			</p>
		</article>
	);
};

export default Works;
