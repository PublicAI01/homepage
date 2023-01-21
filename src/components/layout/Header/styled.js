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
  >a{
    width: 36px;
    height: 36px;
    cursor: pointer;
    & + a {
      margin-left: 8px;
    }
    &:hover{
      >svg{
        fill: rgb(255 255 255 / 0.8);
      }
    }
  }

`;
