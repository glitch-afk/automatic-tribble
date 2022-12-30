import { request } from '@/utils/request';

export interface WalletAddress {
    address: string;
    chain: any;
    isContract: boolean;
}

export interface WalletId {
  id?: string;
  identifier: string;
  provider: string;
  default: {
    address: string;
    chain: any;
    isContract: boolean;
  };
  others: {
    address: string;
    chain: any[];
    isContract: boolean;
  }[];
  isContract?: boolean;
  currentSignature: string;
  previousSignature?: string;
}

export const findWalletId = async (where: any) => {
  const res = await request(
    `query WalletId($where: WalletIdWhereInput!) {
      walletIds(where: $where) {
        id
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
            isContract
        }
        others {
            address
            chain {
                id
                name
                chainId
            }
            isContract
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
      where,
    }
  );

  const data = await res.data;
  console.log(
    data.data
  );

  return data.data.walletIds.length > 0 ? data.data.walletIds[0] : undefined;
};

export const generateMessage = async (walletId: Partial<WalletId>) => {
  try {

    const res = await request(
      `query A($id: WalletIdCreateInput!) {
				generateMessage(id: $id) {
					message
					nonce
					walletId {
						id
						provider {
							id
							delimiter
						}
						identifier
						currentSignature
						previousSignature
						default {
							address
							chain {
								id
								name
								chainId
							}
              isContract
						}
						others {
							address
							chain {
								id
								name
								chainId
							}
              isContract
						}
					}
					providerSignature
				}
			}
`,
      { id: walletId }
    );

    const data = await res.data

    return data.data.generateMessage

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

export const createWalletId = async (walletId: WalletId): Promise<WalletId> => {
  try {
    const res = await request(
      `mutation UploadAndIndexWalletId($walletId: WalletIdCreateInput!) {
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
                isContract
              }
              others {
                address
                chain {
                  id
                  name
                  chainId
                }
                isContract
              }
            }
            nonce
            dataSourceTx {
              txId
            }
          }
        }`,
      {
        walletId,
      }
    );

    const data = await res.data;

    return data.data.uploadAndIndexWalletId.walletId;
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};
