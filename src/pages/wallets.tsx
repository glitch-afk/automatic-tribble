import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { LeftIcon } from '@/components/icons/leftIcon';
import WalletComp from '@/components/wallet/wallet';
import WalletList from '@/components/wallet/walletList';
import { ActionLayout } from '@/layouts/Action';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const ReceivePage: NextPageWithLayout = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="relative max-h-[600px] min-h-[600px]">
      <header className="flex w-full items-center">
        {/* back button */}
        <Link href="/home" className="z-20">
          <LeftIcon className="z-10 h-6 w-6" />
        </Link>
        <Link href="/home"></Link>
        <h2 className="-ml-6 w-full text-center text-xl font-semibold">
          Wallets
        </h2>
      </header>
      {/* qrcode */}
      <div className="mt-8 flex w-full flex-col items-center  ">
        <WalletList name="vikash@fetcch">
          <WalletComp
            address="0xlkwjdoweijweofjmowe"
            chain="Ethereum Mainnet"
            type="AA"
          />
          <WalletComp
            address="0xlkwjdoweijweofjmowe"
            chain="Ethereum Mainnet"
            type="AA"
          />
          <WalletComp
            address="0xlkwjdoweijweofjmowe"
            chain="Ethereum Mainnet"
            type="AA"
          />
        </WalletList>
      </div>
      {/* chains */}
      <div className="absolute bottom-2 w-full">
        <>
          {openConnectModal && (
            <button
              onClick={openConnectModal}
              type="button"
              className="mt-6 mb-2 w-full rounded-xl bg-black p-3 text-white"
            >
              Add Wallet
            </button>
          )}
        </>
        <Link href={'/create'}>
          <button
            type="button"
            className="mt-4 mb-2 w-full rounded-xl border border-black p-3 text-black"
          >
            Create Wallet
          </button>
        </Link>
      </div>
    </div>
  );
};

ReceivePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ActionLayout
      meta={<Meta title="wallets" description="all your wallets" />}
    >
      {page}
    </ActionLayout>
  );
};

export default ReceivePage;
