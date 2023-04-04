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
import { buildTransaction, fetcchChains } from '@/lib/hooks/request';
import { ethers } from 'ethers';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import LoadingScreen from '@/components/loading';
import { useRouter } from 'next/router';
import ErrorScreen from '@/components/error';
import SucessScreen from '@/components/success';
import { tokensList } from "@/lib/data/mockData";

const SendPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Transaction not executed")
  useLockBodyScroll(loading);
  
  const [lockInput, setLockInput] = useState(false)
  const [showModal, setShowModal] = useState(false);

  const { balances, selectedAddress } = useAppContext();
  const [tokens, _setTokens] = useState(
    balances != null ? Object.values(balances).filter(i => i.find(x => x.address.toLowerCase() === selectedAddress?.address.toLowerCase())).flat() : []
  );

  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [isValid, setIsValid] = useState(true);

  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");
  const [txRequest, setTxRequest] = useState()

  const [transactionDetails, setTransactionDetails] = useState<any>()

  const { query } = useRouter();

  useEffect(() => {
    if (query) {
      try {
        setLockInput(true)
        console.log(query, "balance")
        const request = JSON.parse(query.request as string);
        const token = JSON.parse(query.token as string)

        console.log(request, token, "balance")
  
        setTxRequest(request)
        setSelectedToken(token)
        setPayerId(request.receiver.id)
        setAmount(ethers.utils.formatUnits(request.amount, token.tokenDecimal));
      } catch (e) {
        console.log(e, "balance")
        setLockInput(false)
      }
    }
  }, []);

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

  const { idData } = useAppContext()

  const sendDetails = async () => {  
    setLoading(true)
    
    try {
      let paymentRequest: any;
      if(!txRequest) {
        // paymentRequest = await createPaymentRequest({
        //   amount: ethers.utils
        //     .parseUnits(amount, selectedToken?.tokenDecimal)
        //     .toString(),
        //   token:
        //     (selectedToken?.tokenAddress.toString() as string) ===
        //     "0x0000000000000000000000000000000000001010"
        //       ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        //       : (selectedToken?.tokenAddress.toString() as string),
        //   chain: selectedToken?.chain.toString() as string,
        //   payee: payerId,
        //   payer: idData?.id as string,
        //   message: "#1",
        //   label: "#1",
        // });

        // setTxRequest(paymentRequest)
      } else {
        paymentRequest = txRequest
      }
      
      let tx: any;

      console.log(selectedToken?.chain as string)
      if(paymentRequest) {
        tx = await buildTransaction({
          transactionRequestId: paymentRequest.id,
          payerConfig: {
            payer: idData?.id as string,
            address: selectedAddress?.address as string,
            chain: Number(fetcchChains[selectedToken?.chain as string]),
            token:
              (selectedToken?.tokenAddress.toString() as string) ===
              "0x0000000000000000000000000000000000001010"
                ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                : (selectedToken?.tokenAddress.toString() as string),
            amount: ethers.utils
              .parseUnits(amount, selectedToken?.tokenDecimal)
              .toString(),
          },
        });
      } else {
        tx = await buildTransaction({
          receiver: payerId,
          payerConfig: {
            payer: idData?.id as string,
            address: selectedAddress?.address as string,
            chain: Number(fetcchChains[selectedToken?.chain as string]),
            token:
              (selectedToken?.tokenAddress.toString() as string) ===
              "0x0000000000000000000000000000000000001010"
                ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                : (selectedToken?.tokenAddress.toString() as string),
            amount: ethers.utils
              .parseUnits(amount, selectedToken?.tokenDecimal)
              .toString(),
          },
        });
      }

      console.log(tx)
      setTransactionDetails(tx)
  
      setShowModal(true)
    } catch (e: any) {
      setErrorMessage(e.message)
      setError(true)
    }
    setLoading(false);
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
            disabled={lockInput}
          />
        </div>
        {/* select token */}
        <SelectToken
          tokens={[...tokens.filter(x => x.chain === selectedAddress?.chain), ...tokensList.filter(x => x.chain === selectedAddress?.chain)]}
          setSelectedToken={setSelectedToken}
          selectedToken={selectedToken}
          lockInput={lockInput}
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
            disabled={lockInput}
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
          isLoading={loading}
          setIsLoading={setLoading}
          error={error}
          setError={setError}
          setErrorMessage={setErrorMessage}
          setSuccess={setSuccess}
          request={txRequest}
          account={selectedAddress?.address as string}
        />
      )}
      {loading && (
        <LoadingScreen isLoading={loading} setIsLoading={setLoading} />
      )}
      {error && (
        <ErrorScreen
          message={errorMessage}
          isLoading={error}
          setIsLoading={setError}
        />
      )}
      {success && (
        <SucessScreen
          message={"Successful transaction"}
          isLoading={success}
          setIsLoading={setSuccess}
        />
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
