import styled from 'styled-components';
import LinearGradientBox from '@/components/comm/LinearGradientBox';

export const SectionWrap = styled.div`
  padding-top: 60px;
  padding-bottom: 60px;
  position: relative;
`;

export const StyledServiceCard = styled.div`
  background: var(--linear-gradient-bg-gray),
    url(/src/assets/imgs/home/service-card-bg.png) left top / 100% 100%;
  /* border: 4px solid #3A3A3A; */
  backdrop-filter: blur(103.5px);
  border-radius: 10px;
  padding: 0 45px 40px;
  height: 520px;
  transition: 0.2s transform;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  >.title-wrap{
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    >h1{
      font-size: 48px;
      &:last-child{
        /* color: black; */
        padding: 6px;
        border-radius: 4px;
        background-image: var(--linear-gradient-bg-gray);
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
  
  &:hover {
    transform: scale(1.1);
    z-index: 2;
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
`;

export const RoadMapCard = styled(LinearGradientBox).attrs({
  nolinear: true,
  hover: true,
  linear: 'var(--linear-gradient-border-green)',
  borderWidth: 4,
})`
  padding: 32px 32px 0; 
  height: 380px;
  width: 340px;
  border: 1px solid #4e4e4e;
  border-radius: 12px;
  &:hover {
    border-color: transparent;
  }
  &+div{
    margin-left: 12px;
  }
`;

export const FQCard = styled(LinearGradientBox).attrs({
  nolinear: true,
  hover: true,
  linear: 'var(--linear-gradient-border-green)',
  borderWidth: 4,
})`
  padding: 46px 32px;
  color: white;
  border-radius: 12px;
  border: 2px solid #3A3A3A;
  &:hover, &.active{
    border-color: transparent;
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
      cursor: pointer;
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
    /* >. */
  }
`;
