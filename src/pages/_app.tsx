import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { Inter as FontSans } from '@next/font/google';
import {
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
});

const { chains, provider } = configureChains(
  [mainnet, polygon],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY as string })]
);

const { connectors } = getDefaultWallets({
  appName: 'Fetcch Wallet',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={midnightTheme({
          ...midnightTheme.accentColors.orange,
          borderRadius: 'medium',
          overlayBlur: 'small',
          fontStack: 'system',
        })}
      >
        <main className={`${fontSans.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
