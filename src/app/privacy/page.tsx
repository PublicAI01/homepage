import { type Metadata } from 'next';

import LegalDocument from '@/app/components/LegalDocument';
import MDX from '@/app/privacy/privacy-policy.mdx';
import { TRAJECTOR_PRIVACY_LINK } from '@/constant';

export const metadata: Metadata = {
  title: 'PublicAI Website Privacy Policy',
  description:
    'How PublicAI Foundation collects and uses information on the publicai.io website. Trajector has its own privacy policy.',
};

export default function Page() {
  return (
    <LegalDocument
      title="PublicAI Website Privacy Policy"
      lastUpdated={new Date(Date.UTC(2026, 8, 5))}
      productDocument={{
        label: 'Privacy Policy',
        href: TRAJECTOR_PRIVACY_LINK,
      }}>
      <MDX />
    </LegalDocument>
  );
}
