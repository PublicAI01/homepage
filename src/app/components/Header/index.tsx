'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';

import ButtonGroup from '@/app/components/Header/ButtonGroup';
import styles from '@/app/components/Header/Header.module.css';
import publicai from '@/assets/svg/publicai.svg';
import { NAV_LIST } from '@/constant';

const Header = () => {
	const pathname = usePathname();
	const ioRef = useRef<IntersectionObserver>();
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
		if (pathname !== '/') {
			ioRef.current?.disconnect();
			setCurrentActiveNav(undefined);
			return;
		}

		ioRef.current = new IntersectionObserver(onNavActive, {
			threshold: 0.3,
			rootMargin: '66px 0px 0px 0px',
		});

		for (let index = 0; index < NAV_LIST.length; index++) {
			const el = document.querySelector(`#${NAV_LIST[index].id}`);
			if (el) {
				ioRef.current.observe(el);
			}
		}

		return () => {
			ioRef.current?.disconnect();
		};
	}, [pathname]);

	const onSideNavSwitchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (e.currentTarget.checked) {
			document.querySelector('body')?.classList.add('overflow-hidden');
		} else {
			document.querySelector('body')?.classList.remove('overflow-hidden');
		}
	};

	return (
		<>
			<input
				className={clsx('hidden', styles.switch)}
				type="checkbox"
				name={styles.switch}
				id={styles.switch}
				onChange={onSideNavSwitchChange}
			/>
			<label
				htmlFor={styles.switch}
				className={clsx(
					'transition-all z-50 duration-300 ease-in-out bg-white/5 backdrop-blur-sm fixed top-[var(--header-height)] left-0 w-1/5 bottom-0 h-full',
					styles.mask,
				)}
				aria-hidden></label>
			<header
				className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 md:px-24 bg-b1"
				style={{
					height: 'var(--header-height)',
				}}>
				<Link
					href="/"
					aria-label="return to homepage">
					<Image
						className="w-auto h-8"
						src={publicai}
						alt="publicai logo"
					/>
				</Link>
				<nav
					className={clsx(
						'flex items-center justify-center max-md:hidden',
						styles.nav,
					)}>
					<ul className="relative flex">
						{NAV_LIST.map((nav, index) => (
							<li
								key={index}
								className={clsx(
									'z-10 w-32 text-center list-none',
									currentActiveNav === nav.id && styles.current,
								)}>
								<Link
									className="py-2 block text-base font-semibold text-white"
									href={`/#${nav.id}`}
									aria-label={`to ${nav.label} section content`}>
									{nav.label}
								</Link>
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
				<ButtonGroup className="max-md:hidden" />
				<label
					htmlFor={styles.switch}
					className={clsx(styles['nav-icon'], 'md:hidden')}></label>
			</header>
		</>
	);
};

export default Header;
