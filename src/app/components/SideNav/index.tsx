'use client';

import Link from 'next/link';

import ButtonGroup from '@/app/components/ButtonGroup';
import headerStyles from '@/app/components/Header/Header.module.css';
import { NAV_LIST } from '@/constant';
import { PLATFORMS } from '@/constant/platforms';
import { cn } from '@/utils';

const SideNav = () => {
  const closeSideNavFn = () => {
    document
      .querySelector<HTMLInputElement>(`.${headerStyles.switch}`)
      ?.click();
  };

  return (
    <aside
      className={cn(
        'pt-header-height fixed z-20 h-screen w-screen translate-x-full transition-all xl:hidden',
        headerStyles['side-nav'],
      )}>
      <nav className="w-4/5">
        <ul className="my-4 flex flex-col">
          {NAV_LIST.map((nav) => (
            <li
              key={nav.id}
              className="list-none text-center">
              <Link
                className="block size-full py-4 text-base font-semibold text-white md:text-xl"
                href={nav.href}
                aria-label={`to ${nav.label} section content`}
                onClick={closeSideNavFn}>
                {nav.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ButtonGroup className="w-4/5" />
      <address className="mt-20 flex w-4/5 items-center justify-center gap-4">
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
    </aside>
  );
};

export default SideNav;
