import '../styles/globals.css';

import { Inter as FontSans } from '@next/font/google';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { chainsList } from '@/lib/data/mockData';
import { getPaymentRequest } from '@/lib/hooks/request';
import type { Balance } from '@/lib/hooks/useBalances';
import { getBalances } from '@/lib/hooks/useBalances';
import type { WalletId } from '@/lib/hooks/user';
import { findWalletId } from '@/lib/hooks/user';
import { AppContext } from '@/lib/store';
import WalletConnect from '@/lib/WalletConnect';
import type { Address, Chain, NextPageWithLayout } from '@/types';

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
  const [identity, setIdentity] = useState<string>('');
  const [idData, setIdData] = useState<WalletId>();
  const [usdBalance, setUsdBalance] = useState<string>('');
  const [addresses, setAddresses] = useState<Array<Address>>([]);
  const [chains, setChains] = useState<Array<Chain>>(chainsList);
  const [seedPhrase, setSeedPhrase] = useState<Array<string>>([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    console.log(identity, 'dsa');
    getPaymentRequest({
      payer: {
        id: `${identity}@${process.env.NEXT_PUBLIC_DEFAULT_PROVIDER}`,
      },
    }).then((res) => {
      console.log(res, 'dsa');
      setRequests(res);
    });
  }, [identity]);

  useEffect(() => {
    if (identity) {
      getBalances(
        `${identity}@${process.env.NEXT_PUBLIC_DEFAULT_PROVIDER}`
      ).then((res) => {
        console.log(res);
        if (res) {
          setBalances(res?.balances);
          setUsdBalance(res?.usdBalance.toFixed(2));
        }
      });
    }
  }, [identity]);

  useEffect(() => {
    const _addresses = JSON.parse(localStorage.getItem('addresses') as string);
    if (_addresses) setAddresses(_addresses);
  }, []);

  useEffect(() => {
    if (addresses && addresses.length > 0)
      localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    const identity = localStorage.getItem('identity') as string;
    if (!identity) return () => {};
    console.log(identity);
    setIdentity(identity.split('@')[0] as string);
    return () => {};
  }, []);

  useEffect(() => {
    if (identity) {
      localStorage.setItem('identity', identity);
    }
  }, [identity]);

  useEffect(() => {
    if (identity) {
      findWalletId({
        id: `${identity}@${process.env.NEXT_PUBLIC_DEFAULT_PROVIDER}`,
      }).then((data) => {
        console.log(data);
        setIdData(data);
      });
    }
  }, [identity]);

  useEffect(() => {
    const seedPHrase = localStorage.getItem('seedPhrase');

    if (!seedPHrase) return () => {};

    setSeedPhrase(seedPHrase.split(' '));

    return () => {};
  }, []);

  useEffect(() => {
    if (seedPhrase.length > 0)
      localStorage.setItem('seedPhrase', seedPhrase.join(' '));
  }, [seedPhrase]);

  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      setAddresses((_addresses) => {
        const shallowCopy = [..._addresses];

        const found = shallowCopy.find(
          (s) => s.address.toLowerCase() === address.toLowerCase()
        );

        if (!found) {
          shallowCopy.push({
            address: address as string,
            type: 'injected',
          });
        }

        return shallowCopy;
      });
    }
  }, [address]);

  const sharedState = {
    balances,
    setBalances,
    usdBalance,
    setUsdBalance,
    identity,
    setIdentity,
    addresses,
    setAddresses,
    chains,
    setChains,
    idData,
    setIdData,
    seedPhrase,
    setSeedPhrase,
    requests,
    setRequests,
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
