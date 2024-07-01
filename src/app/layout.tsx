import '@/app/globals.css';

import clsx from 'clsx';
import type { Metadata } from 'next';
import { Bai_Jamjuree } from 'next/font/google';

import Header from '@/app/components/Header';

const jamjuree = Bai_Jamjuree({
	weight: ['200', '300', '400', '500', '600', '700'],
	display: 'swap',
	subsets: ['latin'],
	variable: '--font-jamjuree',
});

export const metadata: Metadata = {
	title: 'PublicAI - Web3 AI Data Infrastructure',
	description:
		'Web3 based Train-To-Earn network enables every human to upgrade AI and earn rewards by completing data tasks.',
	keywords:
		'Public AI, data annotation, label to earn, decentralized, AI companies, training data, data labeling',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={clsx(jamjuree.className, 'bg-b1')}>
				<Header />
				{children}
			</body>
		</html>
	);
}
