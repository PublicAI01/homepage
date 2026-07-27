'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ChangeEventHandler } from 'react';

import ButtonGroup from '@/app/components/ButtonGroup';
import styles from '@/app/components/Header/Header.module.css';
import PublicAI from '@/assets/svg/publicai.svg?react';
import { NAV_LIST } from '@/constant';
import { cn } from '@/utils';

const Header = () => {
  const pathname = usePathname();

  const onSideNavSwitchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.currentTarget.checked) {
      document.querySelector('body')?.classList.add('overflow-hidden');
    } else {
      document.querySelector('body')?.classList.remove('overflow-hidden');
    }
  };

  return (
    <>
      <input
        className={cn('hidden', styles.switch)}
        type="checkbox"
        name={styles.switch}
        id={styles.switch}
        onChange={onSideNavSwitchChange}
      />
      <label
        htmlFor={styles.switch}
        className={cn(
          'top-header-height fixed bottom-0 left-0 z-50 h-full w-1/5 bg-white/5 backdrop-blur-xs transition-all duration-300 ease-in-out',
          styles.mask,
        )}
        aria-hidden></label>
      <header className="bg-b1 h-header-height fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 lg:px-12 xl:px-24">
        <Link
          className="flex h-full items-center"
          href="/"
          aria-label="return to homepage"
          onClick={() => {
            const switchEl = document.querySelector<HTMLInputElement>(
              `.${styles.switch}`,
            );

            if (switchEl?.checked) {
              switchEl?.click();
            }
          }}>
          <PublicAI
            className="h-6 w-auto text-white md:h-8"
            aria-label="publicai logo"
          />
        </Link>
        <nav
          className={cn(
            'flex items-center justify-center max-xl:hidden',
            styles.nav,
          )}>
          <menu className="relative flex">
            {NAV_LIST.map((nav, index) =>
              nav.comingSoon ? (
                <li
                  key={index}
                  className={cn(
                    'relative z-10 flex list-none cursor-default items-center justify-center gap-1.5 py-2 text-center select-none',
                    styles['coming-soon'],
                  )}>
                  <span className="text-base font-semibold text-white/50">
                    {nav.label}
                  </span>
                  <span className="bg-primary/20 text-p1 rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold whitespace-nowrap uppercase">
                    Coming soon
                  </span>
                </li>
              ) : (
                <li
                  key={index}
                  className={cn(
                    'relative z-10 list-none text-center',
                    pathname === nav.href && styles.current,
                  )}>
                  <Link
                    className="block py-2 text-base font-semibold text-white"
                    href={nav.href}
                    aria-label={`to ${nav.label} page`}
                    aria-current={pathname === nav.href ? 'page' : undefined}>
                    {nav.label}
                  </Link>
                </li>
              ),
            )}
            <div
              className={cn(
                'absolute bottom-0 left-0 h-full w-1/3 rounded-sm',
                styles.slider,
              )}
              aria-hidden></div>
          </menu>
        </nav>
        <ButtonGroup className="max-xl:hidden" />
        <label
          htmlFor={styles.switch}
          className={cn(
            'flex items-center justify-center xl:hidden',
            styles['nav-icon-container'],
          )}>
          <div
            className={styles['nav-icon']}
            aria-hidden></div>
        </label>
      </header>
    </>
  );
};

export default Header;
