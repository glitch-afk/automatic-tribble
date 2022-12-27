import Link from 'next/link';
import { ReactElement } from 'react';

import { Bell } from '@/components/icons/bell';
import { Down } from '@/components/icons/down';
import { Logo } from '@/components/icons/logo';
import { Up } from '@/components/icons/up';
import { UpDown } from '@/components/icons/upDown';
import Transactions from '@/components/transactions';
import AuthLayout from '@/layouts/Auth';
import { Meta } from '@/lib/Meta';
import { useAppContext } from '@/lib/store';
import type { NextPageWithLayout } from '@/types';

const HomePage: NextPageWithLayout = () => {
  const {  usdBalance, idData } = useAppContext();

  return (
    <div className="flex flex-col">
      {/* header */}
      <div className="flex w-full items-center justify-between">
        <Logo className="w-14" />
        {/* right side */}
        <div className="flex items-center space-x-6">
          {/* wallets */}
          <div>
            <Link href="/home">
              <div className="h-6 w-6 rounded-full bg-gradient-to-b from-yellow-500 to-orange-600" />
            </Link>
            <span className="sr-only">Wallets</span>
          </div>
          {/* notifications */}
          <Link href="/notifications">
            <Bell fill="black" />
          </Link>
        </div>
      </div>
      {/* header end */}
      <div className="mt-12 flex w-full flex-col items-center justify-center">
        <h2 className="mb-1 text-2xl font-bold sm:text-3xl">
          {+usdBalance > 0 ? `$ ${usdBalance}` : '$ 0.00'}
        </h2>
        <h3>{idData?.id}</h3>
        {/* send - receive - request */}
        <div className="mt-8 flex w-2/3 items-center justify-between">
          <div className="text-center">
            <Link
              href="/send"
              className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white"
            >
              <Up className="h-5 w-5" />
            </Link>
            <span className="mt-1 text-xs">Send</span>
          </div>
          <div className="text-center">
            <Link
              href="/receive"
              className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white"
            >
              <Down className="h-5 w-5" />
            </Link>
            <span className="mt-1 text-xs">Receive</span>
          </div>
          <div className="text-center">
            <Link
              href="/request"
              className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white"
            >
              <UpDown className="h-5 w-5" />
            </Link>
            <span className="mt-1 text-xs">Request</span>
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
