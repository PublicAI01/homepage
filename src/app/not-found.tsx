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
    <main className="min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold text-white md:text-3xl">Not Found</h2>
      <p className="px-4 my-10 text-base font-medium text-center text-white md:text-lg">
        The page is not found. Please check if the URL is correct.
      </p>
      <Link
        className="bg-primary h-10 flex justify-center items-center px-5 text-base font-normal text-white rounded-full"
        href="/"
        aria-label="return to homepage">
        Return Home
      </Link>
    </main>
  );
}
