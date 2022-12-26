import Link from 'next/link';
import type { ReactElement } from 'react';
import React from 'react';

import CreateWalletLayout from '@/layouts/create';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const ConfirmSecret: NextPageWithLayout = () => {
  return (
    <div className="mt-12 flex w-full flex-col items-center justify-center space-y-4">
      <div className="flex w-full flex-col space-y-1">
        <label htmlFor="input#1" className="text-sm text-neutral-500">
          Enter first word of recovery phrase
        </label>
        <input
          type="text"
          name="input#1"
          className="w-full rounded-xl border-none bg-white py-3  px-2 text-sm outline-none"
        />
      </div>
      <div className="flex w-full flex-col space-y-1">
        <label htmlFor="input#2" className="text-sm text-neutral-500">
          Enter forth word of recovery phrase
        </label>
        <input
          type="text"
          name="input#2"
          className="w-full rounded-xl border-none bg-white py-3  px-2 text-sm outline-none"
        />
      </div>
      {/* confirm button */}
      <div className="container absolute inset-x-0 bottom-4 w-full">
        <div className="flex w-full">
          <Link
            href="/create/choose-username"
            className="w-full rounded-xl bg-black py-3 text-center text-sm text-white"
          >
            Confirm
          </Link>
        </div>
      </div>
    </div>
  );
};

ConfirmSecret.getLayout = function getLayout(page: ReactElement) {
  return (
    <CreateWalletLayout
      meta={
        <Meta
          title="Confirm Secret Phrase - FetcchX"
          description="secret recovery phrase confirmation"
        />
      }
    >
      {page}
    </CreateWalletLayout>
  );
};

export default ConfirmSecret;
