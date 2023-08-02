import { SolanaWalletProvider } from './solanaWallet';

function Providers(props) {
  const { children } = props;
  return (
    <SolanaWalletProvider>
      {children}
    </SolanaWalletProvider>
  );
}

export default Providers;
