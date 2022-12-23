import { Bnb } from '@/components/icons/coins/bnb';
import { Ethereum } from '@/components/icons/coins/ethereum';
import { Usdc } from '@/components/icons/coins/usdc';

export type CoinList = 'ETH' | 'BNB' | 'USDC';

const coinIcons: Record<CoinList, JSX.Element> = {
  ETH: <Ethereum />,
  BNB: <Bnb />,
  USDC: <Usdc />,
};

interface CurrencySwapProps {
  from: CoinList;
  to: CoinList;
}

export default function CurrencySwap({ from, to }: CurrencySwapProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex">
        <div className="flex items-center">
          <div className="relative">{coinIcons[from]}</div>
          <div className="-ml-2.5">{coinIcons[to]}</div>
        </div>
        <div className="ml-3 flex flex-col items-start justify-center">
          <div className="flex">
            <div className=" whitespace-nowrap text-sm font-semibold uppercase text-black dark:text-white">
              {from}
            </div>
            <span className="ml-1 text-sm text-neutral-400">on {to}</span>
          </div>
          <p className="text-neutral-600">35 {from}</p>
        </div>
      </div>
      {/* right side */}
      <span className="text-lg font-semibold">$ 35.56</span>
    </div>
  );
}
