import Link from 'next/link';
import type { ReactElement } from 'react';
import React from 'react';

import CreateWalletLayout from '@/layouts/create';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const ChooseUserName: NextPageWithLayout = () => {
  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="flex w-full flex-col space-y-1">
        <label htmlFor="input#2" className="text-sm text-neutral-500">
          Choose Username
        </label>
        <input
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
      <div className="container absolute inset-x-0 bottom-4 w-full">
        <div className="flex w-full">
          <Link
            href="/create/create-password"
            className="w-full rounded-xl bg-black py-3 text-center text-sm text-white"
          >
            Next
          </Link>
        </div>
      </div>
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
