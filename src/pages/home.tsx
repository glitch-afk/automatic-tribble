import Link from 'next/link';
import type { ReactElement } from 'react';
import React from 'react';

import { Bell } from '@/components/icons/bell';
import { Down } from '@/components/icons/down';
import { Up } from '@/components/icons/up';
import { UpDown } from '@/components/icons/upDown';
import Transactions from '@/components/transactions';
import AuthLayout from '@/layouts/Auth';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const HomePage: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col">
      {/* header */}
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-bold">💰 Star</h2>
        {/* right side */}
        <div className="flex items-center space-x-2">
          {/* wallets */}
          <div>
            <Link href="/home">
              <div className="h-6 w-6 rounded-full bg-orange-600" />
            </Link>
            <span className="sr-only">Wallets</span>
          </div>
          {/* notifications */}
          <Link href="/home">
            <Bell />
          </Link>
        </div>
      </div>
      {/* header end */}
      <div className="mt-12 flex w-full flex-col items-center justify-center">
        <h2 className="mb-1 text-2xl font-bold sm:text-3xl">$ 102.18</h2>
        <h3>mandar@backpack</h3>
        {/* send - receive - request */}
        <div className="mt-6 flex w-1/2 items-center justify-between">
          <div className="text-center">
            <Link
              href="/send"
              className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white"
            >
              <Up />
            </Link>
            <span>Send</span>
          </div>
          <div className="text-center">
            <Link
              href="/"
              className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white"
            >
              <Down />
            </Link>
            <span>Receive</span>
          </div>
          <div className="text-center">
            <Link
              href="/"
              className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white"
            >
              <UpDown />
            </Link>
            <span>Request</span>
          </div>
        </div>
      </div>
      {/* transactions */}
      <Transactions />
    </div>
  );
};

HomePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout
      meta={<Meta title="Fetcch Wallet" description="Demo for Fetcch Wallet" />}
    >
      {page}
    </AuthLayout>
  );
};

export default HomePage;
