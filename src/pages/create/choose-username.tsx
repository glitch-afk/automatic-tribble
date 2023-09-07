import { ReactElement, useState } from 'react';

import CreateWalletLayout from '@/layouts/create';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';
import { useAppContext } from '@/lib/store';
import { createWalletId, generateMessage, WalletId } from '@/lib/hooks/user';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi';
import LoadingScreen from '@/components/loading';
import Router from 'next/router';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import ErrorScreen from '@/components/error';
import SucessScreen from '@/components/success';
import * as aptos from "aptos"
import base58 from 'bs58';
import nacl from "tweetnacl"

const ChooseUserName: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  useLockBodyScroll(loading);

  const { identity, setIdentity, setIdData, addresses } = useAppContext()
  const { data: signer } = useSigner()
  
  const signMessage = async (
    addressStr: string,
    message: string,
    nonce = "0"
  ) => {
    console.log(addressStr, message)
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

  const createUsername = async () => {
    setLoading(true)
    try {
      // const otherChains = chains
      //   .filter((i) => i.selected)
      //   .slice(1)
      //   .map((i) => Number(i.id));
  
      const secondaryAddresses = []

      // for(let i = 0; i < otherChains.length; i++) {
        for(let k = 1; k < addresses.length; k++) {
          secondaryAddresses.push({
            address: addresses[k]?.address as string,
            chain: addresses[k]?.chain,
            isSmartContractWallet: false,
            isMultisig: false
          })
        }
      // }

      let data: WalletId = {
        id: `${identity}@${process.env.NEXT_PUBLIC_DEFAULT_PROVIDER as string}`,
        identifier: identity,
        provider: process.env.NEXT_PUBLIC_DEFAULT_PROVIDER as string,
        default: {
          address: addresses[0]?.address as string,
          chain: addresses[0]?.chain,
          isSmartContractWallet: false,
          isMultisig: false
        },
        secondary: secondaryAddresses,
        currentSignature: "",
      };
  
      const message = await generateMessage(data)

      if(!message) throw new Error("Can't generate a message for signing, try again later...")
  
      const signature = await signMessage(addresses[0]?.address as string, message.message)
      
      console.log(signature, data, message)
  
      data.currentSignature = signature


      console.log(addresses[0], "213")
      if(addresses[0]?.chain === 8) {
        data.default.address = addresses[0].publicKey as string
      }
  
      const username = await createWalletId(data)
  
      setIdData(username)
      console.log(username)
      setLoading(false);

      setSuccess(true)
  
      Router.push("/home/")
    } catch (e: any) {
      setError(true)
      setErrorMessage(e.message as string)
      setLoading(false)
    }
  }

  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="flex w-full flex-col space-y-1">
        <label htmlFor="input#2" className="text-sm text-neutral-500">
          Choose Username
        </label>
        <div className='bg-white w-full flex justify-end items-center'>
          <input
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            type="email"
            name="username"
            placeholder="name"
            className="w-2/3 rounded-xl border-none bg-white py-3 px-2 text-sm outline-none placeholder:text-neutral-400"
          />
          <p className='w-1/3 text-right pr-3'>@fetcch</p>
        </div>
        <p className="text-xs text-neutral-500">
          You can transfer, receive and request any assets from any wallet using
          this username, which serves as your transactional identity.
        </p>
      </div>
      {/* next button */}
      <div className="container cursor-pointer absolute inset-x-0 bottom-4 w-full">
        <div className="flex w-full">
          <div
            onClick={() => createUsername()}
            className="font-bold w-full rounded-xl bg-black py-3 text-center text-sm text-white"
          >
            Create
          </div>
        </div>
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
          message={"Successfully created wallet id"}
          isLoading={success}
          setIsLoading={setSuccess}
        />
      )}
    </div>
  );
};

ChooseUserName.getLayout = function getLayout(page: ReactElement) {
  return (
    <CreateWalletLayout
      meta={
        <Meta
          title="Create Username - FetcchX"
          description="create a unique username"
        />
      }
    >
      {page}
    </CreateWalletLayout>
  );
};

export default ChooseUserName;
