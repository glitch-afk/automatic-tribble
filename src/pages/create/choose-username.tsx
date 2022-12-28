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

const ChooseUserName: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false)
  
  const { identity, setIdentity, addresses, chains } = useAppContext()
  const { data: signer } = useSigner()
  
  const signMessage = async (
    addressStr: string,
    message: string
  ) => {
    const address = addresses.find(
      (ad) => ad.address.toLowerCase() === addressStr.toLowerCase()
    );

    if (!address)
      throw new Error("This address doesn't exist in provided address by user");

    if (address.privateKey) {
      const signer = new ethers.Wallet(address.privateKey);

      const signature = await signer.signMessage(message);

      return signature;
    }

    if(!signer) throw new Error("signer doesn't exist")

    const signature = await signer.signMessage(message)

    return signature
  };

  const createUsername = async () => {
    setLoading(true)
    let data: WalletId = {
      identifier: identity,
      provider: process.env.NEXT_PUBLIC_DEFAULT_PROVIDER as string,
      default: {
        address: addresses[0]?.address as string,
        chain: Number(chains[0]?.id) as number
      },
      others: addresses.map(address => ({
        address: address.address,
        chain: chains.slice(1).filter(i => i.selected).map(i => Number(i.id))
      })),
      currentSignature: ""
    };

    const message = await generateMessage(data)

    const signature = await signMessage(addresses[0]?.address as string, message.message)
    
    console.log(signature, data, message)

    data.currentSignature = signature

    const username = await createWalletId(data)

    console.log(username)
    setLoading(false);

    Router.push("/home/")
  }

  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="flex w-full flex-col space-y-1">
        <label htmlFor="input#2" className="text-sm text-neutral-500">
          Choose Username
        </label>
        <input
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          type="email"
          name="username"
          placeholder="rohann@fetcch"
          className="w-full rounded-xl border-none bg-white py-3 px-2 text-sm outline-none placeholder:text-neutral-400"
        />
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
