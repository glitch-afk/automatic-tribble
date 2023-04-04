import '../styles/globals.css';

import Script from 'next/script';

import { Inter as FontSans } from '@next/font/google';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

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
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  const [idData, setIdData] = useState<WalletId>();
  const [usdBalance, setUsdBalance] = useState<string>('');
  const [addresses, setAddresses] = useState<Array<Address>>([]);
  const [chains, setChains] = useState<Array<Chain>>(chainsList);
  const [seedPhrase, setSeedPhrase] = useState<Array<string>>([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    console.log(identity, 'dsa');
    getPaymentRequest({
      payer: `${identity}@${process.env.NEXT_PUBLIC_DEFAULT_PROVIDER}`
    }).then((res) => {
      console.log(res, 'dsa');
      setRequests(res);
    });
  }, [identity]);

  useEffect(() => {
    if(idData && idData.default && idData.default.address) setSelectedAddress({
      address: idData?.default.address as string,
      fetcchType: "default",
      type: "injected",
      chain: idData.default.chain.id
    })
    else if(addresses.length > 0) setSelectedAddress(addresses[0])
  }, [idData, addresses])

  useEffect(() => {
    console.log("HERE")
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
    console.log(_addresses, "HERE")
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
  }, [seedPhrase])

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
    selectedAddress,
    setSelectedAddress
  };

  const [valid, setValid] = useState(true)
  const [otp, setOtp] = useState("")

  // useEffect(() => {
  //   console.log(window.localStorage.getItem("ok") === "fetcch")
  // }, [])

  const validate = (otp: string) => {
    if(otp === process.env.NEXT_PUBLIC_OTP) {
      setValid(true)
    } else {
      alert("Visitor password is invalid")
    }
  }

  return (
    <WalletConnect>
      <AppContext.Provider value={sharedState}>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2T1W588Y9J"
        />
        <Script>
          {`
              window.dataLayer = window.dataLayer || []
              function gtag(){
                window.dataLayer.push(arguments)
              }
              gtag('js', new Date());

              gtag('config', 'G-2T1W588Y9J');
            `}
        </Script>
        <main className={`${fontSans.variable} font-sans`}>
          {valid && getLayout(<Component {...pageProps} />)}
          {!valid && (
            <>
              <div className="w-full h-screen bg-white text-black flex justify-center items-center flex-col space-y-3">
                <div className="w-54 h-full flex text-center justify-center items-center flex-col space-y-3">
                  <h1>Enter Visitor Password</h1>
                  <input
                    type="password"
                    placeholder="password"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 text-center rounded-xl border-black border"
                  />
                  <div
                    className="cursor-pointer w-full p-3 bg-black rounded-xl text-white"
                    onClick={() => validate(otp)}
                  >
                    Enter
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </AppContext.Provider>
    </WalletConnect>
  );
}
