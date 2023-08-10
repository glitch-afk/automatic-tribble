import { createContext, useContext } from 'react';

import type { Balance } from '@/lib/hooks/useBalances';
import type { Address, Chain } from '@/types';

import type { WalletId } from '../hooks/user';

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
  chains: Chain[];
  setChains: Function;
  idData: WalletId | undefined;
  setIdData: Function;
  seedPhrase: string[];
  setSeedPhrase: Function;
  requests: any[];
  setRequests: Function;
  selectedAddress: Address | undefined;
  setSelectedAddress: Function;
  authToken: string;
  setAccessToken: Function;
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
