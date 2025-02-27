import '@/app/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Bai_Jamjuree } from 'next/font/google';

import Footer from '@/app/components/Footer';
import GridPattern from '@/app/components/GridPattern';
import Header from '@/app/components/Header';
import MediaPlatform from '@/app/components/MediaPlatform';
import SideNav from '@/app/components/SideNav';
import { cn } from '@/utils';

const jamjuree = Bai_Jamjuree({
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-jamjuree',
  preload: true,
  adjustFontFallback: false,
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
      className="supports-scrollbars:scrollbar:hidden scroll-pt-header-height scroll-smooth md:scroll-pt-20">
      <body
        className={cn(
          jamjuree.className,
          'bg-b1 relative flex min-h-svh flex-col pb-8',
        )}>
        <GridPattern className="top-header-height -z-1 h-[calc(100%-var(--spacing-header-height))]" />
        <Header />
        <MediaPlatform />
        <SideNav />
        <main className="pt-header-height relative flex-1">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-JMRE2DXFNN" />
    </html>
  );
}
