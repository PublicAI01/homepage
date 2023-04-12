import { Typography } from '@douyinfe/semi-ui';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { omitText } from '@/utils/utils';
import WalletIcon from '@/assets/imgs/svg/wallet.svg';
import { StyledRoundButton } from '../styled/button';

function ConnectButton(props) {
  const { className } = props;
  const { address } = useAccount();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();
  return (
    <StyledRoundButton className={className} onClick={() => (address ? openAccountModal() : openConnectModal())}>
      <Typography.Text className="xmd:hidden">{address ? omitText(address) : 'Connect Wallet'}</Typography.Text>
      <WalletIcon className="nmd:hidden" fill="white" />
    </StyledRoundButton>
  );
}

export default ConnectButton;
