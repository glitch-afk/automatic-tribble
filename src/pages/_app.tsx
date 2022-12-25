import '../styles/globals.css';

import { Inter as FontSans } from '@next/font/google';
import type { AppProps } from 'next/app';
import { useState } from 'react';

import type { Balance } from '@/lib/hooks/useBalances';
import { AppContext } from '@/lib/store';
import WalletConnect from '@/lib/WalletConnect';
import type { NextPageWithLayout } from '@/types';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  // context states
  const [balances, setBalances] = useState<{
    [key: string]: Array<Balance>;
  }>({});
  const [identity, setIdentity] = useState<string>('sa@fetcch');
  const [usdBalance, setUsdBalance] = useState<string>('');

  const sharedState = {
    balances,
    setBalances,
    usdBalance,
    setUsdBalance,
    identity,
    setIdentity,
  };

  return (
    <WalletConnect>
      <AppContext.Provider value={sharedState}>
        <main className={`${fontSans.variable} font-sans`}>
          {getLayout(<Component {...pageProps} />)}
        </main>
      </AppContext.Provider>
    </WalletConnect>
  );
}
