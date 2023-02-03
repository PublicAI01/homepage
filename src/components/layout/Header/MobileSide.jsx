import { SideSheet } from '@douyinfe/semi-ui';

import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useState } from 'react';
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
  }), [setVisible]);

  return (
    <SideSheet
      keepDOM
      title=" "
      headerStyle={{
        backgroundColor: 'rgb(0 0 0 / 0.8)',
      }}
      bodyStyle={{
        backgroundColor: 'rgb(0 0 0 / 0.8)',
      }}
      visible={visible}
      width="240px"
      onCancel={onClose}
      size="large"
    >
      <ul>
        {navs.map((nav) => (
          <StyledNavLink
            key={nav.text}
            className={classNames('header__nav', {
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
      <StyledIconWrap className="!ml-0">
        {platform.map(({ href, com: Com }, i) => (
          <a href={href} target="_blank " rel="noreferrer" key={i}>
            <Com width="24" height="24" fill="white" />
          </a>
        ))}
      </StyledIconWrap>
    </SideSheet>
  );
}

export default forwardRef(MobileSide);
