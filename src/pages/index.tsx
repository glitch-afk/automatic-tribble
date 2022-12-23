import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useAccount } from 'wagmi';

import { Check } from '@/components/icons/check';
import { Copy } from '@/components/icons/copy';
import { Logo } from '@/components/icons/logo';
import { Main } from '@/layouts/Main';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const Home: NextPageWithLayout = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);

  // eslint-disable-next-line @typescript-eslint/naming-convention, unused-imports/no-unused-vars
  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    copyToClipboard(address as string);
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Logo className="mb-4" />
      <h3>Making Crosschain seemless</h3>

      {isConnected ? (
        <>
          {address && (
            <div className="mx-2 mt-5 mb-3 flex h-9 w-full items-center rounded-full bg-gray-200 md:mx-0 xl:mt-6">
              <button
                className="inline-flex h-full shrink-0 grow-0 items-center rounded-full bg-gray-900 px-4 text-xs text-white sm:text-sm"
                onClick={openAccountModal}
              >
                Change Account
              </button>
              <div className="truncate bg-center pl-4 text-xs text-gray-500 dark:text-gray-300 sm:text-sm">
                {address}
              </div>
              <div
                title="Copy Address"
                className="flex cursor-pointer items-center px-4 text-gray-500 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => handleCopyToClipboard()}
              >
                {copyButtonStatus ? (
                  <Check className="h-auto w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-auto w-3.5" />
                )}
              </div>
            </div>
          )}
          <Link
            href="/home"
            className="w-full rounded-md bg-black p-3 text-center text-white"
          >
            Continue
          </Link>
        </>
      ) : (
        <>
          {/* connect wallet button */}
          {openConnectModal && (
            <button
              onClick={openConnectModal}
              type="button"
              className="mt-6 mb-2 w-full rounded-xl bg-black p-3 text-white"
            >
              Connect Wallet
            </button>
          )}
          {/* create wallet button */}
          <button className="w-full rounded-xl border border-black p-3 text-black">
            Create Wallet
          </button>
        </>
      )}
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Main
      meta={<Meta title="Fetcch Wallet" description="Demo for Fetcch Wallet" />}
    >
      {page}
    </Main>
  );
};

export default Home;
