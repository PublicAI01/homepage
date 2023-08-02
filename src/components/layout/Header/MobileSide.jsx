import { SideSheet, Toast } from '@douyinfe/semi-ui';
import styled from 'styled-components';
import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useState } from 'react';
import LinearGradientBox from '@/components/comm/LinearGradientBox';
import { navs, platform } from './config';
import { StyledIconWrap, StyledNavLink } from './styled';

const MySideSheet = styled(SideSheet)`
  --semi-color-bg-2: transparent;
  background-color: unset;
`;

function MobileSide(props, ref) {
  const { setWalletsModalVisibleFn } = props;
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
    <MySideSheet
      keepDOM
      title={null}
      style={{
      }}
      closable={false}
      className="top-[78px] backdrop-blur-[5px]"
      visible={visible}
      width="100%"
      onCancel={onClose}
      size="large"
      placement="top"
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
            <Com width="36" height="36" size={36} fill="white" />
          </a>
        ))}
      </StyledIconWrap>
      <div className="text-center mt-2">
        <LinearGradientBox
          className="inline-block font-bold text-center rounded-full whitespace-nowrap"
          onClick={() => {
            setWalletsModalVisibleFn(true);
          }}
        >
          <button className="hover:text-white/80 font-bold h-[42px] rounded-[inherit] !leading-[42px] w-[160px] px-2">
            Connect
          </button>
        </LinearGradientBox>
      </div>
    </MySideSheet>
  );
}

export default forwardRef(MobileSide);
