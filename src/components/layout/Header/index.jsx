import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Typography } from '@douyinfe/semi-ui';
import { IconTwitter } from '@douyinfe/semi-icons';
import { StyledIconWrap, StyledLaunchButton, StyledNavLink } from './styled';
import logo from '@/assets/imgs/header/logo.png';

function Header() {
  const location = useLocation();

  const navs = [{
    text: 'Home',
    href: '/',
  }, {
    text: 'Overview',
    href: '/overview',
  }, {
    text: 'Pricing',
    href: '/pricing',
  }, {
    text: 'Resources',
    href: '/resources',
  }, {
    text: 'Help',
    href: '/help',
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
                <StyledNavLink key={nav.text} className={nav.href === location.pathname ? 'active' : ''}>
                  <Link className="block w-full h-full" to={nav.href}>{nav.text}</Link>
                </StyledNavLink>
              )),
              [],
            )}
          </ul>

        </div>

        <StyledIconWrap className="xmd:!hidden">
          <div><IconTwitter /></div>
          <div><IconTwitter /></div>
          <div><IconTwitter /></div>
        </StyledIconWrap>

        <StyledLaunchButton className="xmd:hidden">
          Launch App
          <div className="gradient" />
        </StyledLaunchButton>

      </div>
      <ul className="flex justify-center pt-2 nmd:hidden items-center text-center">
        {useMemo(
          () => navs.map((nav) => (
            <StyledNavLink
              key={nav.text}
              className={classNames('!w-auto flex-1', {
                active: nav.href === location.pathname,
              })}
            >
              <Link className="block w-full h-full" to={nav.href}>{nav.text}</Link>
            </StyledNavLink>
          )),
          [],
        )}
      </ul>
    </header>
  );
}

export default Header;
