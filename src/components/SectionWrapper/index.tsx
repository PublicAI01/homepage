import Anchor from '@/components/Anchor';
import Title from '@/components/Title';
import { cn } from '@/utils';

interface SectionWrapperProps extends React.ComponentProps<'section'> {
  children: React.ReactNode;
  anchorId?: string;
  anchorClassName?: string;
  title?: string;
  titleClassName?: string;
  useFlexLayout?: boolean;
  useMobileContainerWidth?: boolean;
  marginTop?: boolean;
}

const SectionWrapper = (props: SectionWrapperProps) => {
  const {
    className,
    children,
    anchorId,
    anchorClassName,
    title,
    titleClassName,
    useFlexLayout = true,
    useMobileContainerWidth = true,
    marginTop = true,
    ...rest
  } = props;

  return (
    <section
      className={cn(
        'container mx-auto',
        useFlexLayout && 'flex flex-col items-center',
        useMobileContainerWidth &&
          'max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]',
        marginTop && 'mt-12 md:mt-20',
        anchorId && 'relative',
        className,
      )}
      {...rest}>
      {anchorId && (
        <Anchor
          className={anchorClassName}
          id={anchorId}
        />
      )}
      {title && <Title className={titleClassName}>{title}</Title>}
      {children}
    </section>
  );
};

export default SectionWrapper;
