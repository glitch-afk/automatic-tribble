import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface Address {
  address: string
  privateKey?: string
  type: 'injected' | 'created'
}

export interface Chain {
  id: string | number
  chainId: string | number
  name: string
  logo: any
  blockExplorer: string
  selected: boolean
}