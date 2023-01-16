import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { StyledNavLink } from './styled';

function Header() {
  const location = useLocation();

  const navs = [{
    text: 'Marketplace',
    href: '/marketplace',
  }, {
    text: 'Deploy Oracles',
    href: '/deploy-oracles-panels',
  }, {
    text: 'Profile',
    href: '/profile',
  }];

  return (
    <header
      className="bg-black/10 nmd:h-[100px] border-b border-white/[0.15] text-gray-300 xmd:py-4"
      style={
        { backdropFilter: 'blur(5px)' }
      }
    >
      <div className="h-full flex items-center container mx-auto">
        <div className="w-[150px] nmd:flex-shrink-0 mr-2 xmd:flex-1 xmd:max-w-[150px]">
          <a href="/">
            logo
          </a>
        </div>

        <div className="ml-auto flex nmd:flex-wrap">
          <ul className="flex-1 flex items-center text-white text-center xmd:hidden">
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
      </div>
      <ul className="flex justify-center pt-2 nmd:hidden items-center text-white text-center">
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
