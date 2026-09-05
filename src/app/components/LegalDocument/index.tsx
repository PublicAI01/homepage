import Link from 'next/link';

import Button from '@/components/Button';

interface ProductDocument {
  label: string;
  href: string;
}

interface LegalDocumentProps {
  title: string;
  lastUpdated: Date;
  productDocument: ProductDocument;
  children: React.ReactNode;
}

const LegalDocument = (props: LegalDocumentProps) => {
  const { title, lastUpdated, productDocument, children } = props;

  return (
    <section className="mx-auto mb-6 flex max-w-[85ch] flex-col items-center max-md:px-[calc(var(--spacing-mobile-padding-x)*2)] md:mb-10">
      <article className="prose prose-invert prose-figcaption:text-center max-w-[85ch]!">
        <h1>{title}</h1>
        <p className="font-medium text-white">
          Last Updated on:{' '}
          <time dateTime={lastUpdated.toISOString()}>
            {Intl.DateTimeFormat('en', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(lastUpdated)}
          </time>
        </p>
        <aside
          className="frosted-card not-prose my-6 flex flex-col gap-4 rounded-lg p-4 md:p-6"
          role="note"
          aria-label="document scope">
          <div>
            <p className="font-medium text-white">
              This document covers the publicai.io website only.
            </p>
            <p className="text-g1 mt-1 text-sm md:text-base">
              Looking for Trajector? The product has its own{' '}
              {productDocument.label}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button
              theme="primary"
              href={productDocument.href}
              className="w-auto px-4 text-sm md:text-base">
              Read the Trajector {productDocument.label}
            </Button>
            <Link
              href="/legal"
              className="text-g1 text-sm underline md:text-base">
              All legal documents
            </Link>
          </div>
        </aside>
        {children}
      </article>
    </section>
  );
};

export default LegalDocument;
