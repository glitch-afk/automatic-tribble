import Link from 'next/link';
import { ReactElement, useState } from 'react';

import CreateWalletLayout from '@/layouts/create';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';
import { useAppContext } from '@/lib/store';
import { Check } from '@/components/icons/check';
import { useRouter } from 'next/router';

const CreateWallet: NextPageWithLayout = () => {
  const { query } = useRouter()

  const [connect] = useState<boolean>(query.connect === 'true')
  
  const { chains, setChains } = useAppContext()

  const selectChain = (idx: number) => {
    console.log("called =c");

    let shallowCopy = [...chains];

    console.log(
      // @ts-ignore
      shallowCopy[idx].selected,
      // @ts-ignore
      shallowCopy[idx].selected ? false : true,
      idx
    );
    // @ts-ignore
    shallowCopy[idx].selected = shallowCopy[idx].selected ? false : true;

    setChains(shallowCopy);
  }

  return (
    <div className="my-4 flex flex-col">
      <h2 className="text-xl font-semibold text-center">
        Which network would you like to use?
      </h2>
      {/* networks grid */}
      <div className="max-h-[420px] overflow-y-auto">
        <div className="mt-4 grid w-full grid-cols-2 gap-3">
          {/* single network 😿 like me */}
          {chains.map((chain, idx) => (
            <div
              onClick={() => selectChain(idx)}
              className="relative cursor-pointer col-span-1 flex flex-col items-start justify-center space-y-3 rounded-xl bg-white p-2"
            >
              <chain.logo className="m-0 h-10 w-8" />
              <span className="font-semibold">{chain.name}</span>
              {chain.selected && (
                <Check className="text-green-500 border-2 border-green-500 rounded-full w-5 h-5 p-[2px] absolute top-0 right-4" />
              )}
            </div>
          ))}
        </div>
        {chains
          .map((chain) => (chain.selected ? true : undefined))
          .filter((item) => item).length > 0 ? (
          <div className="container absolute inset-x-0 bottom-4 w-full">
            <div className="flex w-full">
              <Link
                href={
                  connect
                    ? "/create/choose-username"
                    : "/create/recovery-phrase"
                }
                className="w-full rounded-xl font-bold bg-black py-3 text-center text-sm text-white"
              >
                Next
              </Link>
            </div>
          </div>
        ) : (
          <div className="container absolute inset-x-0 bottom-4 w-full">
            <div className="flex w-full">
              <div className="cursor-not-allowed w-full rounded-xl font-bold bg-black/40 py-3 text-center text-sm text-white">
                Next
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CreateWallet.getLayout = function getLayout(page: ReactElement) {
  return (
    <CreateWalletLayout
      meta={
        <Meta title="Create Wallet - FetchhX" description="create wallet" />
      }
    >
      {page}
    </CreateWalletLayout>
  );
};

export default CreateWallet;
