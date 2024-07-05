'use client';

import clsx from 'clsx';
import Link from 'next/link';

import ButtonGroup from '@/app/components/Header/ButtonGroup';
import headerStyles from '@/app/components/Header/Header.module.css';
import { NAV_LIST } from '@/constant';
import { PLATFORMS } from '@/constant/platforms';

const SideNav = () => {
	const closeSideNavFn = () => {
		document
			.querySelector<HTMLInputElement>(`.${headerStyles.switch}`)
			?.click();
	};

	return (
		<aside
			className={clsx(
				'fixed w-screen transition-all translate-x-full h-screen lg:hidden z-20',
				headerStyles['side-nav'],
			)}
			style={{
				paddingTop: 'var(--header-height)',
			}}>
			<nav className="w-4/5">
				<ul className="flex flex-col my-4">
					{NAV_LIST.map((nav) => (
						<li
							key={nav.id}
							className="text-center list-none">
							<Link
								className="text-base md:text-xl font-semibold text-white size-full block py-4"
								href={`/#${nav.id}`}
								aria-label={`to ${nav.label} section content`}
								onClick={closeSideNavFn}>
								{nav.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<ButtonGroup
				className="w-4/5"
				closeSideNavFn={closeSideNavFn}
			/>
			<address className="w-4/5 mt-20 flex items-center gap-4 justify-center">
				{PLATFORMS.map((item, index) => (
					<Link
						key={index}
						href={item.link}
						target="_blank"
						rel="external noreferrer"
						aria-label={`${item.label} link`}>
						<item.Icon className="size-6 md:size-10 text-g1" />
					</Link>
				))}
			</address>
		</aside>
	);
};

export default SideNav;
