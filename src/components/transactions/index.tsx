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
    <ul className="mx-auto mt-10 max-h-[480px] w-full overflow-y-scroll">
      {result && 
        <>
          {Object.keys(result).map(keys => {
            // @ts-ignore
            if(keys && result[keys] && result[keys]?.length > 0) {
              console.log(result, "result")
              return (
                <TransactionsList
                  // @ts-ignore
                  tokenTicker={result[keys][0]?.tokenTicker}
                  // @ts-ignore
                  balance={result[keys][0]?.balance}
                  // @ts-ignore
                  image={result[keys][0]?.tokenLogo}
                >
                  {result[keys]?.map((res) => (
                    <div className="mb-3">
                      <CurrencySwap
                        from={res.tokenTicker as any}
                        to="ETH"
                        balance={res.balance as string}
                        usdBalance={res.balanceUsd as string}
                        image={res.tokenLogo as string}
                      />
                    </div>
                  ))}
                </TransactionsList>
              );
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
