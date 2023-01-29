import classNames from 'classnames';
import { useState } from 'react';
import styled from 'styled-components';

const StyledBox = styled.button`
  font-size: 0;
  border: 8px solid transparent;

  >span{
    width: 28px;
    display: block;
    height: 2px;
    background-color: ${(props) => props.bgcolor || 'white'};
    border-radius: 8px;
    transition: 0.3s all;
    &+span {
      margin-top: 8px;
    }
  }

  &.icon--close{
    >.left {
      transform: translateY(10px)  rotate(-45deg);
    }
    >.middle{
      transform: translateX(-50%);
      opacity: 0;
    }
    >.right{
      transform: translateY(-10px) rotate(45deg);
    }
  }

`;
function MenuToCloseIcon(props) {
  const { className, onClick, disable } = props;

  const [isClose, setIsClose] = useState(false);

  return (
    <StyledBox
      className={classNames(className, {
        'icon--close': !disable && isClose,
      })}
      onClick={() => {
        setIsClose(!isClose);
        onClick && onClick(!isClose);
      }}
    >
      <span className="left" />
      <span className="middle" />
      <span className="right" />
    </StyledBox>
  );
}

export default MenuToCloseIcon;
