import type { Metadata } from 'next';

import ContactForm from '@/app/business/contact-form';

export const metadata: Metadata = {
  title: 'Connect with our team | PublicAI',
  description:
    'Reach out to our expert team to learn more about Institutional Solutions.',
};

const Business = () => {
  return (
    <section className="px-mobile-padding-x relative flex flex-1 items-center justify-center py-8 sm:py-12 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 -z-1 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(72,8,254,0.16),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="rounded-18 w-full max-w-117 border border-white/10 bg-[#0A0A0D] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] sm:p-6 md:p-8">
        <ContactForm />
      </div>
    </section>
  );
};

export default Business;
