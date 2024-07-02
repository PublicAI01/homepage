import clsx from 'clsx';

import styles from '@/app/components/MediaPlatform/MediaPlatform.module.css';
import discord from '@/assets/media-platform/discord.svg?react';
import medium from '@/assets/media-platform/medium.svg?react';
import telegram from '@/assets/media-platform/telegram.svg?react';
import twitter from '@/assets/media-platform/twitter.svg?react';
import {
	DISCORD_LINK,
	MEDIUM_LINK,
	TELEGRAM_LINK,
	TWITTER_LINK,
} from '@/constant';

const MediaPlatform = () => {
	return (
		<aside className="fixed z-50 flex flex-col gap-4 md:right-5 right-1 top-1/2">
			{[
				{ Icon: twitter, label: 'twitter', link: TWITTER_LINK },
				{ Icon: telegram, label: 'telegram', link: TELEGRAM_LINK },
				{ Icon: medium, label: 'medium', link: MEDIUM_LINK },
				{ Icon: discord, label: 'discord', link: DISCORD_LINK },
			].map((item, index) => (
				<a
					key={index}
					className={clsx(
						styles.platform,
						'relative transition-transform md:hover:scale-150',
					)}
					href={item.link}
					target="_blank "
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
