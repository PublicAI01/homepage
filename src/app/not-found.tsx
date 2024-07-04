import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'PublicAI - Web3 AI Data Infrastructure',
	description:
		'404: The page is not found. Please check if the URL is correct.',
	keywords:
		'Public AI, data annotation, label to earn, decentralized, AI companies, training data, data labeling',
};

export default function NotFound() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<h2 className="text-xl md:text-3xl font-bold text-white">Not Found</h2>
			<p className="text-base md:text-lg text-center px-4 font-medium text-white my-10">
				The page is not found. Please check if the URL is correct.
			</p>
			<Link
				className="bg-primary rounded-full px-5 h-10 flex items-center justify-center text-white text-base font-normal"
				href="/"
				aria-label="return to homepage">
				Return Home
			</Link>
		</main>
	);
}
