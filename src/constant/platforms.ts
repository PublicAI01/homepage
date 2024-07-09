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

const PLATFORMS = [
  { Icon: twitter, label: 'x', link: TWITTER_LINK },
  { Icon: telegram, label: 'telegram', link: TELEGRAM_LINK },
  { Icon: medium, label: 'medium', link: MEDIUM_LINK },
  { Icon: discord, label: 'discord', link: DISCORD_LINK },
];

export { PLATFORMS };
