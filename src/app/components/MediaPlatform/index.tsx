import clsx from 'clsx';

import headerStyles from '@/app/components/Header/Header.module.css';
import styles from '@/app/components/MediaPlatform/MediaPlatform.module.css';
import { PLATFORMS } from '@/constant/platforms';

const MediaPlatform = () => {
	return (
		<aside
			className={clsx(
				'fixed z-50 flex flex-col gap-4 md:right-5 right-1 top-1/2',
				headerStyles['side-media-platform'],
			)}>
			{PLATFORMS.map((item, index) => (
				<a
					key={index}
					className={clsx(
						styles.platform,
						'relative transition-transform md:hover:scale-150',
					)}
					href={item.link}
					target="_blank"
					rel="external noreferrer">
					<item.Icon className="transition-colors rounded-full size-6 md:size-9 text-g1 hover:text-white" />
					<p className="absolute text-2xl leading-6 -translate-x-full -translate-y-1/2 md:leading-9 md:text-4xl -left-2 text-g1 top-1/2">
						{item.label}
					</p>
				</a>
			))}
		</aside>
	);
};

export default MediaPlatform;
