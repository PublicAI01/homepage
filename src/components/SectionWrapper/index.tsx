import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

import Anchor from '@/components/Anchor';
import Title from '@/components/Title';

const SectionWrapper: FC<{
	children: ReactNode;
	className?: string;
	anchorId?: string;
	anchorClassName?: string;
	title?: string;
	titleClassName?: string;
	useMobileContainerWidth?: boolean;
	marginTop?: boolean;
}> = ({
	children,
	className,
	anchorId,
	anchorClassName,
	title,
	titleClassName,
	useMobileContainerWidth = true,
	marginTop = true,
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
