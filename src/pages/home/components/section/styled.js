import styled from 'styled-components';

export const SectionWrap = styled.div`
  padding-top: 60px;
  padding-bottom: 60px;
`;

export const StyledServiceCard = styled.div`
  background: var(--linear-gradient-bg-gray);
  border: 4px solid #3A3A3A;
  backdrop-filter: blur(103.5px);
  border-radius: 10px;
  padding: 240px 45px 70px;
  transition: 0.2s transform;
  position: relative;

  >.title-wrap{
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    >h1{
      font-size: 48px;
      &:last-child{
        color: black;
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
