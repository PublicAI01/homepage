import chip from '@/assets/svg/chip.svg?react';
import puzzle from '@/assets/svg/puzzle.svg?react';

const TWITTER_LINK = 'https://twitter.com/PublicAI_';
const TELEGRAM_LINK = 'https://t.me/public_ai01';
const DOCS_LINK = 'https://docs.publicai.io/publicai-documentation';
const DISCORD_LINK = 'https://discord.com/invite/WbmwUNyrhs';
const MEDIUM_LINK = 'https://medium.com/@contact_88042';
const CHROME_EXTENSION_LINK =
  'https://chromewebstore.google.com/detail/icbbdjflabjciapbohkkkmaangfjaanl';
const PUBLIC_AI_DATA_HUNTER_LINK = 'https://beta.publicai.io';
const GITHUB_LINK = 'https://github.com/PublicAI01';
const DUNE_LINK = 'https://dune.com/publicaiweb3/publicai-dashboard';
const TELEGRAM_MINI_APP_LINK = 'https://t.me/publicai_bot';
const NAV_LIST = [
  // { id: 'home', href: '/#home', label: 'Home' },
  {
    id: 'products',
    href: '/products',
    label: 'Products',
    children: [
      {
        Icon: puzzle,
        title: 'Building',
        children: [
          { id: 'hunter', href: '/products#hunter', label: 'Data Hunter' },
          { id: 'hub', href: '/products#hub', label: 'Data Hub' },
        ],
      },
      {
        Icon: chip,
        title: 'Application',
        children: [
          {
            id: 'database',
            href: '/products#database',
            label: 'Vector Database',
          },
          { id: 'api', href: '/products#api', label: 'Data API Suite' },
          { id: 'showcase', href: '/products#showcase', label: 'Showcase' },
        ],
      },
    ],
  },
  { id: 'partners', href: '/#partners', label: 'Partners', children: [] },
  { id: 'resource', href: '/#resource', label: 'Resource', children: [] },
  { id: 'faq', href: '/#faq', label: 'FAQ', children: [] },
] as const;

export {
  CHROME_EXTENSION_LINK,
  DISCORD_LINK,
  DOCS_LINK,
  DUNE_LINK,
  GITHUB_LINK,
  MEDIUM_LINK,
  NAV_LIST,
  PUBLIC_AI_DATA_HUNTER_LINK,
  TELEGRAM_LINK,
  TELEGRAM_MINI_APP_LINK,
  TWITTER_LINK,
};
