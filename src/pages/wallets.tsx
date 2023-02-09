import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { LeftIcon } from '@/components/icons/leftIcon';
import WalletComp from '@/components/wallet/wallet';
import WalletList from '@/components/wallet/walletList';
import { ActionLayout } from '@/layouts/Action';
import { Meta } from '@/lib/Meta';
import { useAppContext } from '@/lib/store';
import type { NextPageWithLayout } from '@/types';

const ReceivePage: NextPageWithLayout = () => {
  const { openConnectModal } = useConnectModal();
  const { idData } = useAppContext();

  return (
    <div className="relative max-h-[600px] min-h-[600px] font-sans ">
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
        <WalletList name={idData?.id as string}>
          <WalletComp
            address={idData?.default.address as string}
            chain={idData?.default?.chain.id as number}
            type={idData?.default.isContract ? "AA" : "EOA"}
          />
          {idData?.secondary.map((wallet, index) => {
            return (
              <WalletComp
                key={index}
                address={wallet?.address}
                chain={wallet?.chain.id as number}
                type={wallet.isContract ? "AA" : "EOA"}
              />
            );
          })}
        </WalletList>
      </div>
      {/* chains */}
      <div className="absolute bottom-2 flex w-full flex-col items-center justify-center space-y-2 font-bold">
        <>
          {openConnectModal && (
            <button
              onClick={openConnectModal}
              type="button"
              className=" w-full rounded-xl border border-black bg-black p-3 text-white"
            >
              Add Wallet
            </button>
          )}
        </>
        <Link href={"/create"} className="w-full p-0 ">
          <button
            type="button"
            className=" w-full rounded-xl border border-black p-3 text-black"
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
