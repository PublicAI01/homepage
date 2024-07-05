import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

import { DOCS_LINK } from '@/constant';
import { BORDER, BORDER_WITH_WHITE_BACKGROUND } from '@/constant/border';

const ButtonGroup: FC<{ className?: string; closeSideNavFn?: () => void }> = ({
  className,
  closeSideNavFn,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-5 lg:flex-row md:gap-8 xl:gap-5',
        className,
      )}>
      <Link
        className="text-g1 relative px-4 py-2 text-base font-semibold text-center rounded max-lg:w-28 md:text-xl"
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
        className="relative px-4 py-2 text-base font-semibold text-center text-black rounded max-lg:w-28 md:text-xl"
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
