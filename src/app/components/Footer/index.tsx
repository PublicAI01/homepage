import Link from 'next/link';

import Mail from '@/assets/svg/mail.svg?react';
import { PLATFORMS } from '@/constant/platforms';

const Footer = () => {
  return (
    <footer className="pt-5 md:pt-5">
      <div className="relative container mx-auto flex flex-col max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
        <h3 className="text-lg font-semibold text-white md:text-2xl">
          Contact us
        </h3>
        <section className="my-2.5 flex w-full flex-col justify-between gap-2.5 md:flex-row md:items-center">
          <a
            href="mailto:contact@publicai.io"
            className="border-b5 bg-b1 flex w-min items-center self-stretch rounded-lg border p-2 text-white md:px-4">
            <Mail className="text-primary size-4 md:size-6" />
            <p className="text-g1 ml-2 text-base md:text-xl">
              contact@publicai.io
            </p>
          </a>
          <address className="border-b5 bg-b1 flex w-max items-center gap-2 rounded-lg border p-2 md:px-4">
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
