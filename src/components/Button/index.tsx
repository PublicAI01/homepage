import Link from 'next/link';

import ButtonWrapper from '@/components/ButtonWrapper';
import { cn } from '@/utils';

interface ButtonProps extends React.ComponentProps<typeof Link> {
  theme?: 'outlined' | 'primary' | 'normal';
}

const Button = (props: ButtonProps) => {
  const { className, style, theme = 'outlined', children, ...rest } = props;

  return (
    <Link
      className={cn(
        'app-shadow relative w-60 py-2 text-center text-base font-medium text-white shadow-white md:text-xl',
        'after:absolute after:inset-0.5 after:-z-1 after:overflow-hidden after:rounded-sm after:bg-linear-90 hover:after:from-[#5708FE] hover:after:to-[#999]',
        'active:translate-y-0.5 not-disabled:active:opacity-75 not-disabled:active:after:opacity-75 has-active:after:translate-y-0.5',
        theme === 'primary' && 'bg-[#4808FE] hover:bg-[#3700F0]',
        theme === 'normal' && 'border-primary border-2 bg-white text-black',
        className,
      )}
      style={{
        ...(!['primary', 'normal'].includes(theme)
          ? ButtonWrapper.style
          : undefined),
        ...style,
      }}
      role="button"
      target="_blank"
      rel="external noreferrer"
      {...rest}>
      {children}
    </Link>
  );
};

export default Button;
