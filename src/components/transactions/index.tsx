import React, { useEffect } from 'react';

import CurrencySwap from '@/components/ui/curreny-swap';

import TransactionsList from './list';
import { useBalances } from '@/hooks/useBalances';

const index = () => {
  const { result, isLoading, error } = useBalances('sa@12x')

  useEffect(
    () => console.log(result, isLoading, error),
    [result, isLoading, error]
  );

  return (
    <ul className="mx-auto mt-10 max-h-60 w-full overflow-y-scroll">
      {result && 
        <>
          {Object.keys(result).map(keys => {
            // @ts-ignore
            if(keys && result[keys] && result[keys]?.length > 0) {
              console.log(result, "result")
              return (
                // @ts-ignore
                <TransactionsList tokenTicker={result[keys][0]?.tokenTicker} balance={result[keys][0]?.balance}>
                  {result[keys]?.map(res => (
                    <div className="mb-3">
                      <CurrencySwap from={res.tokenTicker as any} to="ETH" />
                    </div>
                  ))}
                  <div className="mb-3">
                    <CurrencySwap from="USDC" to="ETH" />
                  </div>
                  <div className="mb-3">
                    <CurrencySwap from="USDC" to="ETH" />
                  </div>
                </TransactionsList>
              )
            }
          })}
        </>
      }
      <TransactionsList>
        <div className="mb-3">
          <CurrencySwap from="USDC" to="ETH" />
        </div>
        <div className="mb-3">
          <CurrencySwap from="USDC" to="ETH" />
        </div>
        <div className="mb-3">
          <CurrencySwap from="USDC" to="ETH" />
        </div>
      </TransactionsList>
      <TransactionsList>
        <div className="mb-3">
          <CurrencySwap from="USDC" to="ETH" />
        </div>
        <div className="mb-3">
          <CurrencySwap from="USDC" to="ETH" />
        </div>
        <div className="mb-3">
          <CurrencySwap from="USDC" to="ETH" />
        </div>
      </TransactionsList>
      <TransactionsList>
        <div className="mb-3">
          <CurrencySwap from="USDC" to="ETH" />
        </div>
        <div className="mb-3">
          <CurrencySwap from="USDC" to="ETH" />
        </div>
        <div className="mb-3">
          <CurrencySwap from="USDC" to="ETH" />
        </div>
      </TransactionsList>
    </ul>
  );
};

export default index;
