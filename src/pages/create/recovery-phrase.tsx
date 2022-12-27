import Link from 'next/link';
import { ReactElement, useEffect } from 'react';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { Check } from '@/components/icons/check';
import { Copy } from '@/components/icons/copy';
import CreateWalletLayout from '@/layouts/create';
import { secretPhrase } from '@/lib/data/mockData';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';
import { ethers } from 'ethers';
import { useAppContext } from '@/lib/store';

const RecoveryPhrasePage: NextPageWithLayout = () => {
  const { seedPhrase, setSeedPhrase, setAddresses } = useAppContext();

  const generateSeedPhrase = () => {
    const wallet = ethers.Wallet.createRandom();

    setSeedPhrase(wallet.mnemonic.phrase.split(" "));
    setAddresses([{
      address: wallet.address,
      privateKey: wallet.privateKey,
      type: 'created'
    }])
  };

  useEffect(() => {
    generateSeedPhrase()
  }, [])
  
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);

  let secret_phrase = '';

  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    copyToClipboard(seedPhrase.join(" ")); // value your want to be copied
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  }

  return (
    <div className="my-4 flex flex-col">
      <h2 className="text-xl font-semibold">Secret Recovery Phrase</h2>
      <p className="mt-2 text-xs text-neutral-500">
        This is the only way to recover your account if you lose your device.
        Write it down and store it in a safe place
      </p>
      <div className="mt-4 max-h-[500px] w-full overflow-y-auto">
        {/* secret grid */}
        <div className="grid w-full grid-cols-3 gap-2">
          {seedPhrase.map((item, index) => {
            return (
              <div className="w-full rounded-md bg-white p-2" key={index}>
                <span className="inline-flex select-none">{index + 1}.</span>
                <span className="inline select-text">{item}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* copy button */}
      <div
        className="mt-5 flex w-full cursor-pointer select-text items-center justify-center rounded-md bg-white p-3"
        onClick={() => handleCopyToClipboard()}
      >
        <span>Copy</span>
        <div
          title="Copy Address"
          className="flex cursor-pointer items-center px-4 text-neutral-500 transition hover:text-black"
        >
          {copyButtonStatus ? (
            <Check className="h-auto w-3.5 text-green-500" />
          ) : (
            <Copy className="h-auto w-3.5" />
          )}
        </div>
      </div>
      {/* bottom panel */}
      <div className="container absolute inset-x-0 bottom-4 w-full">
        <div className="flex w-full flex-col items-center justify-center">
          {/* confirmation */}
          <div className="mb-2 flex space-x-2">
            <input type="checkbox" name="secret_phrase" />
            <p className="text-neutral-500">I saved my secret phrase</p>
          </div>
          {/* next button */}
          <Link
            href="/create/confirm-secret"
            className="w-full rounded-xl bg-black py-3 text-center text-sm text-white"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

RecoveryPhrasePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <CreateWalletLayout
      meta={
        <Meta
          title="Recovery Phrase - FetcchX"
          description="Save secret recovery phrase"
        />
      }
    >
      {page}
    </CreateWalletLayout>
  );
};

export default RecoveryPhrasePage;
