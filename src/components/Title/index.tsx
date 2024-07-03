import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

import ButtonWrapper from '@/components/ButtonWrapper';

const Title: FC<{ className?: string; children: ReactNode }> = ({
	className,
	children,
}) => {
	return (
		<h1
			className={clsx(
				'md:w-80 w-60 text-xl md:text-3xl text-white py-1 font-bold text-center',
				ButtonWrapper.className,
				className,
			)}
			style={ButtonWrapper.titleStyle}>
			{children}
		</h1>
	);
};

export default Title;
