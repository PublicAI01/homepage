import styled from 'styled-components';
import { DEVICE } from '@/config/device';

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
  margin-left: 60px;
  color: black;
  gap: 16px;
  >a{
    font-size: 0;
    cursor: pointer;
    display: inline-block;
    @media ${DEVICE.nmd} {
      &:hover{
        >svg{
          fill: rgb(255 255 255 / 0.8);
        }
        >p{
          display: block;
        }
      }
    }
  }

`;
