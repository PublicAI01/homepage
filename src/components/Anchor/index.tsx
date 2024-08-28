import { cn } from '@/utils';

interface AnchorProps extends React.ComponentProps<'div'> {}

const Anchor = (props: AnchorProps) => {
  const { className, ...rest } = props;

  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 -z-2', className)}
      {...rest}></div>
  );
};

export default Anchor;
