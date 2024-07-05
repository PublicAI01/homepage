import Image from 'next/image';

import StarTrack from '@/app/components/StarTrack';
import indexBall from '@/assets/image/index-ball.png';
import decorativeCone from '@/assets/svg/decorative-cone.svg';
import Anchor from '@/components/Anchor';
import Button from '@/components/Button';
import { CHROME_EXTENSION_LINK, PUBLIC_AI_DATA_HUNTER_LINK } from '@/constant';

const Index = () => {
	return (
		<section className="h-screen relative flex flex-col justify-center items-center">
			<Anchor
				className="max-md:scroll-mt-[100vh]"
				id="home"
			/>
			<Image
				className="absolute top-0 left-0 scale-150 md:scale-[2] opacity-70 -m-[33.333333%] w-2/3 h-auto md:w-96 md:-m-48"
				src={decorativeCone}
				style={{
					clipPath: 'inset(50% 0 0 50%)',
				}}
				alt="decorative cone picture"
				priority
				aria-hidden
			/>
			<div
				className="-z-2 absolute max-md:-bottom-1/4 -right-1/4 md:-right-[40%] size-full flex items-center justify-center"
				aria-hidden>
				<Image
					className="absolute size-32 -z-1 md:size-72 max-md:right-[35%]"
					src={indexBall}
					alt="ball image"
					aria-hidden
				/>
				<StarTrack
					className="absolute"
					trackSize={['140vw', '100vw']}
					ballSize={['0.5rem', '1rem']}
				/>
				<StarTrack
					className="absolute"
					trackSize={['100vw', '70vw']}
					ballSize={['0.5rem', '1rem']}
				/>
				<StarTrack
					className="absolute"
					trackSize={['60vw', '40vw']}
					ballSize={['0.5rem', '1rem']}
				/>
			</div>
			<article className="relative flex flex-col mb-24">
				<div
					className="-left-10 bg-primary/80 size-12 absolute top-1/2 rounded-full md:-left-1/4 md:size-24"
					style={{
						clipPath: 'inset(0 30% 0 0)',
					}}></div>
				<div className="-top-1/4 bg-primary/80 size-8 absolute rounded-full max-md:right-0 md:-top-1/2 md:left-1/4"></div>
				<div className="bg-primary/80 size-4 absolute rounded-full max-md:-bottom-12 md:-top-full md:-right-1/3 md:size-20"></div>
				<h1 className="mx-auto max-w-xs text-2xl font-semibold tracking-wider text-center text-white md:max-w-4xl md:text-5xl">
					Web3 AI Data Infrastructure, create 4 Billion Data Jobs in 2050.
				</h1>
				<h2 className="mx-auto mt-3 mb-12 text-base font-normal text-center text-white max-md:max-w-xs md:mt-6 md:text-xl">
					Enable Every Human: Contribute to AI and Share the Benefits.
				</h2>
				<div className="flex flex-col justify-center items-center gap-5 md:flex-row md:gap-11">
					<Button
						href={CHROME_EXTENSION_LINK}
						ariaLabel="to download data hunter chrome extension">
						Download Data Hunter
					</Button>
					<Button
						theme="primary"
						href={PUBLIC_AI_DATA_HUNTER_LINK}
						ariaLabel="to data hub website">
						Launch Data Hub
					</Button>
				</div>
			</article>
		</section>
	);
};

export default Index;
