/* eslint-disable @typescript-eslint/no-loop-func */
// @ts-nocheck
import axios from 'axios';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/lib/store';

import { findWalletId } from './user';

export interface Balance {
  address: string;
  tokenName: string;
  tokenAddress: string;
  tokenLogo: any;
  tokenTicker: string;
  balance: string | number;
  balanceUsd: string | number;
  chain: string | number;
  tokenDecimal: number;
  usdPrice?: string | number;
}

const API_KEY = 'ckey_ed497df39d654966875e01c195e';
const ON_API_KEY = 'b80d94df2319fbeee26092357b4400d9bf303f2d';

export const getBalance = async (address: string, chain: string) => {
  return axios({
    url: `https://api.covalenthq.com/v1/${chain}/address/${address}/balances_v2/?key=${API_KEY}`,
  });
};

const getBalanceOnApi = async (address: string, chain: string) => {
  return axios({
    url: `/api/assets?address=${address}&chain=${chain}`,
  });
};

export const getBalances = async (id: string) => {
  try {
    console.log('dsadsa');
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const balances: { [key: string]: Array<Balance> } = {};
    let usdBalance = 0;

    const walletId = await findWalletId({
      id,
    });
    console.log(walletId, "HERE");

    if (!walletId) throw new Error(`${id} doesn't exist`);

    const addresses: { address: string; chain: string[] }[] = [
      {
        address: walletId.default.address,
        chain: walletId.default.chainId,
      },
      walletId.secondary.map((other: any) => ({
        address: other.address,
        chain: other.chainId,
      })),
    ].flat();

    console.log("ADDRESS HERE => ", addresses)
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];

      // eslint-disable-next-line no-continue
      if (!address) continue;

      // for (let j = 0; j < address.chain.length; j++) {
        const res = await getBalanceOnApi(
          address.address,
          address.chain as string
        );

        const data = await res.data;
        console.log(data, "data")
        if (!data) continue;

        const tokens = data;
        for (let k = 0; k < tokens.length; k++) {
          const token = tokens[k];
          console.log(token);

          if (!balances[token.contract_ticker_symbol])
            balances[token.contract_ticker_symbol] = [];

          usdBalance += token.quote;

          balances[token.contract_ticker_symbol]?.push({
            address: address.address,
            tokenAddress: token.contract_address === "So11111111111111111111111111111111111111112" ? "11111111111111111111111111111111111111111111" : token.contract_address,
            tokenTicker: token.contract_ticker_symbol,
            tokenName: token.contract_name,
            tokenLogo: token.logo_url,
            tokenDecimal: token.contract_decimals,
            balance: Number(
              ethers.utils.formatUnits(token.balance, token.contract_decimals)
            ).toFixed(5),
            balanceUsd: token.quote.toFixed(5),
            chain: address.chain as string,
          });

          // balances[token.contract_ticker_symbol]?.push({
          //   tokenAddress: token.contract_address,
          //   tokenTicker: token.contract_ticker_symbol,
          //   tokenName: token.contract_name,
          //   tokenLogo: token.logo_url,
          //   tokenDecimal: token.contract_decimals,
          //   balance: token.balance,
          //   balanceUsd: token.quote_rate,
          //   chain: address.chain[j] as string,
          // });
        // }
      }
    }

    return {
      balances,
      usdBalance,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

export const useBalances = () => {
  const {
    identity: id,
    balances,
    setBalances,
    setUsdBalance,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();

  const getBalances = async () => {
    try {
      console.log('dsadsa');
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const balances: { [key: string]: Array<Balance> } = {};
      let usdBalance = 0;

      const walletId = await findWalletId({
        id,
      });
      console.log(walletId);

      if (!walletId) throw new Error(`${id} doesn't exist`);

      const addresses: { address: string; chain: string[] }[] = [
        {
          address: walletId.default.address,
          chain: [walletId.default.chain.chainId],
        },
        walletId.secondary.map((other: any) => ({
          address: other.address,
          chain: other.chain.map((chain: any) => chain.chainId),
        })),
      ].flat();

      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];

        // eslint-disable-next-line no-continue
        if (!address) continue;

        // for (let j = 0; j < address.chain.length; j++) {
          getBalanceOnApi(address.address, address.chain as string)
            .then((res) => res.data.assets)
            .then((tokens) => {
              console.log(tokens, 45678)
              for (let k = 0; k < tokens.length; k++) {
                const token = tokens[k];
                console.log(token)

                if (!balances[token.contract_ticker_symbol])
                  balances[token.contract_ticker_symbol] = [];

                usdBalance += Number(token.quote);
console.log(token)
                balances[token.contract_ticker_symbol]?.push({
                  tokenAddress: token.contract_address,
                  tokenTicker: token.contract_ticker_symbol,
                  tokenName: token.contract_name,
                  tokenLogo: token.logo_url,
                  tokenDecimal: token.contract_decimals,
                  balance: Number(
                    ethers.utils.formatUnits(
                      token.balance,
                      token.contract_decimals
                    )
                  ).toFixed(2),
                  balanceUsd: token.quote.toFixed(2),
                  chain: address.chain[j] as string,
                });

                // balances[token.contract_ticker_symbol]?.push({
                //   tokenAddress: token.contract_address,
                //   tokenTicker: token.contract_ticker_symbol,
                //   tokenName: token.contract_name,
                //   tokenLogo: token.logo_url,
                //   tokenDecimal: token.contract_decimals,
                //   balance: token.balance,
                //   balanceUsd: token.quote_rate,
                //   chain: address.chain[j] as string,
                // });
              }

              setUsdBalance(usdBalance.toFixed(2));
              setBalances(balances);
              setIsLoading(false);
              setError(null);
            });
        // }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      setBalances(null);
      setIsLoading(false);
      setError(e);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getBalances();
  }, [id]);

  return {
    result: balances,
    isLoading,
    error,
  };
};
