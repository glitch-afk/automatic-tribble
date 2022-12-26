import '../styles/globals.css';

import { Inter as FontSans } from '@next/font/google';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

import { Balance, getBalances } from '@/lib/hooks/useBalances';
import { AppContext } from '@/lib/store';
import WalletConnect from '@/lib/WalletConnect';
import type { Address, Chain, NextPageWithLayout } from '@/types';
import { useAccount } from 'wagmi';
import { chainsList } from '@/lib/data/mockData';
import { findWalletId, WalletId } from '@/lib/hooks/user';

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
  const [idData, setIdData] = useState<WalletId>()
  const [usdBalance, setUsdBalance] = useState<string>('');
  const [addresses, setAddresses] = useState<Array<Address>>([])
  const [chains, setChains] = useState<Array<Chain>>(chainsList);

  useEffect(() => {
    getBalances(`${identity}@${process.env.NEXT_PUBLIC_DEFAULT_PROVIDER}`).then(
      (res) => {
        if (res) {
          setBalances(res?.balances);
          setUsdBalance(res?.usdBalance.toFixed(2));
        }
      }
    );
  }, [identity])

  useEffect(() => {
    const _addresses = JSON.parse(localStorage.getItem("addresses") as string)
    setAddresses(_addresses)
  }, [])

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses))
  }, [addresses])

  useEffect(() => {
    const identity = localStorage.getItem("identity") as string;
    console.log(identity)
    setIdentity(identity);
  }, []);

  useEffect(() => {
    localStorage.setItem("identity", identity);
  }, [identity]);

  useEffect(() => {
    findWalletId(
      `${identity}@${process.env.NEXT_PUBLIC_DEFAULT_PROVIDER}`
    ).then((data) => {
      console.log(data);
      setIdData(data);
    });
  }, [identity])

  const { address } = useAccount();

  useEffect(() => {
    if(address) {
      setAddresses((_addresses) => {
        let shallowCopy = [..._addresses]
  
        const found = shallowCopy.find(
          (s) => s.address.toLowerCase() === address.toLowerCase()
        );

        if(!found) {
          shallowCopy.push({
            address: address as string,
            type: 'injected'
          })
        }

        return shallowCopy
      })
    }
  }, [address])

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
    setIdData
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
