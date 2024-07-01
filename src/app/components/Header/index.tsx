import clsx from 'clsx';
import Image from 'next/image';

import styles from '@/app/components/Header/Header.module.css';
import publicai from '@/assets/svg/publicai.svg';
import { BORDER } from '@/constant/border';

const Header = () => {
	return (
		<header
			className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-24 py-4 bg-b1"
			style={{
				height: 'var(--header-height)',
			}}>
			<Image
				className="w-auto h-8"
				src={publicai}
				alt="publicai logo"
			/>
			<nav className={clsx('flex items-center justify-center', styles.nav)}>
				<ul className="relative flex">
					{['Home', 'Products', 'Partners', 'Resource'].map((nav, index) => (
						<li
							key={index}
							className="z-10 w-32 py-2 text-center list-none">
							<a
								className="text-base font-semibold text-white"
								href={`#${nav.toLocaleLowerCase()}`}
								target="_blank"
								rel="noopener noreferrer">
								{nav}
							</a>
						</li>
					))}
					<div
						className={clsx(
							'bg-primary w-1/4 h-full rounded absolute left-0 bottom-0',
							styles.slider,
						)}
						aria-hidden></div>
				</ul>
			</nav>
			<a
				className="px-3 py-1.5 relative rounded text-g1 text-base font-semibold"
				role="button"
				style={{
					background: `url(${BORDER})`,
				}}>
				Docs
			</a>
		</header>
	);
};

export default Header;
