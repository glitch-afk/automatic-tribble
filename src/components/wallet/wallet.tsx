import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { Bnb } from '@/components/icons/coins/bnb';
import { Ethereum } from '@/components/icons/coins/ethereum';
import { useAppContext } from '@/lib/store';

import { Check } from '../icons/check';
import { Polygon } from '../icons/coins/polygon';
import { Copy } from '../icons/copy';

export type CoinList =
  | 'Ethereum Mainnet'
  | 'Binance Mainnet'
  | 'Polygon Mainnet';

const coinIcons: Record<CoinList, JSX.Element> = {
  'Ethereum Mainnet': <Ethereum className="h-8 w-8 border" />,
  'Binance Mainnet': <Bnb />,
  'Polygon Mainnet': <Polygon />,
};

interface CurrencySwapProps {
  chain: CoinList;
  address: string;
  type: string;
}

export default function WalletComp({
  chain,
  address,
  type,
}: CurrencySwapProps) {
  const { idData } = useAppContext();

  const [copyButtonStatus, setCopyButtonStatus] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    copyToClipboard(idData?.id as string); // replace mandar@backpack with anything you want to be copied
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  }
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-start">
        <div className="flex ">
          <div className="">{coinIcons[chain]}</div>
        </div>
        <div className="ml-3 flex flex-col items-start justify-center">
          <div className="flex">
            <p className="text-lg font-medium">{address}</p>
          </div>
          <p className="mt-2 rounded-full bg-gray-200 px-4 text-start text-black">
            {type} address
          </p>
        </div>
      </div>
      <div
        title="Copy Address"
        className="flex cursor-pointer items-center px-4 text-neutral-500 transition hover:text-black"
        onClick={() => handleCopyToClipboard()}
      >
        {copyButtonStatus ? (
          <Check className="h-auto w-5 text-green-500" />
        ) : (
          <Copy className="h-5 w-5 " />
        )}
      </div>
      {/* right side */}
    </div>
  );
}
