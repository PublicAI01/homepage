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
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-white md:text-3xl">Not Found</h2>
      <p className="my-10 px-4 text-center text-base font-medium text-white md:text-lg">
        The page is not found. Please check if the URL is correct.
      </p>
      <Link
        className="bg-primary flex h-10 items-center justify-center rounded-full px-5 text-base font-normal text-white"
        href="/"
        aria-label="return to homepage">
        Return Home
      </Link>
    </main>
  );
}
