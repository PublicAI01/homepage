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
    <SideSheet keepDOM title=" " visible={visible} width="100%" onCancel={onClose} size="large">
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
      <StyledIconWrap>
        {platform.map(({ href, com: Com }, i) => (
          <a href={href} target="_blank " rel="noreferrer" key={i}>
            <Com width="36" height="36" fill="white" />
          </a>
        ))}
      </StyledIconWrap>
    </SideSheet>
  );
}

export default forwardRef(MobileSide);
