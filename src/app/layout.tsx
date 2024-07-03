import '@/app/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Bai_Jamjuree } from 'next/font/google';

import Header from '@/app/components/Header';
import MediaPlatform from '@/app/components/MediaPlatform';
import SideNav from '@/app/components/SideNav';

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
		<html
			lang="en"
			className="scroll-smooth">
			<body className={clsx(jamjuree.className, 'bg-b1 scrollbar-none')}>
				<div className="relative overflow-hidden">
					<Header />
					<MediaPlatform />
					<SideNav />
					{children}
				</div>
			</body>
			<GoogleAnalytics gaId="G-JMRE2DXFNN" />
		</html>
	);
}
