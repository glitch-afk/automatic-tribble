import '../styles/globals.css';

import { Inter as FontSans } from '@next/font/google';
import type { AppProps } from 'next/app';

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
  return (
    <WalletConnect>
      <main className={`${fontSans.variable} font-sans`}>
        {getLayout(<Component {...pageProps} />)}
      </main>
    </WalletConnect>
  );
}
