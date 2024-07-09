import type { FC, ReactNode } from 'react';

import ButtonWrapper from '@/components/ButtonWrapper';
import { cn } from '@/utils';

const Title: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <h2
      className={cn(
        'w-60 py-1 text-center text-xl font-bold text-white md:w-80 md:text-3xl',
        ButtonWrapper.className,
        className,
      )}
      style={ButtonWrapper.titleStyle}>
      {children}
    </h2>
  );
};

export default Title;
