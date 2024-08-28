import Anchor from '@/components/Anchor';
import Title from '@/components/Title';
import { cn } from '@/utils';

interface SectionWrapperProps extends React.ComponentProps<'section'> {
  children: React.ReactNode;
  anchorId?: string;
  anchorClassName?: string;
  title?: string;
  titleClassName?: string;
  useMobileContainerWidth?: boolean;
  marginTop?: boolean;
  useFlexLayout?: boolean;
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
        'container mx-auto lg:w-[calc(100%_-_3rem)]',
        useFlexLayout && 'flex flex-col items-center',
        useMobileContainerWidth && 'max-lg:w-[var(--mobile-container-width)]',
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
