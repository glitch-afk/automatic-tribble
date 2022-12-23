import React from 'react';

import CurrencySwap from '@/components/ui/curreny-swap';

import TransactionsList from './list';

const index = () => {
  return (
    <ul className="mx-auto mt-10 max-h-60 w-full overflow-y-scroll">
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
