import axios from 'axios';

import { BACKEND_BASE_URL, SECRET_KEY } from '@/config';
import { request } from '@/utils/request';

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

export const findWalletId = async (id: string) => {
  const res = await request(
    `query WalletId($id: String!) {
      walletIds(where: { id: $id }) {
        id
        identifier
        provider {
            id
            delimiter
        }
        default {
            address
            chain {
                name
                chainId
            }
        }
        others {
            address
            chain {
                name
                chainId
            }
        }
        dataSourceTx {
            id
        }
        isContract
        currentSignature
        previousSignature
        syncedAt
        createdAt
      }
    }`,
    {
      id,
    }
  );

  const data = await res.data;

  return data.data.walletIds.length > 0 ? data.data.walletIds[0] : undefined;
};

export const createWalletId = async (walletId: WalletId): Promise<WalletId> => {
  try {
    const res = await axios({
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
    });

    const data = await res.data;

    return data.data.uploadAndIndexWalletId.walletId;
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};
