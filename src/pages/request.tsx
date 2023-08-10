import Link from 'next/link';
import { ReactElement, useEffect } from 'react';
import { useState } from 'react';
import * as aptos from "aptos"

import { LeftIcon } from '@/components/icons/leftIcon';
import LoadingScreen from '@/components/loading';
import SelectToken from '@/components/token-select';
import { ActionLayout } from '@/layouts/Action';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import { Meta } from '@/lib/Meta';
import { useAppContext } from '@/lib/store';
import type { NextPageWithLayout } from '@/types';
import { createPaymentRequest, fetcchChains, generateMessageForRequest } from '@/lib/hooks/request';
import { ethers } from 'ethers';
import { tokensList } from '@/lib/data/mockData';
import { Balance } from '@/lib/hooks/useBalances';
import SucessScreen from '@/components/success';
import ErrorScreen from '@/components/error';
import base58 from 'bs58';
import nacl from 'tweetnacl';
import { useSigner } from 'wagmi';

const RequestPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Can't send a payment request")
  useLockBodyScroll(loading);
  const { balances, } = useAppContext();
  const [tokens, _setTokens] = useState(
    (balances != null ? Object.values(balances).flat() : [])
  );

  const [_isValid, setIsValid] = useState(true)

  const [selectedToken, setSelectedToken] = useState(tokens[0] ? tokens[0] : tokensList[0]);
  const [payerId, setPayerId] = useState("")
  const [amount, setAmount] = useState("")

  const { idData, addresses } = useAppContext()

  useEffect(() => {
    console.log(
      amount,
      selectedToken?.balance,
      Number(amount) > Number(selectedToken?.balance)
    );
    if(!amount || Number(amount) > Number(selectedToken?.balance) || !payerId) setIsValid(false)
    else setIsValid(true)
  }, [amount, payerId])

  const { data: signer } = useSigner()

  const signMessage = async (
    message: string,
    nonce = "0"
  ) => {

    const addressStr = idData?.default.address!
    const address = addresses.find(
      (ad) => ad.address.toLowerCase() === addressStr.toLowerCase()
    );

    if (!address)
      throw new Error("This address doesn't exist in provided address by user");

    if (address.privateKey) {
      if(address.chain < 7) {
        const signer = new ethers.Wallet(address.privateKey);
  
        const signature = await signer.signMessage(message);
  
        return signature;
      } else if (address.chain === 7) {
          const privateKey = base58.decode(address.privateKey)

          const signature = nacl.sign.detached(Buffer.from(message), privateKey)

          return base58.encode(signature)
      } else if (address.chain === 8) {
        const account = new aptos.AptosAccount(aptos.HexString.ensure(address.privateKey).toUint8Array())
        
        const newMessage = `APTOS\nmessage: ${message}\nnonce: ${nonce}`
        console.log(newMessage, account.address().toString(), "123")

        const signature = account.signBuffer(Buffer.from(newMessage))
        
        return signature.toString()
      }
    }

    if(!signer) throw new Error("signer doesn't exist")

    const signature = await signer.signMessage(message)

    return signature
  };
  
  const createRequest = async () => {
    setLoading(true)
    try {
      console.log(selectedToken?.chain as string, ((selectedToken?.chain) === 2 || (selectedToken?.chain) === 3) ? selectedToken?.chain : fetcchChains[selectedToken?.chain as string], "selcte");
      const pr = {
        receiver: idData?.id as string,
        payer: payerId,
        token:
          (selectedToken?.tokenAddress?.toString() as string) ===
          "0x0000000000000000000000000000000000001010"
            ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            : (selectedToken?.tokenAddress?.toString() as string),
        chain:
          (selectedToken?.chain === 2 || selectedToken?.chain === 3
            ? Number(selectedToken?.chain)
            : Number(fetcchChains[selectedToken?.chain as string])),
        amount: ethers.utils
          .parseUnits(amount, selectedToken?.tokenDecimal)
          .toString(),
        message: "YOYO",
        label: "123",
      }
      const message = await generateMessageForRequest(pr)
      const signature = await signMessage(message)
      
      await createPaymentRequest({
        ...pr,
        signature
      });

      setSuccess(true)
    } catch (e: any) {
      console.log(e)
      setErrorMessage(e.message ?? errorMessage)
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    if(success) {
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, [error]);

  useEffect(() => console.log(selectedToken, "selcte"), [selectedToken])

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
