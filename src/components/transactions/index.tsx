import CurrencySwap from '@/components/ui/curreny-swap';

import TransactionsList from './list';
import { useAppContext } from "@/lib/store";
import { ethers } from 'ethers';

const index = () => {
  const { balances: result } = useAppContext()

  return (
    <ul className="mx-auto mt-10 max-h-[480px] w-full overflow-y-scroll">
      {result && 
        <>
          {Object.keys(result).map(keys => {
            // @ts-ignore
            if(keys && result[keys] && result[keys]?.length > 0) {
              
              let totalUsdBalance = 0
              result[keys]?.map(e => totalUsdBalance += Number(e.balanceUsd))

              return (
                <TransactionsList
                  // @ts-ignore
                  tokenTicker={result[keys][0]?.tokenTicker}
                  balance={ethers.utils
                    .formatUnits(
                      // @ts-ignore
                      result[keys][0]?.balance as string,
                      // @ts-ignore
                      result[keys][0]?.tokenDecimal as number
                    )
                    .toString()}
                  // @ts-ignore
                  image={result[keys][0]?.tokenLogo}
                >
                  {result[keys]?.map((res) => (
                    <div className="mb-3">
                      <CurrencySwap
                        from={res.tokenTicker.substring(0, 8) as any}
                        to="ETH"
                        balance={ethers.utils
                          .formatUnits(
                            // @ts-ignore
                            res?.balance as string,
                            // @ts-ignore
                            res?.tokenDecimal as number
                          )
                          .toString()}
                        usdBalance={res.balanceUsd as string}
                        image={res.tokenLogo as string}
                      />
                    </div>
                  ))}
                </TransactionsList>
              );
            } else {
              return <></>
            }
          })}
        </>
      }
    </ul>
  );
};

export default index;
