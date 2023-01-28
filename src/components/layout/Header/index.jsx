import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Toast, Typography } from '@douyinfe/semi-ui';
import { IconGithubLogo } from '@douyinfe/semi-icons';
import { StyledIconWrap, StyledNavLink } from './styled';
import logo from '@/assets/imgs/header/logo.png';
import LinearGradientBox from '@/components/comm/LinearGradientBox';
import { ReactComponent as Twitter } from '@/assets/imgs/header/Navigation-Bar/twitter.svg';
import { ReactComponent as Telegram } from '@/assets/imgs/header/Navigation-Bar/telegram.svg';
import { ReactComponent as Quora } from '@/assets/imgs/header/Navigation-Bar/quora.svg';
import { ReactComponent as Medium } from '@/assets/imgs/header/Navigation-Bar/medium.svg';
import { ReactComponent as Discord } from '@/assets/imgs/header/Navigation-Bar/discord.svg';
import { toAnchor } from '@/utils/utils';

function Header() {
  const location = useLocation();

  const navs = [{
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

  const platform = [{
    href: 'https://twitter.com/MarkerDAO_',
    com: Twitter,
  }, {
    href: 'https://discord.gg/gpvb4cf8QE',
    com: Discord,
  }, {
    href: 'https://medium.com/@contact_88042',
    com: Medium,
  },
  {
    href: 'https://github.com/MarkerDAO',
    // eslint-disable-next-line react/no-unstable-nested-components
    com: () => <IconGithubLogo className="text-white text-[36px] hover:text-white/80" />,
  },
  {
    href: 'https://t.me/+3n0uhe65ECQxODBl',
    com: Telegram,
  }];

  return (
    <header className="text-white bg-black/30 nmd:h-[120px] xmd:py-4 backdrop-blur-md fixed top-0 left-0 w-full z-40">
      <div className="h-full flex items-center container mx-auto">
        <div className="nmd:flex-shrink-0 mr-2 xmd:flex-1">
          <Link className="flex items-center" to="/">
            <img className="w-[62px]" src={logo} alt="logo" />
            <Typography.Title heading={2}><span className="font-light">Marker</span> DAO</Typography.Title>
          </Link>
        </div>

        <div className="ml-auto flex nmd:flex-wrap">
          <ul className="flex-1 flex text-center xmd:hidden">
            {useMemo(
              () => navs.map((nav) => (
                <StyledNavLink
                  key={nav.text}
                  className={classNames('header__nav', {
                    active: nav.text === 'Home',
                    '!cursor-not-allowed': nav.disabled,
                  })}
                >
                  <a
                    className={classNames('block w-full h-full', {
                      'pointer-events-none': nav.disabled,
                    })}
                    href={`#${nav.href}`}
                    onClick={() => toAnchor(nav.href)}
                  > {nav.text}
                  </a>
                </StyledNavLink>
              )),
              [],
            )}
          </ul>

        </div>

        <StyledIconWrap className="xmd:!hidden">
          {platform.map(({ href, com: Com }, i) => (
            <a href={href} target="_blank " rel="noreferrer" key={i}>
              <Com width="36" height="36" fill="white" />
            </a>
          ))}
        </StyledIconWrap>

        <LinearGradientBox
          className="ml-3 w-[160px] h-[42px] text-center rounded-full whitespace-nowrap px-2"
          onClick={() => Toast.info('coming soon.')}
        >
          <button className="hover:text-white/80 font-bold !leading-[42px] ">Launch App</button>
        </LinearGradientBox>

      </div>
      {/* <ul className="flex justify-center pt-2 nmd:hidden items-center text-center">
        {useMemo(
          () => navs.map((nav) => (
            <StyledNavLink
              key={nav.text}
              className={classNames('header__nav', {
                active: nav.text === 'Home',
                '!cursor-not-allowed': nav.disabled,
              })}
            >
              <a
                className={classNames('block w-full h-full', {
                  'pointer-events-none': nav.disabled,
                })}
                href={`#${nav.href}`}
                onClick={() => toAnchor(nav.href)}
              > {nav.text}
              </a>
            </StyledNavLink>
          )),
          [],
        )}
      </ul> */}
    </header>
  );
}

export default Header;
