/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { uri as MenuButtonUri } from '@/assets/imgs/header/menubutton.svg';
import LinearGradientBox from '@/components/comm/LinearGradientBox';
import classNames from 'classnames';
import {
  useMemo, useRef,
} from 'react';
import { Link } from 'react-router-dom';
import MobileSide from './MobileSide';
import { navs } from './config';
import { StyledNavLink } from './styled';

function Header({ setWalletsModalVisibleFn }) {
  const sideRef = useRef();

  return (
    <header className="text-white nmd:h-[88px] xmd:py-4 bg-black fixed top-0 left-0 w-full z-40 xmd:h-[78px]">
      <div className="backdrop-filter backdrop-blur-[5px] h-full flex items-center justify-between">
        <div className="nmd:flex-shrink-0 xmd:flex-1 ml-8">
          <Link className="flex items-center" to="/">
            <img className="xmd:w-[175px] w-[175px] mr-2" src="/logo-text.png" alt="logo" />
            {/* <Typography.Title className="nmd:!text-3xl xmd:!text-lg" heading={2}>Public.<span className="font-bold">AI</span></Typography.Title> */}
          </Link>
        </div>

        <div className="flex nmd:flex-wrap">
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

        <a
          href="https://docs.publicai.io/publicai-documentation"
          rel="noreferrer"
          target="_blank"
        >
          <LinearGradientBox
            className="inline-block rounded-full whitespace-nowrap xmd:!hidden nmd:mr-8"
          >
            <button className="hover:text-white/80 font-bold !leading-[42px] w-[160px] h-[42px] px-2">
              Docs
            </button>
          </LinearGradientBox>
        </a>

        <button
          className="nmd:hidden mr-4"
          onClick={() => sideRef.current.switch()}
        >
          <img
            className="transition-transform"
            onClick={(event) => {
              const rotateDeg = Number((event.currentTarget.style.transform || '').replace(/rotate\(((\d+)deg)\)/, '$2') || 0);
              event.currentTarget.style.transform = `rotate(${rotateDeg + 45}deg)`;
            }}
            src={MenuButtonUri}
            alt=""
            width="20"
            height="20"
          />
        </button>

        <MobileSide
          ref={sideRef}
          setWalletsModalVisibleFn={setWalletsModalVisibleFn}
        />
      </div>
    </header>
  );
}

export default Header;
