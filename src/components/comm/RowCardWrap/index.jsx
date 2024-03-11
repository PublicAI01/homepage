import classNames from 'classnames';
import React, { useMemo, useRef } from 'react';

import styled from 'styled-components';

const StyledRowCardWrap = styled.div`
  ::-webkit-scrollbar {
    display: block;
  }
`;

export default function RowCardWrap(props) {
  const { children, className } = props;
  const wrapRef = useRef();

  const onClickCard = (e) => {
    const target = e.currentTarget;
    const { offsetLeft, clientWidth: itemClientWidth } = target;
    const { offsetWidth, clientWidth: boxClientWidth } = wrapRef.current;
    const moveLeft = (boxClientWidth - itemClientWidth) / 2 + 24;
    wrapRef.current.scrollTo(offsetLeft < (offsetWidth / 2) ? 0 : offsetLeft - moveLeft, 0);
  };

  const _children = useMemo(() => React.Children.map(children, (child) => {
    const _child = React.cloneElement(child, {
      onClick: (event) => {
        onClickCard(event);
        child?.props?.onClick?.(event);
      },
    });
    return _child;
  }), [children]);

  return (
    <StyledRowCardWrap
      className={classNames('pb-4 scroll-smooth flex items-stretch flex-row overflow-x-auto overflow-y-hidden scrollbar scrollbar-h-2 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-[#eee] scrollbar-thumb-[#7A43FF]', className)}
      ref={wrapRef}
    >
      {_children}
    </StyledRowCardWrap>
  );
}
