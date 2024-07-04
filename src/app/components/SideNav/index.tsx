'use client';

import clsx from 'clsx';
import Link from 'next/link';

import ButtonGroup from '@/app/components/Header/ButtonGroup';
import headerStyles from '@/app/components/Header/Header.module.css';
import { NAV_LIST } from '@/constant';
import { PLATFORMS } from '@/constant/platforms';

const SideNav = () => {
	return (
		<aside
			className={clsx(
				'fixed w-screen transition-all translate-x-full h-screen md:hidden',
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
								className="text-base font-semibold text-white size-full block py-4"
								href={`/#${nav.id}`}
								aria-label={`to ${nav.label} section content`}
								onClick={() => {
									document
										.querySelector<HTMLInputElement>(`.${headerStyles.switch}`)
										?.click();
								}}>
								{nav.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<ButtonGroup className="w-4/5" />
			<address className="w-4/5 mt-20 flex items-center gap-4 justify-center">
				{PLATFORMS.map((item, index) => (
					<Link
						key={index}
						href={item.link}
						target="_blank"
						rel="external noreferrer"
						aria-label={`${item.label} link`}>
						<item.Icon className="size-6 text-g1" />
					</Link>
				))}
			</address>
		</aside>
	);
};

export default SideNav;
