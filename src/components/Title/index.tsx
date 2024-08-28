import ButtonWrapper from '@/components/ButtonWrapper';
import { cn } from '@/utils';

interface TitleProps extends React.ComponentProps<'h2'> {
  children: React.ReactNode;
}

const Title = (props: TitleProps) => {
  const { className, style, children, ...rest } = props;

  return (
    <h2
      className={cn(
        'w-60 py-1 text-center text-xl font-bold text-white md:w-80 md:text-3xl',
        ButtonWrapper.className,
        className,
      )}
      style={{ ...ButtonWrapper.titleStyle, ...style }}
      {...rest}>
      {children}
    </h2>
  );
};

export default Title;
