'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FC } from 'react';

import styles from '@/app/components/ButtonGroup/ButtonGroup.module.css';
import { DOCS_LINK } from '@/constant';
import { BORDER, BORDER_WITH_WHITE_BACKGROUND } from '@/constant/border';

const ButtonGroup: FC<{ className?: string; closeSideNavFn?: () => void }> = ({
  className,
  closeSideNavFn,
}) => {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-5 md:gap-8 lg:flex-row xl:gap-5',
        className,
      )}>
      <div className="flex h-10 flex-col overflow-hidden md:h-11">
        <input
          className={clsx('hidden', styles['path-switch'])}
          type="checkbox"
          checked={pathname === '/products'}
          name={styles['path-switch']}
          onChange={() => {
            /** use `checked` must set onChange */
          }}
        />
        <Link
          className={clsx(
            'relative rounded px-4 py-2 text-center text-base font-semibold text-g1 transition-all duration-300 max-lg:w-28 md:text-lg',
            styles['products-btn'],
          )}
          style={{
            background: `url(${BORDER})`,
          }}
          role="button"
          href="/products"
          aria-label="to products page"
          prefetch
          onClick={closeSideNavFn}>
          Products
        </Link>
        <Link
          className={clsx(
            'relative rounded px-4 py-2 text-center text-base font-semibold text-g1 transition-all duration-300 max-lg:w-28 md:text-lg',
            styles['home-btn'],
          )}
          style={{
            background: `url(${BORDER})`,
          }}
          role="button"
          href="/"
          aria-label="to homepage"
          prefetch
          onClick={closeSideNavFn}>
          Home
        </Link>
      </div>
      <Link
        className="relative rounded px-4 py-2 text-center text-base font-semibold text-black max-lg:w-28 md:text-lg"
        style={{
          background: `url(${BORDER_WITH_WHITE_BACKGROUND})`,
        }}
        role="button"
        href={DOCS_LINK}
        target="_blank"
        rel="external noreferrer"
        aria-label="to documents website">
        Docs
      </Link>
    </div>
  );
};

export default ButtonGroup;
