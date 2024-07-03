import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

import Anchor from '@/components/Anchor';
import Title from '@/components/Title';

const SectionWrapper: FC<{
	children: ReactNode;
	className?: string;
	title?: string;
	titleClassName?: string;
	useMobileContainerWidth?: boolean;
	marginTop?: boolean;
	anchorId?: string;
}> = ({
	children,
	className,
	title,
	titleClassName,
	useMobileContainerWidth = true,
	marginTop = true,
	anchorId,
}) => {
	return (
		<section
			className={clsx(
				'container flex flex-col items-center mx-auto',
				useMobileContainerWidth && 'max-md:w-[var(--mobile-container-width)]',
				marginTop && 'mt-12 md:mt-20',
				anchorId && 'relative',
				className,
			)}>
			{anchorId && <Anchor id={anchorId} />}
			{title && <Title className={titleClassName}>{title}</Title>}
			{children}
		</section>
	);
};

export default SectionWrapper;
