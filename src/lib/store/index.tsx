import { createContext, useContext } from 'react';

import type { Balance } from '@/lib/hooks/useBalances';
import { Address, Chain } from '@/types';
import { WalletId } from '../hooks/user';

export interface ContextInterface {
  balances: {
    [key: string]: Array<Balance>;
  };
  setBalances: Function;
  usdBalance: string;
  setUsdBalance: Function;
  identity: string;
  setIdentity: Function;
  addresses: Address[];
  setAddresses: Function;
  chains: Chain[],
  setChains: Function;
  idData: WalletId | undefined;
  setIdData: Function;
  seedPhrase: string[];
  setSeedPhrase: Function;
}

export const AppContext = createContext<ContextInterface>(
  {} as ContextInterface
);

export function useAppContext() {
  return useContext(AppContext);
}

// export default function () {
//   return <div></div>;
// }
