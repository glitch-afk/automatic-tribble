import Link from 'next/link';
import { ReactElement, useEffect } from 'react';
import { useState } from 'react';

import { LeftIcon } from '@/components/icons/leftIcon';
import LoadingScreen from '@/components/loading';
import SelectToken from '@/components/token-select';
import { ActionLayout } from '@/layouts/Action';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import { Meta } from '@/lib/Meta';
import { useAppContext } from '@/lib/store';
import type { NextPageWithLayout } from '@/types';
import { createPaymentRequest } from '@/lib/hooks/request';
import { ethers } from 'ethers';
import { tokensList } from '@/lib/data/mockData';
import { Balance } from '@/lib/hooks/useBalances';

const RequestPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  useLockBodyScroll(loading);
  const { balances } = useAppContext();
  const [tokens, _setTokens] = useState(
    (balances != null ? Object.values(balances).flat() : [])
  );

  const [_isValid, setIsValid] = useState(true)

  const [selectedToken, setSelectedToken] = useState(tokens[0] ? tokens[0] : tokensList[0]);
  const [payerId, setPayerId] = useState("")
  const [amount, setAmount] = useState("")

  const { idData } = useAppContext()

  useEffect(() => {
    console.log(
      amount,
      selectedToken?.balance,
      Number(amount) > Number(selectedToken?.balance)
    );
    if(!amount || Number(amount) > Number(selectedToken?.balance) || !payerId) setIsValid(false)
    else setIsValid(true)
  }, [amount, payerId])

  const createRequest = async () => {
    setLoading(true)
    console.log(
      ethers.utils.parseUnits(amount, selectedToken?.tokenDecimal).toString()
    );

    const paymentRequest = await createPaymentRequest({
      payee: idData?.id as string,
      payer: payerId,
      token:
        (selectedToken?.tokenAddress?.toString() as string) ===
        "0x0000000000000000000000000000000000001010"
          ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
          : (selectedToken?.tokenAddress?.toString() as string),
      chain: selectedToken?.chain as string,
      amount: ethers.utils
        .parseUnits(amount, selectedToken?.tokenDecimal)
        .toString(),
      message: "YOYO",
      label: "123",
    });

    setLoading(false)

    console.log(paymentRequest)
  }

  return (
    <div>
      <header className="flex w-full items-center">
        {/* back button */}
        <Link href="/home" className="z-20">
          <LeftIcon className="z-10 h-6 w-6" />
        </Link>
        <Link href="/home"></Link>
        <h2 className="-ml-6 w-full text-center text-xl font-semibold">
          Create Request
        </h2>
      </header>
      {/* Request to */}
      <div className="mt-12 flex flex-col space-y-4">
        <div className="flex flex-col">
          <label htmlFor="wallet_id" className="mb-1">
            Request to
          </label>
          <input
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            type="email"
            name="wallet_id"
            id="wallet_id"
            placeholder="rohan@fetcch"
            pattern="[-+]?[0-9]*[.,]?[0-9]+"
            className="mb-3 rounded-md border-none px-2 py-3 outline-none ring-0 placeholder:text-neutral-300 focus:outline-neutral-300 focus:ring-0"
          />
        </div>
        {/* select token */}
        <SelectToken
          tokens={[...tokens, ...tokensList]}
          setSelectedToken={setSelectedToken}
          selectedToken={selectedToken as Balance}
          lockInput={false}
        />
        {/* amount */}
        <div className="mb-4 mt-8 flex flex-col">
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="amount">Amount</label>
            <span
              onClick={() =>
                setAmount(selectedToken?.balance?.toString() ?? "0")
              }
              className="cursor-pointer text-xs text-neutral-500"
            >
              Max ${selectedToken?.balance ?? "0.00"}
            </span>
          </div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            name="amount"
            id="amount"
            placeholder="0.00"
            className="mb-3 rounded-md border-none px-2 py-3 outline-none ring-0 placeholder:text-neutral-300 focus:outline-neutral-300 focus:ring-0"
          />
        </div>
        {/* send button */}

        <button
          type="button"
          className="w-full rounded-xl bg-black py-3 text-sm text-white"
          onClick={() => createRequest()}
        >
          Request
        </button>
      </div>
      {loading && (
        <LoadingScreen isLoading={loading} setIsLoading={setLoading} />
      )}
    </div>
  );
};

RequestPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ActionLayout
      meta={<Meta title="Fetcch Wallet" description="Request Token" />}
    >
      {page}
    </ActionLayout>
  );
};

export default RequestPage;
