import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Typography } from '@douyinfe/semi-ui';
import { IconTwitter } from '@douyinfe/semi-icons';
import { StyledIconWrap, StyledNavLink } from './styled';
import logo from '@/assets/imgs/header/logo.png';
import LinearGradientBox from '@/components/comm/LinearGradientBox';

function Header() {
  const location = useLocation();

  const navs = [{
    text: 'Home',
    href: '/',
  }, {
    text: 'Overview',
    href: '/overview',
    disabled: true,
  }, {
    text: 'Pricing',
    href: '/pricing',
    disabled: true,
  }, {
    text: 'Resources',
    href: '/resources',
    disabled: true,
  }, {
    text: 'Help',
    href: '/help',
    disabled: true,
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
                  className={classNames({
                    active: nav.href === location.pathname,
                    '!cursor-not-allowed': nav.disabled,
                  })}
                >
                  <Link
                    className={classNames('block w-full h-full', {
                      'pointer-events-none': nav.disabled,
                    })}
                    to={nav.href}
                  >{nav.text}
                  </Link>
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

        <LinearGradientBox className="ml-3 w-[160px] h-[42px] text-center rounded-full xmd:hidden">
          <button className="hover:text-white/80 font-bold !leading-[42px] ">Launch App</button>
        </LinearGradientBox>

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
