import {
  Layout, Modal, Toast, Typography,
} from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import Header from '../Header';
import { useSolanaWalletProvider } from '@/provider/solanaWallet';
import ICON_PhantomWallet from '@/assets/imgs/wallet_icon.png';
import { getSolanaProvider } from '@/utils/solanaWallet';

function BaseLayout(props) {
  const { children, className, contentClassName } = props;

  const [walletsModalVisible, setWalletsModalVisible] = useState(false);

  const { state: solanaWalletState, dispatch } = useSolanaWalletProvider();
  const solanaProvider = useMemo(() => getSolanaProvider(), []);

  const connect = async () => {
    try {
      if (solanaWalletState.connected) return;
      const resp = await solanaProvider.connect();
      dispatch({
        type: 'CONNECT',
        payload: {
          publicKey: resp.publicKey,
          provider: solanaProvider,
        },
      });
      Toast.success('Connect wallet successfully.');
    } catch (error) {
      Toast.error('Please connect wallet.');
    }
  };

  useEffect(() => {
    const listener = () => {
      if (solanaProvider?.isConnected) {
        dispatch({
          type: 'CONNECT',
          payload: {
            publicKey: solanaProvider.publicKey,
            provider: solanaProvider,
          },
        });
      }
    };
    listener();
  }, []);

  return (
    <Layout className={classNames('h-full', className)}>
      <Layout.Header>
        <Header setWalletsModalVisibleFn={setWalletsModalVisible} />
      </Layout.Header>
      <Layout.Content className={classNames('bg-black/10 nmd:relative pt-[120px] overflow-hidden', contentClassName)}>
        {children}
      </Layout.Content>
      <Modal
        visible={walletsModalVisible}
        title="Connect Wallet"
        footer={<div />}
        onCancel={() => setWalletsModalVisible(false)}
      >
        <div
          className="flex items-center border-b border-gray-300/20 p-2"
        >
          <img
            className="mr-4"
            width="40"
            height="40"
            src={ICON_PhantomWallet}
            alt="icon"
          />
          <Typography.Title heading={6}>
            Phantom
          </Typography.Title>

          <button
            className="ml-auto hover:bg-gray-300/20 px-2 py-1 rounded-lg"
            onClick={connect}
          >
            <Typography.Text>
              {solanaWalletState.connected ? 'Connected' : 'Connect'}
            </Typography.Text>
          </button>
        </div>
      </Modal>
    </Layout>
  );
}

export default BaseLayout;
