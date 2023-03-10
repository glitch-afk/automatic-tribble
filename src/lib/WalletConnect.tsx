import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import type { ReactNode } from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai, goerli, bsc } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

interface IWalleConnectProps {
  children: ReactNode;
}

const { chains, provider } = configureChains(
  [mainnet, goerli, polygon, bsc, polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string }), jsonRpcProvider({ rpc: (_c) => ({ http: "https://bsc-dataseed.binance.org/" }) })]
);

const { connectors } = getDefaultWallets({
  appName: 'Fetcch Wallet',
  chains,
});

const wagmiClient = createClient({
  provider,
  connectors,
});

const WalletConnect = ({ children }: IWalleConnectProps) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={lightTheme({
          accentColor: 'black',
          borderRadius: 'medium',
          overlayBlur: 'small',
          fontStack: 'system',
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WalletConnect;
