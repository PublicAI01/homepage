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

export const StyledLaunchButton = styled.button`
  width: 160px;
  height: 42px;
  font-size: 18px;
  text-align: center;
  color: white;
  position: relative;
  border-radius: 60px;
  background-color: black;
  margin-left: 12px;
  font-weight: bold;
  box-shadow: 0px 16px 64px rgba(104, 1, 255, 0.12);
  
  &:hover{
    color: rgb(255 255 255 / 0.8);
  }
  

  >.gradient{
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    border-radius: inherit;
    z-index: -1;
    background-image: linear-gradient(85.13deg, rgba(104, 1, 254) 2.96%, rgba(217, 217, 217) 96.14%);
  }

`;
