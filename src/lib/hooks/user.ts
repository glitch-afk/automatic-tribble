// import { request, request2 } from '@/utils/request';
import axios from 'axios';

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
  secondary: {
    address: string;
    chain: any;
    isContract: boolean;
  }[];
  isContract?: boolean;
  currentSignature: string;
  previousSignature?: string;
}

export const findWalletId = async (where: any) => {
  // const res = await request(
  //   `query WalletId($where: WalletIdWhereInput!) {
  //     walletIds(where: $where) {
  //       id
  //       identifier
  //       provider {
  //           id
  //           delimiter
  //       }
  //       default {
  //           address
  //           chain {
  //               id
  //               name
  //               chainId
  //           }
  //           isContract
  //       }
  //       others {
  //           address
  //           chain {
  //               id
  //               name
  //               chainId
  //           }
  //           isContract
  //       }
  //       dataSourceTx {
  //           id
  //       }
  //       isContract
  //       currentSignature
  //       previousSignature
  //       syncedAt
  //       createdAt
  //     }
  //   }`,
  //   {
  //     where,
  //   }
  // );

  try {
    const res = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/identity`,
      params: where,
      headers: {
        "content-type": "application/json",
        "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
      },
    });
  
    const data = await res.data;
    
    if(data.error) throw new Error(data.error)
  
    return data.data;
  } catch (e: any) {
    throw new Error(e.response.data?.error)
  }
};

export const generateMessage = async (walletId: Partial<WalletId>) => {
  try {

//     const res = await request(
//       `query A($id: WalletIdCreateInput!) {
// 				generateMessage(id: $id) {
// 					message
// 					nonce
// 					walletId {
// 						id
// 						provider {
// 							id
// 							delimiter
// 						}
// 						identifier
// 						currentSignature
// 						previousSignature
// 						default {
// 							address
// 							chain {
// 								id
// 								name
// 								chainId
// 							}
//               isContract
// 						}
// 						others {
// 							address
// 							chain {
// 								id
// 								name
// 								chainId
// 							}
//               isContract
// 						}
// 					}
// 					providerSignature
// 				}
// 			}
// `,
//       { id: walletId }
//     );

//     const data = await res.data

//     return data.data.generateMessage

    const res = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/identity/generate-message`,
      data: walletId,
      headers: {
        "content-type": "application/json",
        "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
      },
    });

    const data = await res.data;

    if (data.error) throw new Error(data.error);

    return data.data;

  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw new Error(e.response.data?.error)
  }
}

export const createWalletId = async (walletId: WalletId): Promise<{walletId: WalletId, error?: any}> => {
  try {
    // const res = await request(
    //   `mutation UploadAndIndexWalletId($walletId: WalletIdCreateInput!) {
    //       uploadAndIndexWalletId(data: $walletId) {
    //         id
    //         walletId {
    //           id
    //           identifier
    //           provider {
    //               id
    //               delimiter
    //           }
    //           default {
    //               address
    //               chain {
    //                   id
    //                   name
    //                   chainId
    //               }
    //               isContract
    //           }
    //           others {
    //               address
    //               chain {
    //                   id
    //                   name
    //                   chainId
    //               }
    //               isContract
    //           }
    //           dataSourceTx {
    //               id
    //           }
    //           isContract
    //           currentSignature
    //           previousSignature
    //           syncedAt
    //           createdAt
    //         }
    //       }
    //     }`,
    //   {
    //     walletId,
    //   }
    // );

    // const data = await res.data;

    // return {
    //   walletId:
    //     data.data.uploadAndIndexWalletId && data.data.uploadAndIndexWalletId.walletId
    //       ? data.data.uploadAndIndexWalletId.walletId
    //       : undefined,
    //   error: data.errors ? data.errors : undefined,
    // };

    const res = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/identity`,
      data: walletId,
      headers: {
        "content-type": "application/json",
        "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
      },
    });

    const data = await res.data;

    if (data.error) throw new Error(data.error);

    return data.data;    
  } catch (e: any) {
    // eslint-disable-next-line no-console
    throw new Error(e.response.data?.error)
  }
};
