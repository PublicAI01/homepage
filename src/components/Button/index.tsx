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
        'app-shadow w-60 py-2 text-center text-base font-medium text-white shadow-white md:text-xl',
        theme === 'primary' && 'bg-primary',
        theme === 'normal' && 'border-primary border-2 bg-white text-black',
        className,
      )}
      style={{
        ...(!['primary', 'normal'].includes(theme)
          ? ButtonWrapper.style
          : undefined),
        ...style,
      }}
      target="_blank"
      rel="external noreferrer"
      {...rest}>
      {children}
    </Link>
  );
};

export default Button;
