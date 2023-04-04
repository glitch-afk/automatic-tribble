import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface Address {
  address: string
  privateKey?: string
  chain: number
  fetcchType: 'default' | 'secondary'
  type: 'injected' | 'created'
}

export interface Chain {
  id: string | number
  chainId: string | number
  name: string
  logo: any
  type: 'EVM' | 'APTOS' | 'SOLANA'
  blockExplorer: string
  selected: boolean
}

export interface Token {
  name: string;
  address: string;
  logo: any;
  decimals: number;
  chain: number;
}