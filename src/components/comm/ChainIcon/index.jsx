import { useMemo } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
// import { ReactComponent as BscIcon } from '@/assets/imgs/svg/Icon/BAN.svg';
// import { ReactComponent as EthIcon } from '@/assets/imgs/svg/Icon/Ethereum.svg';
import { EVMNETWORKS, EVM_CHAINID } from '@/config/network';

// const CHAIN_ICON = {
//   bsc: BscIcon,
//   eth: EthIcon,
// };

const StyledWrap = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(47, 73, 138, 0.34);
  cursor: pointer;
  &:hover,&.active{
    background-color: var(--color-primary-2);
    /* filter: grayscale(1); */
  }
`;

function ChainIcon(props) {
  const {
    chainId, iconClassName, fill = 'white', active, size = '18px',
  } = props;

  const IconComponent = useMemo(() => EVMNETWORKS[chainId || EVM_CHAINID.ETH]?.SvgComponent, [chainId]);
  return (
    <StyledWrap className={classNames({ active }, props.className)}>
      <IconComponent
        fill={fill}
        className={iconClassName}
        style={{
          width: size,
          height: size,
        }}
      />
    </StyledWrap>
  );
}

export default ChainIcon;
