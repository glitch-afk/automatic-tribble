import type { ReactElement } from 'react';
import React from 'react';

import { LeftIcon } from '@/components/icons/leftIcon';
import { ActionLayout } from '@/layouts/Action';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const SendPage: NextPageWithLayout = () => {
  return (
    <header>
      {/* back button */}
      <div className="flex w-full items-center">
        <LeftIcon className="h-8 w-8" />
        <h2 className="-ml-6 w-full text-center text-xl font-semibold">Send</h2>
      </div>
      {/* send to */}
      <div>
        <label htmlFor="wallet_id">Send to</label>
        <input type="email" name="wallet_id" id="wallet_id" />
      </div>
    </header>
  );
};

SendPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ActionLayout
      meta={<Meta title="Fetcch Wallet" description="Demo for Fetcch Wallet" />}
    >
      {page}
    </ActionLayout>
  );
};

export default SendPage;
