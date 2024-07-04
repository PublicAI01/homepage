import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

import { DOCS_LINK } from '@/constant';
import { BORDER, BORDER_WITH_WHITE_BACKGROUND } from '@/constant/border';

const ButtonGroup: FC<{ className?: string }> = ({ className }) => {
	return (
		<div
			className={clsx(
				'flex flex-col md:flex-row items-center gap-5',
				className,
			)}>
			<Link
				className="relative px-4 py-2 text-base font-semibold rounded text-g1 max-md:w-28 text-center"
				role="button"
				href="/products"
				style={{
					background: `url(${BORDER})`,
				}}>
				Products
			</Link>
			<Link
				className="relative px-4 py-2 text-base font-semibold text-black rounded max-md:w-28 text-center"
				role="button"
				href={DOCS_LINK}
				target="_blank"
				rel="external noreferrer"
				style={{
					background: `url(${BORDER_WITH_WHITE_BACKGROUND})`,
				}}>
				Docs
			</Link>
		</div>
	);
};

export default ButtonGroup;
