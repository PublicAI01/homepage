import Link from 'next/link';
import type { FC, ReactNode } from 'react';

import ButtonWrapper from '@/components/ButtonWrapper';
import { cn } from '@/utils';

const Button: FC<{
  children: ReactNode;
  href: string;
  ariaLabel: string;
  theme?: 'outlined' | 'primary' | 'normal';
}> = ({ children, href, ariaLabel, theme = 'outlined' }) => {
  return (
    <Link
      className={cn(
        'w-60 py-2 text-center text-base font-medium text-white md:text-xl',
        ButtonWrapper.className,
        theme === 'primary' && 'bg-primary',
        theme === 'normal' && 'border-2 border-primary bg-white text-black',
      )}
      style={
        !['primary', 'normal'].includes(theme) ? ButtonWrapper.style : undefined
      }
      href={href}
      target="_blank"
      rel="external noreferrer"
      aria-label={ariaLabel}>
      {children}
    </Link>
  );
};

export default Button;
