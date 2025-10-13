import Link from 'next/link';

import Mail from '@/assets/svg/mail.svg?react';
import { SUPPORT_EMAIL_ADDRESS } from '@/constant';
import { PLATFORMS } from '@/constant/platforms';

const Footer = () => {
  return (
    <footer className="pt-10 md:pt-20">
      <div className="relative container mx-auto flex flex-col max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
        <h3 className="text-lg font-semibold md:text-2xl">Contact us</h3>
        <section className="relative my-2.5 flex w-full flex-col justify-between gap-2.5 xl:flex-row xl:items-center">
          <a
            href={`mailto:${SUPPORT_EMAIL_ADDRESS}`}
            className="frosted-card flex w-min items-center self-stretch rounded-lg p-2 md:px-4">
            <Mail className="text-primary size-4 md:size-6" />
            <p className="text-g1 ml-2 text-base md:text-xl">
              {SUPPORT_EMAIL_ADDRESS}
            </p>
          </a>
          <ul className="flex items-center gap-1.5 px-1 md:px-2 xl:absolute xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2">
            {[
              {
                label: 'Privacy Policy',
                href: '/privacy',
                'aria-label': 'go to the privacy policy page',
              },
              {
                label: 'Terms of Service',
                href: '/terms',
                'aria-label': 'go to the terms of service page',
              },
              {
                label: 'PublicAI Verify',
                href: '/official-verification',
                'aria-label': 'go to the official verification page',
              },
            ].map((item, index) => (
              <li
                key={index}
                className="border-g1 not-last:border-r not-last:pr-1.5">
                <Link
                  href={item.href}
                  className="text-g1 text-sm underline md:text-base"
                  aria-label={item['aria-label']}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <address className="frosted-card flex w-max items-center gap-2 rounded-lg p-2 md:px-4">
            <p className="text-g1 text-base font-normal not-italic md:mr-2 md:text-xl">
              Stay Connected
            </p>
            {PLATFORMS.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                target="_blank"
                rel="external noreferrer"
                aria-label={`${item.label} link`}>
                <item.Icon className="text-g1 size-6 md:size-10" />
              </Link>
            ))}
          </address>
        </section>
        <span className="text-g2 mt-5 mb-2.5 text-center text-sm md:mt-7 md:text-base">
          © {new Date().getFullYear()} MetaBlock US Limited All Rights Reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
