import clsx from 'clsx';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

import ButtonWrapper from '@/components/ButtonWrapper';

const Button: FC<{
  children: ReactNode;
  href: string;
  ariaLabel: string;
  theme?: 'outlined' | 'primary';
}> = ({ children, href, ariaLabel, theme = 'outlined' }) => {
  return (
    <Link
      className={clsx(
        'w-60 text-base md:text-xl text-white py-2 font-medium text-center',
        ButtonWrapper.className,
        theme === 'primary' && 'bg-primary',
      )}
      style={theme !== 'primary' ? ButtonWrapper.style : undefined}
      href={href}
      target="_blank"
      rel="external noreferrer"
      aria-label={ariaLabel}>
      {children}
    </Link>
  );
};

export default Button;
