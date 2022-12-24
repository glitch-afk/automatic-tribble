import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { Check } from '@/components/icons/check';
import { Bnb } from '@/components/icons/coins/bnb';
import { Ethereum } from '@/components/icons/coins/ethereum';
import { Usdc } from '@/components/icons/coins/usdc';
import { Copy } from '@/components/icons/copy';
import { LeftIcon } from '@/components/icons/leftIcon';
import { ActionLayout } from '@/layouts/Action';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const ReceivePage: NextPageWithLayout = () => {
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);

  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    copyToClipboard('mandar@backpack'); // replace mandar@backpack with anything you want to be copied
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  }

  return (
    <div>
      <header className="flex w-full items-center">
        {/* back button */}
        <Link href="/home" className="z-20">
          <LeftIcon className="z-10 h-6 w-6" />
        </Link>
        <Link href="/home"></Link>
        <h2 className="-ml-6 w-full text-center text-xl font-semibold">
          Receive
        </h2>
      </header>
      {/* qrcode */}
      <div className="mt-12 flex w-full flex-col items-center justify-center">
        <div className="h-36 w-36 rounded-xl">
          <QRCodeSVG value="mandar@backpack" />
        </div>
        <div className="mx-auto mt-5 mb-3 flex h-9 max-w-xs items-center rounded-full bg-neutral-200 md:mx-0 xl:mt-6">
          <div className="truncate bg-center pl-4 text-xs text-black  sm:text-sm">
            mandar@backpack
          </div>
          <div
            title="Copy Address"
            className="flex cursor-pointer items-center px-4 text-neutral-500 transition hover:text-black"
            onClick={() => handleCopyToClipboard()}
          >
            {copyButtonStatus ? (
              <Check className="h-auto w-3.5 text-green-500" />
            ) : (
              <Copy className="h-auto w-3.5" />
            )}
          </div>
        </div>
      </div>
      {/* chains */}
      <div className="mt-6 flex w-full items-center justify-between">
        <h3 className="font-semibold">Chains available</h3>

        <div className="flex">
          <Ethereum />
          <Bnb className="-ml-2" />
          <Usdc className="-ml-2" />
        </div>
      </div>
    </div>
  );
};

ReceivePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ActionLayout
      meta={
        <Meta title="Receive - Fetcch Wallet" description="Receive Tokens" />
      }
    >
      {page}
    </ActionLayout>
  );
};

export default ReceivePage;
