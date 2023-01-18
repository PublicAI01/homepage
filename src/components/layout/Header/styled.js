import styled from 'styled-components';

export const StyledNavLink = styled.li`
  width: 100px;
  height: 48px;
  line-height: 48px;
  cursor: pointer;
  position: relative;
  opacity: 0.6;
  
  &:hover,&.active{
    font-weight: bold;
    opacity: 1;
  }
`;

export const StyledIconWrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;
  color: black;

  >div{
    width: 36px;
    height: 36px;
    background-color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    cursor: pointer;

    &:hover{
      background-color: rgb(255 255 255 / 0.8);
    }

    & + div {
      margin-left: 16px;
    }
  }
`;
