import Link from 'next/link';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { LeftIcon } from '@/components/icons/leftIcon';
import SelectToken from '@/components/token-select';
import SendModal from '@/components/ui/sendModal';
import { ActionLayout } from '@/layouts/Action';
import { Meta } from '@/lib/Meta';
import { useAppContext } from '@/lib/store';
import type { NextPageWithLayout } from '@/types';

const SendPage: NextPageWithLayout = () => {
  const [showModal, setShowModal] = useState(false);

  const { balances } = useAppContext();
  const [tokens, _setTokens] = useState(
    balances != null ? Object.values(balances).flat() : []
  );

  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  return (
    <header>
      {/* back button */}
      <div className="flex w-full items-center">
        <Link href="/home" className="z-20">
          <LeftIcon className="z-10 h-6 w-6" />
        </Link>
        <Link href="/home"></Link>
        <h2 className="-ml-6 w-full text-center text-xl font-semibold">Send</h2>
      </div>
      {/* send to */}
      <div className="mt-12 flex flex-col space-y-4">
        <div className="flex flex-col">
          <label htmlFor="wallet_id" className="mb-1">
            Send to
          </label>
          <input
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
          tokens={tokens}
          setSelectedToken={setSelectedToken}
          selectedToken={selectedToken}
        />
        {/* amount */}
        <div className="mb-4 mt-8 flex flex-col">
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="amount">Send to</label>
            <span className="text-xs text-neutral-500">
              Max ${selectedToken?.balance ?? '0.00'}
            </span>
          </div>
          <input
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
          onClick={() => setShowModal(true)}
        >
          Continue
        </button>
      </div>

      {/* modal */}
      {showModal && <SendModal isOpen={showModal} setIsOpen={setShowModal} />}
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
