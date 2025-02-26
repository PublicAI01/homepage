import Image from 'next/image';
import Link from 'next/link';

import { formatDate, getBlogPosts } from '@/app/blog/utils';
import SectionWrapper from '@/components/SectionWrapper';
import { shimmer, toBase64 } from '@/utils';

export const metadata = {
  title: 'PublicAI Blog - Latest News, Feature Updates & Community Trends',
  description:
    'Web3 based Train-To-Earn network enables every human to upgrade AI and earn rewards by completing data tasks.',
  keywords:
    'Public AI, data annotation, label to earn, decentralized, AI companies, training data, data labeling',
};

export default async function Page() {
  const allBlogs = await getBlogPosts();

  return (
    <SectionWrapper
      title="Blog"
      titleClassName="mb-12 md:mb-20">
      <ol>
        {allBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <li key={post.slug}>
              <Link
                className="mb-4 flex items-center gap-4 border-b border-[#37169C] pb-4 md:mb-5 md:gap-5 md:pb-5"
                href={`/blog/${post.slug}`}>
                {post.metadata.image && (
                  <Image
                    className="w-20 rounded-md md:w-40"
                    width={160}
                    height={107}
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(160, 107))}`}
                    src={post.metadata.image}
                    alt={`${post.metadata.title} cover picture`}
                  />
                )}
                <div className="flex flex-1 flex-col justify-center self-stretch">
                  <time
                    dateTime={post.metadata.publishedAt}
                    className="text-p1 text-xs tabular-nums md:text-base">
                    {formatDate(post.metadata.publishedAt, false)}
                  </time>
                  <p className="text-base font-semibold tracking-tight text-white md:text-lg">
                    {post.metadata.title}
                  </p>
                  <p className="text-xs text-white/60 max-md:line-clamp-2 md:text-base">
                    {post.metadata.summary}
                  </p>
                </div>
              </Link>
            </li>
          ))}
      </ol>
    </SectionWrapper>
  );
}
