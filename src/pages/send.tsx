import Link from 'next/link';
import { ReactElement, useEffect } from 'react';
import { useState } from 'react';

import { LeftIcon } from '@/components/icons/leftIcon';
import SelectToken from '@/components/token-select';
import SendModal from '@/components/ui/sendModal';
import { ActionLayout } from '@/layouts/Action';
import { Meta } from '@/lib/Meta';
import { useAppContext } from '@/lib/store';
import type { NextPageWithLayout } from '@/types';
import { buildTransaction } from '@/lib/hooks/request';
import { ethers } from 'ethers';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import LoadingScreen from '@/components/loading';

const SendPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  useLockBodyScroll(loading);
  
  const [showModal, setShowModal] = useState(false);

  const { balances } = useAppContext();
  const [tokens, _setTokens] = useState(
    balances != null ? Object.values(balances).flat() : []
  );

  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [isValid, setIsValid] = useState(true);

  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");

  const [transactionDetails, setTransactionDetails] = useState<any>()

  useEffect(() => {
    console.log(
      amount,
      selectedToken?.balance,
      Number(amount) > Number(selectedToken?.balance)
    );
    if (!amount || Number(amount) > Number(selectedToken?.balance) || !payerId)
      setIsValid(false);
    else setIsValid(true);
  }, [amount, payerId]);

  const sendDetails = async () => {  
    setLoading(true)
    const tx = await buildTransaction({
      payee: payerId,
      userConfig: {
        fromId: "sa@fetcch",
        fromAddress: "0x4e7f624C9f2dbc3bcf97D03E765142Dd46fe1C46",
        fromChain: '1',
        fromToken: selectedToken?.tokenAddress.toString() as string,
        amount: ethers.utils
          .parseUnits(amount, selectedToken?.tokenDecimal)
          .toString(),
      },
    });
    setLoading(false);

    console.log(tx)
    setTransactionDetails(tx)

    setShowModal(true)
  }

  return (
    <div>
      <header className="flex w-full items-center">
        {/* back button */}
        <Link href="/home" className="z-20">
          <LeftIcon className="z-10 h-6 w-6" />
        </Link>
        <Link href="/home"></Link>
        <h2 className="-ml-6 w-full text-center text-xl font-semibold">Send</h2>
      </header>
      {/* send to */}
      <div className="mt-12 flex flex-col space-y-4">
        <div className="flex flex-col">
          <label htmlFor="wallet_id" className="mb-1">
            Send to
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
          tokens={tokens}
          setSelectedToken={setSelectedToken}
          selectedToken={selectedToken}
        />
        {/* amount */}
        <div className="mb-4 mt-8 flex flex-col">
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="amount">Amount</label>
            <span
              onClick={() =>
                setAmount(selectedToken?.balance.toString() as string)
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
        {isValid && (
          <button
            type="button"
            className="w-full rounded-xl bg-black py-3 text-sm text-white"
            onClick={() => sendDetails()}
          >
            Continue
          </button>
        )}

        {!isValid && (
          <button
            type="button"
            className="w-full rounded-xl bg-red-400 py-3 text-sm text-black"
          >
            Invalid Details
          </button>
        )}
      </div>

      {/* modal */}
      {showModal && (
        <SendModal
          reviewDetails={{ payerId, amount, selectedToken }}
          txDetails={transactionDetails}
          isOpen={showModal}
          setIsOpen={setShowModal}
        />
      )}
      {loading && (
        <LoadingScreen isLoading={loading} setIsLoading={setLoading} />
      )}
    </div>
  );
};

SendPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ActionLayout
      meta={<Meta title="Fetcch Wallet" description="Send Tokens" />}
    >
      {page}
    </ActionLayout>
  );
};

export default SendPage;
