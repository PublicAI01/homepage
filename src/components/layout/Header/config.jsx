import { IconGithubLogo } from '@douyinfe/semi-icons';
import { ReactComponent as Twitter } from '@/assets/imgs/header/Navigation-Bar/twitter.svg';
import { ReactComponent as Telegram } from '@/assets/imgs/header/Navigation-Bar/telegram.svg';
// import { ReactComponent as Quora } from '@/assets/imgs/header/Navigation-Bar/quora.svg';
import { ReactComponent as Medium } from '@/assets/imgs/header/Navigation-Bar/medium.svg';
import { ReactComponent as Discord } from '@/assets/imgs/header/Navigation-Bar/discord.svg';

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
  href: 'https://twitter.com/MarkerDAO_',
  com: Twitter,
}, {
  href: 'https://discord.gg/E962EdDmrB',
  com: Discord,
}, {
  href: 'https://medium.com/@contact_88042',
  com: Medium,
},
{
  href: 'https://github.com/MarkerDAO',
  // eslint-disable-next-line react/no-unstable-nested-components
  com: ({ width }) => (
    <IconGithubLogo
      className="text-white hover:text-white/80"
      style={{
        fontSize: `${width}px`,
      }}
    />
  ),
},
{
  href: 'https://t.me/MarkerDAO',
  com: Telegram,
}];
