import styled from 'styled-components';
import LinearGradientBox from '@/components/comm/LinearGradientBox';
import { DEVICE } from '@/config/device';

const StyledSectionWrap = styled.div.attrs({ className: 'section-wrap' })`
  position: relative;
  @media ${DEVICE.nmd}{
    padding-top: 5rem;
    padding-bottom: 5rem;
    padding-left: 15%;
    padding-right: 15%;
    
    h1.semi-typography {
      font-size: 2.5rem;
      line-height: 2.5rem;
    }
  }
  @media ${DEVICE.xmd}{
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 5%;
    padding-right: 5%;

    h1.semi-typography {
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }
`;

export function SectionWrap({ id, className, children }) {
  return (
    <div className={className}>
      <div id={id} className="w-screen h-10 invisible">Invisible link prevent the header cover content</div>
      <StyledSectionWrap>{children}</StyledSectionWrap>
    </div>
  );
}

export const StyledServiceCard = styled.div`
  position: relative;
  transition: 0.2s transform;
  border-radius: 10px;
  overflow: hidden;
  background: var(--linear-gradient-bg-gray),
      url(/src/assets/imgs/home/service-card-bg.png) left top / 100% 100%;
  border: 4px solid #3A3A3A;

  >.content{
    position: relative;
    padding: 0 45px 40px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 520px;
    backdrop-filter: blur(54px);
    z-index: 2;
    
    >.title-wrap{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 24px;
      >h1{
        font-size: 48px;
        &:last-child{
          color: black;
          padding: 6px;
          border-radius: 4px;
          background-image: var(--linear-gradient-bg-silver);
        }
        & + h1{
          margin-left: 12px;
        }
      }
    }
    >p{
      padding: 10px;
      background-image: var(--linear-gradient-bg-black);
    }
  }
  >.bg{
    display: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 70%;
    z-index: 1;
  }
  @media ${DEVICE.nmd} {
    &:hover {
      transform: scale(1.1);
      z-index: 4;
      >.content{
        >.title-wrap{
          >h1 {
            &:last-child{
              background-image: var(--linear-gradient-bg-pink);
            }
          }
        }
        >p{
          background-image: var(--linear-gradient-bg-pink);
        }
      }

      >.bg{
        display: block;
      }
    }
  }
  
  @media ${DEVICE.xmd} {
    background: none;
    border: none;
    >.content{
      height: auto;
      padding: 12px;
      >.title-wrap{
        margin-bottom: 4px;
        >h1{
          font-size: 24px;
          &:last-child{
            font-size: 20px;
            line-height: 1;
            ${({ gold }) => gold && 'background-image: var(--linear-gradient-bg-gold) !important;'}
          }
        }
      }
      >p{
        border-radius: 10px;
      }
    }
  }
`;

export const RoadMapCard = styled(LinearGradientBox).attrs({
  nolinear: true,
  hover: true,
  linear: 'var(--linear-gradient-border-green)',
  borderWidth: 4,
})`
  padding: 28px; 
  min-height: 240px;
  min-width: 340px;
  border-radius: 12px;
  background-color: white;
  > *{
    color: black;
  }
  &:hover {
    background-color: #7A43FF;
  }
  :hover > *{
    color: white;
  }
  &+div{
    margin-left: 12px;
  }
  @media ${DEVICE.xmd} {
    min-height: auto;
    min-width: 260px;
  }
`;

export const FQCard = styled(LinearGradientBox).attrs({
  nolinear: true,
  hover: true,
  borderWidth: 0,
})`
  padding: 12px 18px;
  color: #131313;
  border-radius: 12px;
  cursor: pointer;
  background-color: #131313;
  &:hover {
    background-color: #7A43FF;
  }
  :hover > *{
    color: white;
  }
  &+div{
    margin-top: 12px;
  }
  >.header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    >.icon {
      border-radius: 50%;
      background-color: #3E3E3E;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      &:hover{
        background: #3E3E3E90;
      }
      >span{
        transition: .3s transform;
        &.active {
          transform: rotate(90deg);
        }
      }
    }
  }
  @media ${DEVICE.xmd} {
    padding: 12px;
  }
`;
