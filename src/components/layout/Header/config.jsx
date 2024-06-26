import Telegram from '@/assets/imgs/header/Navigation-Bar/telegram.svg';
import Twitter from '@/assets/imgs/header/Navigation-Bar/twitter.svg';
// import Quora from '@/assets/imgs/header/Navigation-Bar/quora.svg';
import Discord from '@/assets/imgs/header/Navigation-Bar/discord.svg';
import Medium from '@/assets/imgs/header/Navigation-Bar/medium.svg';

export const navs = [{
  text: 'Home',
  href: '',
}, {
  text: 'Services',
  href: 'services',
}, {
  text: 'Roadmap',
  href: 'roadmap',
},
// {
//   text: 'Tokenomics',
//   href: 'tokenomics',
// },
{
  text: 'Partners',
  href: 'partners',
}, {
  text: 'Resources',
  href: 'resources',
}];

export const platform = [{
  href: 'https://twitter.com/PublicAI_',
  com: Twitter,
  text: 'Twitter',
}, {
  href: 'https://t.me/public_ai01',
  com: Telegram,
  text: 'Telegram',
},
{
  href: 'https://medium.com/@contact_88042',
  com: Medium,
  text: 'Medium',
},
// {
//   href: 'https://github.com/PublicAI01',
//   // eslint-disable-next-line react/no-unstable-nested-components
//   com: ({ width, className }) => (
//     <IconGithubLogo
//       className={classNames('text-[#D7D7D7]', className)}
//       style={{
//         fontSize: `${width}px`,
//       }}
//     />
//   ),
//   text: 'Github',
// },
{
  href: 'https://discord.com/invite/WbmwUNyrhs',
  com: Discord,
  text: 'Discord',
},
// {
//   href: 'https://www.youtube.com/@PublicAI_',
//   com: IconYoutube,
//   text: 'Youtube',
// },
];
