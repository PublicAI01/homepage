import { type Metadata } from 'next';

import MDX from '@/app/privacy/privacy-policy.mdx';

export const metadata: Metadata = {
  title: 'PublicAI Data Privacy Policy',
  description:
    'Web3 based Train-To-Earn network enables every human to upgrade AI and earn rewards by completing data tasks.',
  keywords:
    'Public AI, data annotation, label to earn, decentralized, AI companies, training data, data labeling',
};

export default function Page() {
  const lastUpdated = new Date(Date.UTC(2026, 0, 8));
  return (
    <section className="mx-auto mb-6 flex max-w-[85ch] flex-col items-center max-md:px-[calc(var(--spacing-mobile-padding-x)*2)] md:mb-10">
      <article className="prose prose-invert prose-figcaption:text-center max-w-[85ch]!">
        <h1>PublicAI Data PRIVACY POLICY</h1>
        <p className="font-medium text-white">
          Last Updated on:{' '}
          <time dateTime={lastUpdated.toLocaleString()}>
            {Intl.DateTimeFormat('en', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(lastUpdated)}
          </time>
        </p>
        <MDX />
      </article>
    </section>
  );
}
