import { type Metadata } from 'next';
import Link from 'next/link';

import SectionWrapper from '@/components/SectionWrapper';
import { TRAJECTOR_PRIVACY_LINK, TRAJECTOR_TERMS_LINK } from '@/constant';

export const metadata: Metadata = {
  title: 'Legal | PublicAI',
  description:
    'Legal documents for the publicai.io website and for PublicAI products.',
};

interface LegalDocumentLink {
  label: string;
  href: string;
  description: string;
}

interface LegalDocumentGroup {
  heading: string;
  scope: string;
  documents: LegalDocumentLink[];
}

const GROUPS: LegalDocumentGroup[] = [
  {
    heading: 'PublicAI website',
    scope: 'These documents apply to the publicai.io website only.',
    documents: [
      {
        label: 'Website Privacy Policy',
        href: '/privacy',
        description:
          'How we collect and use information when you visit this website.',
      },
      {
        label: 'Website Terms of Use',
        href: '/terms',
        description: 'The rules that govern your use of this website.',
      },
    ],
  },
  {
    heading: 'Trajector',
    scope:
      'These documents apply to the Trajector product at trajector.publicai.io.',
    documents: [
      {
        label: 'Trajector Privacy Policy',
        href: TRAJECTOR_PRIVACY_LINK,
        description:
          'How Trajector collects and uses information when you use the product.',
      },
      {
        label: 'Trajector Terms of Service',
        href: TRAJECTOR_TERMS_LINK,
        description: 'The agreement that governs your use of Trajector.',
      },
    ],
  },
];

const isExternal = (href: string) => /^https?:/.test(href);

export default function Page() {
  return (
    <SectionWrapper
      title="Legal"
      className="mb-6 gap-10 md:mb-10"
      titleClassName="mb-2 md:mb-6">
      {GROUPS.map((group) => (
        <div
          key={group.heading}
          className="flex w-full max-w-[85ch] flex-col gap-4">
          <hgroup>
            <h3 className="text-lg font-semibold text-white md:text-2xl">
              {group.heading}
            </h3>
            <p className="text-g1 text-sm md:text-base">{group.scope}</p>
          </hgroup>
          <ul className="grid gap-4 md:grid-cols-2">
            {group.documents.map((document) => (
              <li key={document.href}>
                <Link
                  href={document.href}
                  className="frosted-card flex h-full flex-col gap-1 rounded-lg p-4 transition-colors hover:border-white md:p-6"
                  {...(isExternal(document.href) && {
                    target: '_blank',
                    rel: 'external noreferrer',
                  })}>
                  <span className="font-medium text-white underline md:text-lg">
                    {document.label}
                  </span>
                  <span className="text-g1 text-sm md:text-base">
                    {document.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </SectionWrapper>
  );
}
