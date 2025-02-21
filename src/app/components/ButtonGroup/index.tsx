import Link from 'next/link';

import { DOCS_LINK } from '@/constant';
import { BORDER, BORDER_WITH_WHITE_BACKGROUND } from '@/constant/border';
import { cn } from '@/utils';

interface ButtonGroupProps extends React.ComponentProps<'div'> {
  closeSideNavFn?: () => void;
}

const ButtonGroup = (props: ButtonGroupProps) => {
  const { className, closeSideNavFn, ...rest } = props;
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-5 md:gap-8 lg:flex-row xl:gap-5',
        className,
      )}
      {...rest}>
      <Link
        className="relative rounded-sm px-4 py-2 text-center text-base font-semibold text-white max-lg:w-28 md:text-lg"
        style={{
          background: `url(${BORDER})`,
        }}
        role="button"
        href="/blog"
        aria-label="to blog list"
        onClick={closeSideNavFn}>
        Blog
      </Link>
      <Link
        className="relative rounded-sm px-4 py-2 text-center text-base font-semibold text-black max-lg:w-28 md:text-lg"
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
