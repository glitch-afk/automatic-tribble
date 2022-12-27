import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';

import CreateWalletLayout from '@/layouts/create';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';
import { useAppContext } from '@/lib/store';

const ConfirmSecret: NextPageWithLayout = () => {
  const { seedPhrase } = useAppContext()
  
  const [isValid, setIsValid] = useState(false)

  const [firstWord, setFirstWord] = useState("")
  const [lastWord, setLastWord] = useState("");

  useEffect(() => {
    let isValid = true

    if(firstWord) {
      isValid = seedPhrase[0] === (firstWord)
    } else {
      isValid = false
    }

    if (lastWord) {
      isValid = seedPhrase[3] === lastWord;
    } else {
      isValid = false;
    }

    setIsValid(isValid)
  }, [firstWord, lastWord])
  
  return (
    <div className="mt-12 flex w-full flex-col items-center justify-center space-y-4">
      <div className="flex w-full flex-col space-y-1">
        <label htmlFor="input#1" className="text-sm text-neutral-500">
          Enter first word of recovery phrase
        </label>
        <input
          value={firstWord}
          onChange={(e) => setFirstWord(e.target.value)}
          type="text"
          name="input#1"
          className="w-full rounded-xl border-none bg-white py-3  px-2 text-sm outline-none"
        />
      </div>
      <div className="flex w-full flex-col space-y-1">
        <label htmlFor="input#2" className="text-sm text-neutral-500">
          Enter forth word of recovery phrase
        </label>
        <input
          value={lastWord}
          onChange={(e) => setLastWord(e.target.value)}
          type="text"
          name="input#2"
          className="w-full rounded-xl border-none bg-white py-3  px-2 text-sm outline-none"
        />
      </div>
      {/* confirm button */}
      <div className="container absolute inset-x-0 bottom-4 w-full">
        <div className="flex w-full">
          {isValid && (
            <Link
              href="/create/choose-username"
              className="w-full rounded-xl bg-black py-3 text-center text-sm text-white"
            >
              Confirm
            </Link>
          )}
          {!isValid && (
            <div
              className="w-full rounded-xl bg-red-400 py-3 text-center text-sm text-white"
            >
              Invalid words
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ConfirmSecret.getLayout = function getLayout(page: ReactElement) {
  return (
    <CreateWalletLayout
      meta={
        <Meta
          title="Confirm Secret Phrase - FetcchX"
          description="secret recovery phrase confirmation"
        />
      }
    >
      {page}
    </CreateWalletLayout>
  );
};

export default ConfirmSecret;
