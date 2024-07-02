'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import styles from '@/app/components/Header/Header.module.css';
import publicai from '@/assets/svg/publicai.svg';
import { DOCS_LINK } from '@/constant';
import { BORDER, BORDER_WITH_WHITE_BACKGROUND } from '@/constant/border';

const NAV_LIST = [
	{ id: 'home', label: 'Home' },
	{ id: 'partners', label: 'Partners' },
	{ id: 'resource', label: 'Resource' },
	{ id: 'faq', label: 'FAQ' },
];

const Header = () => {
	const [currentActiveNav, setCurrentActiveNav] = useState<string>();

	const onNavActive = (entries: IntersectionObserverEntry[]) => {
		const list = entries.reduce<string[]>((t, v) => {
			if (v.isIntersecting) {
				return [...t, v.target.id];
			}

			return t;
		}, []);

		if (list[0]) {
			setCurrentActiveNav(list[0]);
		}
	};

	useEffect(() => {
		const homeEl = document.querySelector(`#${NAV_LIST[0].id}`);

		if (!homeEl) return;

		const io = new IntersectionObserver(onNavActive, { threshold: 0.1 });

		for (let index = 0; index < NAV_LIST.length; index++) {
			const el = document.querySelector(`#${NAV_LIST[index].id}`);
			if (el) {
				io.observe(el);
			}
		}

		return () => {
			io.disconnect();
		};
	}, []);

	return (
		<header
			className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-24 py-4 bg-b1"
			style={{
				height: 'var(--header-height)',
			}}>
			<a href="/">
				<Image
					className="w-auto h-8"
					src={publicai}
					alt="publicai logo"
				/>
			</a>
			<nav className={clsx('flex items-center justify-center', styles.nav)}>
				<ul className="relative flex">
					{NAV_LIST.map((nav, index) => (
						<li
							key={index}
							className={clsx(
								'z-10 w-32 py-2 text-center list-none',
								currentActiveNav === nav.id && styles.current,
							)}>
							<a
								className="text-base font-semibold text-white"
								href={`/#${nav.id}`}>
								{nav.label}
							</a>
						</li>
					))}
					<div
						className={clsx(
							'bg-primary w-1/4 h-full rounded absolute left-0 bottom-0',
							styles.slider,
							!currentActiveNav && 'opacity-0',
						)}
						aria-hidden></div>
				</ul>
			</nav>
			<div className="flex items-center gap-5">
				<a
					className="relative px-4 py-2 text-base font-semibold rounded text-g1"
					role="button"
					href="/products"
					style={{
						background: `url(${BORDER})`,
					}}>
					Products
				</a>
				<a
					className="relative px-4 py-2 text-base font-semibold text-black rounded"
					role="button"
					href={DOCS_LINK}
					target="_blank"
					rel="external noreferrer"
					style={{
						background: `url(${BORDER_WITH_WHITE_BACKGROUND})`,
					}}>
					Docs
				</a>
			</div>
		</header>
	);
};

export default Header;
