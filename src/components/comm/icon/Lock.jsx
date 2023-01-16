import { useEffect, useState } from 'react';
import styled from 'styled-components';
import cn from 'classnames';

const StyledLock = styled.div`
  padding: 8px;
  border-radius: 2px;
  >.lock-header {
    height: 7px;
    width: 10px;
    overflow: hidden;
    text-align: center;
    display: inline-block;
    transform-origin: 80% bottom;
    transform: rotateY(${({ lock }) => (!lock ? '180deg' : '0deg')});
    transition: transform .1s;

    >div{
      border: 3px solid white;
      height: 200%;
      width: 100%;
      border-radius: 60px;
    }
    
  }
  >.lock-body {
    margin-top: 2px;
    background-color: white;
    width: 13px;
    height: 8px;
    border-radius: 1px;
  }

  /* &:hover{
    >.lock-header {
      transform: rotateY(${({ lock }) => (lock ? '180deg' : '0deg')});
    }
  } */
`;

function Lock(props) {
  const { lock, className } = props;

  const [islock, setIslock] = useState(false);

  useEffect(() => {
    if (typeof lock === 'boolean') {
      setIslock(lock);
    }
  }, [lock]);

  return (
    <StyledLock
      className={cn('text-center text-[0px] cursor-pointer hover:bg-gray-400/50', className)}
      lock={islock}
    >
      <div className="lock-header">
        <div />
      </div>
      <div className="lock-body" />
    </StyledLock>
  );
}

export default Lock;
