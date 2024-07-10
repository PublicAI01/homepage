import Link from 'next/link';

import Mail from '@/assets/svg/mail.svg?react';
import { PLATFORMS } from '@/constant/platforms';

const Footer = () => {
  return (
    <footer className="pt-5 md:pt-5">
      <div className="container relative mx-auto flex flex-col max-lg:w-[var(--mobile-container-width)]">
        <h3 className="text-lg font-semibold text-white md:text-2xl">
          Contact us
        </h3>
        <section className="my-2.5 flex w-full flex-col justify-between gap-2.5 md:flex-row md:items-center">
          <a
            href="mailto:contact@publicai.io"
            className="flex w-min items-center self-stretch rounded-lg border border-b5 bg-b1 p-2 text-white md:px-4">
            <Mail className="size-4 text-primary md:size-6" />
            <p className="ml-2 text-base text-g1 md:text-xl">
              contact@publicai.io
            </p>
          </a>
          <address className="flex w-max items-center gap-2 rounded-lg border border-b5 bg-b1 p-2 md:px-4">
            <p className="text-base font-normal not-italic text-g1 md:mr-2 md:text-xl">
              Stay Connected
            </p>
            {PLATFORMS.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                target="_blank"
                rel="external noreferrer"
                aria-label={`${item.label} link`}>
                <item.Icon className="size-6 text-g1 md:size-10" />
              </Link>
            ))}
          </address>
        </section>
        <span className="mb-2.5 mt-5 text-center text-sm text-g2 md:mt-7 md:text-base">
          © {new Date().getFullYear()} PublicAI All Rights Reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
