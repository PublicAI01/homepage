import Telegram from '@/assets/imgs/header/Navigation-Bar/telegram.svg';
import Twitter from '@/assets/imgs/header/Navigation-Bar/twitter.svg';
// import Quora from '@/assets/imgs/header/Navigation-Bar/quora.svg';
import Discord from '@/assets/imgs/header/Navigation-Bar/discord.svg';

export const navs = [{
  text: 'Home',
  href: '',
}, {
  text: 'Services',
  href: 'services',
}, {
  text: 'Roadmap',
  href: 'roadmap',
}, {
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
  href: 'https://discord.gg/sQcS7Sh6ZD',
  com: Discord,
  text: 'Discord',
},
// {
//   href: 'https://medium.com/@contact_88042',
//   com: Medium,
//   text: 'Medium',
// },
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
  href: 'https://t.me/Public_AI',
  com: Telegram,
  text: 'Telegram',
},
// {
//   href: 'https://www.youtube.com/@PublicAI_',
//   com: IconYoutube,
//   text: 'Youtube',
// },
];
