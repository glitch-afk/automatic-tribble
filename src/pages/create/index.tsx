import Link from 'next/link';
import type { ReactElement } from 'react';
import React from 'react';

import { Bnb } from '@/components/icons/coins/bnb';
import { Ethereum } from '@/components/icons/coins/ethereum';
import CreateWalletLayout from '@/layouts/create';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const CreateWallet: NextPageWithLayout = () => {
  return (
    <div className="my-4 flex flex-col">
      <h2 className="text-xl font-semibold">
        Which network would you like to use?
      </h2>
      {/* networks grid */}
      <div className="max-h-[420px] overflow-y-auto">
        <div className="mt-4 grid w-full grid-cols-2 gap-3">
          {/* single network 😿 like me */}
          <Link
            href="/create/recovery-phrase"
            className="col-span-1 flex flex-col items-start justify-center space-y-3 rounded-xl bg-white p-2"
          >
            <Ethereum className="m-0 h-10 w-8" />
            <span className="font-semibold">Ethereum </span>
          </Link>
          {/* single network end */}
          <Link
            href="/create/recovery-phrase"
            className="col-span-1 flex flex-col items-start justify-center space-y-3 rounded-xl bg-white p-2"
          >
            <Bnb className="m-0 h-10 w-8" />
            <span className="font-semibold">BNB</span>
          </Link>
          <Link
            href="/create/recovery-phrase"
            className="col-span-1 flex flex-col items-start justify-center space-y-3 rounded-xl bg-white p-2"
          >
            <Bnb className="m-0 h-10 w-8" />
            <span className="font-semibold">BNB</span>
          </Link>
          <Link
            href="/create/recovery-phrase"
            className="col-span-1 flex flex-col items-start justify-center space-y-3 rounded-xl bg-white p-2"
          >
            <Ethereum className="m-0 h-10 w-8" />
            <span className="font-semibold">Ethereum </span>
          </Link>
        </div>
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
