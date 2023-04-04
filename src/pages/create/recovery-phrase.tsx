import Link from 'next/link';
import { ReactElement, useEffect } from 'react';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { Check } from '@/components/icons/check';
import { Copy } from '@/components/icons/copy';
import CreateWalletLayout from '@/layouts/create';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';
import { ethers } from 'ethers';
import { useAppContext } from '@/lib/store';
import * as aptos from 'aptos'
import { Keypair } from '@solana/web3.js';
import base58 from 'bs58';
import * as bip39 from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english"

const RecoveryPhrasePage: NextPageWithLayout = () => {
  const { seedPhrase, setSeedPhrase, setAddresses, chains } = useAppContext();

  const generateSeedPhrase = () => {
    const wallet = ethers.Wallet.createRandom();
    const seedPhrase = wallet.mnemonic.phrase
    let path = wallet.mnemonic.path

    const hdNode = ethers.utils.HDNode.fromMnemonic(seedPhrase)

    setSeedPhrase(wallet.mnemonic.phrase.split(" "));
    
    let addresses = []

    for(let i = 0; i < chains.length; i++) {
      const chain = chains[i]

      if(!chain?.selected) continue

      if(chain) {
        if(chain.type === 'EVM') {
          const address = hdNode.derivePath(path)
          path = path.substring(0, path.length - 1) + (Number(path[path.length - 1]) + 1).toString()
          addresses.push({
            address: address.address,
            privateKey: address.privateKey,
            type: 'created',
            chain: chain.id,
            fetcchType: i === 0 ? 'default' : 'secondary'
          })
        } else if (chain.type === 'APTOS') {
          const seedPhraseAptos = bip39.generateMnemonic(wordlist)
          const path = `m/44'/637'/0'/0'/0'`
          const address = aptos.AptosAccount.fromDerivePath(path, seedPhraseAptos)
          addresses.push({
            address: address.address().toString(),
            publicKey: address.pubKey().toString(),
            privateKey: aptos.HexString.fromUint8Array(address.signingKey.secretKey).toString(),
            type: 'created',
            chain: 8,
            fetcchType: i === 0 ? 'default' : 'secondary'
          })
        } else if (chain.type === 'SOLANA') {
          const address = Keypair.generate()
          addresses.push({
            address: address.publicKey.toBase58(),
            privateKey: base58.encode(address.secretKey),
            type: 'created',
            chain: 7,
            fetcchType: i === 0 ? 'default' : 'secondary'
          })
        }
      }
    }

    console.log(addresses, "Address")
    
    // setAddresses([{
    //   address: wallet.address,
    //   privateKey: wallet.privateKey,
    //   type: 'created'
    // }])

    setAddresses(addresses)
  };

  useEffect(() => {
    generateSeedPhrase()
  }, [])
  
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);


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
