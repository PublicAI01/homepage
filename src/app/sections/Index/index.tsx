import Image from 'next/image';

import StarTrack from '@/app/components/StarTrack';
import indexBall from '@/assets/svg/index-ball.svg';
import indexCone from '@/assets/svg/index-cone.svg';
import Button from '@/components/Button';
import { CHROME_EXTENSION_LINK, PUBLIC_AI_DATA_HUNTER_LINK } from '@/constant';

const Index = () => {
	return (
		<>
			<div
				aria-hidden
				id="home"
				className="w-screen h-0"></div>
			<section className="relative flex flex-col items-center justify-center w-screen overflow-hidden h-svh">
				<Image
					className="absolute top-0 left-0 h-auto w-96"
					src={indexCone}
					alt="cone image"
					aria-hidden
				/>
				<div
					className="-z-[2] absolute -right-[40%] size-full flex items-center justify-center"
					aria-hidden>
					<Image
						className="-z-[1] absolute w-[30vw] h-auto"
						src={indexBall}
						alt="ball image"
						aria-hidden
					/>
					<StarTrack
						className="absolute"
						trackSize="100vw"
					/>
					<StarTrack
						className="absolute"
						trackSize="70vw"
					/>
					<StarTrack
						className="absolute"
						trackSize="40vw"
					/>
				</div>
				<article className="relative flex flex-col mb-24">
					<div
						className="absolute rounded-full size-24 bg-primary/80 top-1/2 -left-1/4"
						style={{
							clipPath: 'inset(0 30% 0 0)',
						}}></div>
					<div className="absolute rounded-full size-8 bg-primary/80 -top-1/2 left-1/4"></div>
					<div className="absolute rounded-full size-20 bg-primary/80 -top-full -right-1/3"></div>
					<h1 className="max-w-4xl mx-auto text-5xl font-semibold tracking-wider text-center text-white">
						Web3 AI Data Infrastructure, create 4 Billion Data Jobs in 2050.
					</h1>
					<h2 className="mt-6 mb-12 text-xl font-normal text-center text-white">
						Enable Every Human: Contribute to AI and Share the Benefits.
					</h2>
					<div className="flex items-center justify-center gap-11">
						<Button href={CHROME_EXTENSION_LINK}>Download Data Hunter</Button>
						<Button
							href={PUBLIC_AI_DATA_HUNTER_LINK}
							theme="primary">
							Launch Data Hub
						</Button>
					</div>
				</article>
			</section>
		</>
	);
};

export default Index;
