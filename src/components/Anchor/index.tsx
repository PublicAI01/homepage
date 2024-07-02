import clsx from 'clsx';
import type { FC } from 'react';

const Anchor: FC<{ className?: string; id: string }> = ({
	className = '-top-20',
	id,
}) => {
	return (
		<div
			aria-hidden
			id={id}
			className={clsx('absolute inset-0 -z-2', className)}></div>
	);
};

export default Anchor;
