'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ChangeEventHandler, useEffect, useRef, useState } from 'react';

import ButtonGroup from '@/app/components/ButtonGroup';
import SwitchButton from '@/app/components/ButtonGroup/SwitchButton';
import styles from '@/app/components/Header/Header.module.css';
import publicai from '@/assets/svg/publicai.svg';
import { NAV_LIST } from '@/constant';
import { cn } from '@/utils';

const Header = () => {
  const pathname = usePathname();
  const ioRef = useRef<IntersectionObserver>();
  const [currentActiveNav, setCurrentActiveNav] = useState<string>();

  const onNavActive = (entries: IntersectionObserverEntry[]) => {
    const list = entries.reduce<string[]>((t, v) => {
      if (v.isIntersecting) {
        return [...t, v.target.id];
      }

      return t;
    }, []);

    if (list[0]) {
      setCurrentActiveNav(list[0]);
    }
  };

  useEffect(() => {
    if (pathname !== '/') {
      ioRef.current?.disconnect();
      setCurrentActiveNav(undefined);
      return;
    }

    ioRef.current = new IntersectionObserver(onNavActive, {
      threshold: 0.3,
      rootMargin: '66px 0px 0px 0px',
    });

    for (let index = 0; index < NAV_LIST.length; index++) {
      const el = document.querySelector(`#${NAV_LIST[index].id}`);
      if (el) {
        ioRef.current.observe(el);
      }
    }

    return () => {
      ioRef.current?.disconnect();
    };
  }, [pathname]);

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
          'fixed bottom-0 left-0 top-[var(--header-height)] z-50 h-full w-1/5 bg-white/5 backdrop-blur-sm transition-all duration-300 ease-in-out',
          styles.mask,
        )}
        aria-hidden></label>
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-b1 px-4 lg:px-12 xl:px-24"
        style={{
          height: 'var(--header-height)',
        }}>
        <Link
          className="flex h-[var(--header-height)] items-center"
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
          <Image
            className="h-6 w-auto md:h-8"
            src={publicai}
            height={32}
            alt="publicai logo"
          />
        </Link>
        <nav
          className={cn(
            'flex items-center justify-center max-lg:hidden',
            styles.nav,
          )}>
          <ul className="relative flex">
            {NAV_LIST.map((nav, index) => (
              <li
                key={index}
                className={cn(
                  'z-10 w-32 list-none text-center',
                  currentActiveNav === nav.id && styles.current,
                )}>
                <Link
                  className="block py-2 text-base font-semibold text-white"
                  href={`/#${nav.id}`}
                  aria-label={`to ${nav.label} section content`}>
                  {nav.label}
                </Link>
              </li>
            ))}
            <div
              className={cn(
                'absolute bottom-0 left-0 h-full w-1/4 rounded bg-primary',
                styles.slider,
                !currentActiveNav && 'opacity-0',
              )}
              aria-hidden></div>
          </ul>
        </nav>
        <ButtonGroup className="max-lg:hidden" />
        <div className="flex items-center gap-3 lg:hidden">
          <SwitchButton className={styles['path-switch-small']} />
          <label
            htmlFor={styles.switch}
            className={cn(
              'flex items-center justify-center',
              styles['nav-icon-container'],
            )}>
            <div
              className={styles['nav-icon']}
              aria-hidden></div>
          </label>
        </div>
      </header>
    </>
  );
};

export default Header;
