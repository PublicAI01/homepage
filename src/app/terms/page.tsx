import { type Metadata } from 'next';

import LegalDocument from '@/app/components/LegalDocument';
import MDX from '@/app/terms/terms-of-service.mdx';
import { TRAJECTOR_TERMS_LINK } from '@/constant';

export const metadata: Metadata = {
  title: 'PublicAI Website Terms of Use',
  description:
    'The terms that govern your use of the publicai.io website. Trajector has its own terms of service.',
};

export default function Page() {
  return (
    <LegalDocument
      title="PublicAI Website Terms of Use"
      lastUpdated={new Date(Date.UTC(2026, 8, 5))}
      productDocument={{
        label: 'Terms of Service',
        href: TRAJECTOR_TERMS_LINK,
      }}>
      <MDX />
    </LegalDocument>
  );
}
