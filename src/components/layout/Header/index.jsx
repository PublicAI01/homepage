import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Toast, Typography } from '@douyinfe/semi-ui';
import { StyledIconWrap, StyledNavLink } from './styled';
import logo from '@/assets/imgs/header/logo.png';
import LinearGradientBox from '@/components/comm/LinearGradientBox';
import MenuButton from '@/assets/imgs/header/menubutton.png';
import MobileSide from './MobileSide';
import { navs, platform } from './config';

function Header() {
  const sideRef = useRef();
  return (
    <header className="text-white bg-black/30 nmd:h-[120px] xmd:py-4 backdrop-blur-md fixed top-0 left-0 w-full z-40">
      <div className="h-full flex items-center container mx-auto">
        <div className="nmd:flex-shrink-0 mr-2 xmd:flex-1">
          <Link className="flex items-center" to="/">
            <img className="w-[62px]" src={logo} alt="logo" />
            <Typography.Title className="xmd:!text-lg" heading={2}><span className="font-light">Marker</span> DAO</Typography.Title>
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
              <Com width="24" height="24" fill="white" />
            </a>
          ))}
        </StyledIconWrap>

        <LinearGradientBox
          className="ml-[34px] w-[160px] h-[42px] text-center rounded-full whitespace-nowrap px-2 xmd:!hidden"
          onClick={() => Toast.info('coming soon.')}
        >
          <button className="hover:text-white/80 font-bold !leading-[42px] ">Launch App</button>
        </LinearGradientBox>

        <button
          className="nmd:hidden"
          onClick={() => {
            sideRef.current.onOpen();
          }}
        >
          <img src={MenuButton} alt="" width="40" height="40" />
        </button>

        <MobileSide ref={sideRef} />
      </div>
    </header>
  );
}

export default Header;
