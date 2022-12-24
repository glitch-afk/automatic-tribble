import axios from 'axios';
import { useState } from 'react';

import { BACKEND_BASE_URL, SECRET_KEY } from '@/config';

export interface WalletId {
  id?: string;
  identifier: string;
  provider: string;
  default: {
    address: string;
    chain: number;
  };
  others: {
    address: string;
    chain: number[];
  }[];
  isContract?: boolean;
  currentSignature: string;
  previousSignature?: string;
}

export const useCreateWalletId = (walletId: WalletId) => {
  const [result, setResult] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(undefined);

  const create = () => {
    axios({
      url: BACKEND_BASE_URL,
      method: 'POST',
      data: {
        query: `mutation UploadAndIndexWalletId($walletId: WalletIdCreateInput!) {
          uploadAndIndexWalletId(data: $walletId) {
            id
            walletId {
              identifier
              provider {
                id
                delimiter
              }
              default {
                address
                chain {
                  id
                  name
                  chainId
                }
              }
              others {
                address
                chain {
                  id
                  name
                  chainId
                }
              }
            }
            nonce
            dataSourceTx {
              txId
            }
          }
        }`,
        variables: {
          walletId,
        },
      },
      headers: {
        'content-type': 'application/json',
        'secret-key': SECRET_KEY,
      },
    })
      .then((res) => res.data)
      .then((data) => {
        setResult(data);
        setIsLoading(false);
        setError(undefined);
      })
      .catch((e) => {
        setError(e);
        setIsLoading(false);
        setResult(undefined);
      });
  };

  return {
    result,
    isLoading,
    error,
    create,
  };
};
