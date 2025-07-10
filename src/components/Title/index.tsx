import { cn } from '@/utils';

interface TitleProps extends React.ComponentProps<'h2'> {
  children: React.ReactNode;
}

const Title = (props: TitleProps) => {
  const { className, children, ...rest } = props;

  return (
    <h2
      className={cn(
        'w-60 py-1 text-center text-xl font-bold text-white md:w-80 md:text-3xl',
        className,
      )}
      {...rest}>
      {children}
    </h2>
  );
};

export default Title;
