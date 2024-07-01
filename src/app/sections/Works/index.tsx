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
import Title from '@/components/Title';

const Works = () => {
	return (
		<section className="container flex flex-col items-center py-6 mx-auto bg-black">
			<Title>How it works</Title>
			<h6 className="text-2xl font-bold text-white my-9">
				<b className={styles.slogan}>PublicAI</b>
				<b className={styles.slogan}>&nbsp;Consensus RLHF</b>
				<b className={styles.slogan}>&nbsp;Loss Function</b>
			</h6>
			<Image
				className="w-2/3 h-auto"
				src={consensusFn}
				alt="PublicAI consensus RLHF loss function"
			/>
			<h6 className="text-2xl font-bold text-white my-9">
				<p className={styles.slogan}>Reward</p>
				<p className={styles.slogan}>&nbsp;Function</p>
			</h6>
			<Image
				className="w-1/3 h-auto"
				src={rewardFn}
				alt="reward function"
			/>
			<section className="flex items-center justify-between my-16">
				<_Block
					className="flex-1"
					image={requesters}
					content="Requesters have tasks they need to be completed"
				/>
				<div className="flex h-10 w-28 mb-14">
					<Image
						className={styles['arrow-animate']}
						layout="fixed"
						src={arrowToRight}
						alt="arrow to right"
					/>
				</div>
				<_Block
					className="flex-1"
					image={publicaiOutlined}
					content="PublicAI Marketplace"
				/>
				<div className="flex justify-end h-10 w-28 mb-14">
					<Image
						className={styles['arrow-animate']}
						layout="fixed"
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
		</section>
	);
};

const _Block: FC<{ className?: string; image: string; content: string }> = ({
	className,
	image,
	content,
}) => {
	return (
		<article className={clsx('flex flex-col items-center', className)}>
			<Image
				className="h-auto w-28"
				src={image}
				alt={content.toLocaleLowerCase()}
			/>
			<p className="w-3/4 mt-12 text-base text-center text-white">{content}</p>
		</article>
	);
};

export default Works;
