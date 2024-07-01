import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

import ButtonWrapper from '@/components/ButtonWrapper';

const Title: FC<{ className?: string; children: ReactNode }> = ({
	className,
	children,
}) => {
	return (
		<h3
			className={clsx(
				'w-80 text-3xl text-white py-1 font-bold text-center',
				ButtonWrapper.className,
				className,
			)}
			style={ButtonWrapper.titleStyle}>
			{children}
		</h3>
	);
};

export default Title;
