import styled from 'styled-components';
import { DEVICE } from '@/config/device';

const StyledWrap = styled.div`
  max-width: 380px;
  flex-shrink: 0;
  >div{
    height: 100%;
  }

  @media ${DEVICE.xmd} {
    max-width: 280px;
  }
  &+div{
    margin-left: 12px;
  }
`;

export default function CardItem(props) {
  const { onClick, children, className } = props;
  return (
    <StyledWrap
      className={className}
      onClick={onClick}
    >
      {children}
    </StyledWrap>
  );
}
