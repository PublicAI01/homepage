export const getSolanaProvider = () => {
  if ('solana' in window) {
    const provider = window.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }
};
