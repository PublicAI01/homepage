'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FC } from 'react';

import styles from '@/app/components/ButtonGroup/SwitchButton.module.css';
import headerStyles from '@/app/components/Header/Header.module.css';
import { BORDER } from '@/constant/border';
import { cn } from '@/utils';

const SwitchButton: FC<{ className?: string; closeSideNavFn?: () => void }> = ({
  className,
  closeSideNavFn,
}) => {
  const pathname = usePathname();

  const isSmall = className?.includes(headerStyles['path-switch-small']);

  const btnClassName = cn(
    'relative rounded px-4 py-2 text-center text-base font-semibold text-g1 transition-all duration-300 max-lg:w-28 lg:text-lg',
    isSmall && 'max-md:w-20 max-md:px-2 max-md:py-1 max-md:text-sm',
  );

  return (
    <div
      className={cn(
        'flex h-10 flex-col overflow-hidden md:h-11',
        className,
        isSmall && 'h-7',
      )}>
      <input
        className={cn('hidden', styles['path-switch'])}
        type="checkbox"
        checked={pathname === '/products'}
        name={styles['path-switch']}
        onChange={() => {
          /** use `checked` must set onChange */
        }}
      />
      <Link
        className={cn(btnClassName, styles['products-btn'])}
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
        className={cn(btnClassName, styles['home-btn'])}
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
  );
};

export default SwitchButton;
