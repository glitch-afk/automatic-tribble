import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ReactElement, useEffect } from 'react';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useAccount, useSigner } from 'wagmi';

import { Check } from '@/components/icons/check';
import { Copy } from '@/components/icons/copy';
import { Logo } from '@/components/icons/logo';
import { Main } from '@/layouts/Main';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import { useAppContext } from '@/lib/store';
import { findWalletId } from '@/lib/hooks/user';
import { ethers } from 'ethers';

const Home: NextPageWithLayout = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);

  const { data: signer } = useSigner()

  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    copyToClipboard(address as string);
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  }

  const router = useRouter();
  const { idData } = useAppContext()

  useEffect(() => {
    if (idData) {
      router.push("/home");
    }
  }, []);

  const { setIdData, setIdentity, setAddresses } = useAppContext()

  const retrieve = async () => {
    if(signer) {
      const signature = await signer.signMessage('wagpay did this')

      const id = await findWalletId({
        signedMsg: signature
      })

      setIdData(id)
      setIdentity(id.identifier)
      const addresses = [id.default.address, id.others.map((o: any) => o.address)].flat()
      console.log(addresses, id, id.identifier);
      setAddresses(addresses)
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Logo className="mb-4" />
      <h3>Making Crosschain seemless</h3>
      {isConnected ? (
        <>
          {address && (
            <div className="mx-2 mt-5 mb-3 flex h-9 w-full items-center rounded-full bg-neutral-200 md:mx-0 xl:mt-6">
              <div className="truncate bg-center pl-4 text-xs text-black sm:text-sm">
                {address}
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
          )}
          <div className="w-full flex flex-col justify-center items-center space-y-1">
            <Link
              href="/create/?connect=true"
              className="w-full rounded-md bg-black p-3 text-center text-white"
            >
              Continue
            </Link>
            <div
              onClick={() => retrieve()}
              className="w-full rounded-md bg-black p-3 text-center text-white"
            >
              Retrieve
            </div>
          </div>
        </>
      ) : (
        <>
          {openConnectModal && (
            <button
              onClick={openConnectModal}
              type="button"
              className="mt-6 mb-2 w-full rounded-xl bg-black p-3 text-white"
            >
              Connect Wallet
            </button>
          )}
          <Link
            href="/create?connect=false"
            className="w-full rounded-xl border border-black p-3 text-center text-black"
          >
            Create Wallet
          </Link>
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
