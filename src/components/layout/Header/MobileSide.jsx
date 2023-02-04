import { SideSheet, Toast } from '@douyinfe/semi-ui';

import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useState } from 'react';
import LinearGradientBox from '@/components/comm/LinearGradientBox';
import { navs, platform } from './config';
import { StyledIconWrap, StyledNavLink } from './styled';

function MobileSide(props, ref) {
  const [visible, setVisible] = useState(false);

  const onClose = () => {
    setVisible(false);
  };

  const onOpen = () => {
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    onClose,
    onOpen,
    switch: () => {
      setVisible(!visible);
    },
  }), [visible, setVisible]);

  return (
    <SideSheet
      keepDOM
      title={null}
      style={{
        '--semi-color-bg-2': 'transparent',
      }}
      closable={false}
      className="top-[90px] backdrop-blur-[5px]"
      visible={visible}
      width="100%"
      onCancel={onClose}
      size="large"
    >
      <ul className="text-center">
        {navs.map((nav) => (
          <StyledNavLink
            key={nav.text}
            className={classNames('header__nav !w-full', {
              active: nav.text === 'Home',
              '!cursor-not-allowed': nav.disabled,
            })}
          >
            <a
              className={classNames('block w-full h-full text-base', {
                'pointer-events-none': nav.disabled,
              })}
              href={`#${nav.href}`}
              onClick={onClose}
            > {nav.text}
            </a>
          </StyledNavLink>
        ))}
      </ul>
      <StyledIconWrap className="!ml-0 justify-center mt-10 !gap-4">
        {platform.map(({ href, com: Com }, i) => (
          <a href={href} target="_blank " rel="noreferrer" key={i}>
            <Com width="36" height="36" fill="white" />
          </a>
        ))}
      </StyledIconWrap>
      <div className="text-center">
        <LinearGradientBox
          className="inline-block mt-10 font-bold text-center rounded-full whitespace-nowrap"
          onClick={() => Toast.info('coming soon.')}
        >
          <button className="hover:text-white/80 font-bold h-[42px] rounded-[inherit] !leading-[42px] w-[160px]  px-2">Launch App</button>
        </LinearGradientBox>
      </div>
    </SideSheet>
  );
}

export default forwardRef(MobileSide);
