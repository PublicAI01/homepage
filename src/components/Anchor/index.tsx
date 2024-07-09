import type { FC } from 'react';

import { cn } from '@/utils';

const Anchor: FC<{ className?: string; id: string }> = ({ className, id }) => {
  return (
    <div
      aria-hidden
      id={id}
      className={cn('absolute inset-0 -z-2', className)}></div>
  );
};

export default Anchor;
