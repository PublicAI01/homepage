import Image from 'next/image';

import StarTrack from '@/app/components/StarTrack';
import indexBall from '@/assets/image/index-ball.png';
import indexCone from '@/assets/image/index-cone.png';
import Anchor from '@/components/Anchor';
import Button from '@/components/Button';
import { CHROME_EXTENSION_LINK, PUBLIC_AI_DATA_HUNTER_LINK } from '@/constant';

const Index = () => {
	return (
		<section className="relative flex flex-col items-center justify-center h-screen">
			<Anchor
				id="home"
				className="top-0"
			/>
			<Image
				className="absolute top-0 left-0 w-2/3 h-auto md:w-96"
				src={indexCone}
				alt="cone image"
				aria-hidden
			/>
			<div
				className="-z-2 absolute max-md:-bottom-1/4 -right-1/4 md:-right-[40%] size-full flex items-center justify-center"
				aria-hidden>
				<Image
					className="absolute size-32 -z-1 md:size-72 right-[35%]"
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
					className="absolute rounded-full size-12 md:size-24 bg-primary/80 top-1/2 -left-10 md:-left-1/4"
					style={{
						clipPath: 'inset(0 30% 0 0)',
					}}></div>
				<div className="absolute rounded-full size-8 bg-primary/80 -top-1/4 max-md:right-0 md:-top-1/2 md:left-1/4"></div>
				<div className="absolute rounded-full size-4 md:size-20 bg-primary/80 max-md:-bottom-12 md:-top-full md:-right-1/3"></div>
				<h1 className="max-w-xs mx-auto text-2xl font-semibold tracking-wider text-center text-white md:max-w-4xl md:text-5xl">
					Web3 AI Data Infrastructure, create 4 Billion Data Jobs in 2050.
				</h1>
				<h2 className="mx-auto mt-3 mb-12 text-base font-normal text-center text-white md:mt-6 max-md:max-w-xs md:text-xl">
					Enable Every Human: Contribute to AI and Share the Benefits.
				</h2>
				<div className="flex flex-col items-center justify-center gap-5 md:gap-11 md:flex-row">
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
