// import { request } from '@/utils/request';
import axios from 'axios';
import { Balance } from './useBalances';

interface CreatePaymentRequest {
  receiver: string;
  payer: string;
  token: string;
  chain: number;
  amount: string;
  message: string;
  label: string;
}

interface UpdatePaymentRequest {
  id: number;
  transactionHash: string;
  fromChain: string;
  fromToken: string;
  executed: boolean;
}

// type PaymentRequest = CreatePaymentRequest & UpdatePaymentRequest;

export const fetcchChains: any = {
  '1': '1',
  '137': '2',
  '56': '3',
  '10': '4'
}

export const createPaymentRequest = async (
  requestData: CreatePaymentRequest
) => {
  // const res = await request(
  //   `mutation PaymentRequest($request: RequestCreateInput!) {
  //       paymentRequests(request: $request) {
  //           id
  //           payer {
  //             id
  //           }
  //           payee {
  //             id
  //           }
  //           token
  //           chain {
  //             id
  //             name
  //             chainId
  //           }
  //           amount
  //           message
  //           label
  //           data
  //           executed
  //           transactionHash
  //           sameChain
  //           fromChain {
  //             id
  //             name
  //             chainId
  //           }
  //           fromToken
  //           dstTransactionHash
  //           createdAt
  //       }
  //   }`,
  //   {
  //     request: requestData
  //   }
  // );

  // const data = await res.data;

  // return data.data.paymentRequests;

  const res = await axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/request`,
    data: requestData,
    headers: {
      "content-type": "application/json",
      "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
    },
  });

  const data = await res.data;

  if (data.error) throw new Error(data.error);

  return data.data;
};

export const updatePaymentRequest = async (
  requestData: UpdatePaymentRequest
) => {
  // const res = await request(
  //   `mutation PaymentRequest($request: RequestCreateInput!) {
  //       paymentRequests(request: $request) {
  //           id
  //           payer {
  //             id
  //           }
  //           payee {
  //             id
  //           }
  //           token
  //           chain {
  //             id
  //             name
  //             chainId
  //           }
  //           amount
  //           message
  //           label
  //           data
  //           executed
  //           transactionHash
  //           sameChain
  //           fromChain {
  //             id
  //             name
  //             chainId
  //           }
  //           fromToken
  //           dstTransactionHash
  //           createdAt
  //       }
  //   }`,
  //   {
  //     request: requestData,
  //   }
  // );

  // const data = await res.data;

  // return data.data.paymentRequests;

  const res = await axios({
    method: "PATCH",
    url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/request`,
    data: requestData,
    headers: {
      "content-type": "application/json",
      "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
    },
  });

  const data = await res.data;

  if (data.error) throw new Error(data.error);

  return data.data;
};

export const getPaymentRequest = async (params: any) => {
  // const res = await request(
  //   `query PaymentRequest($request: RequestWhereInput!) {
  //       requests(where: $request) {
  //           id
  //           payer {
  //             id
  //           }
  //           payee {
  //             id
  //           }
  //           token
  //           chain {
  //             id
  //             name
  //             chainId
  //             explorers {
  //               url
  //             }
  //           }
  //           amount
  //           message
  //           label
  //           data
  //           executed
  //           transactionHash
  //           sameChain
  //           fromChain {
  //             id
  //             name
  //             chainId
  //             explorers {
  //               url
  //             }
  //           }
  //           fromToken
  //           dstTransactionHash
  //           createdAt
  //       }
  //   }`,
  //   {
  //     request: params,
  //   }
  // );

  // const data = await res.data;

  // return data.data.requests;

  const res = await axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/request`,
    params: params,
    headers: {
      "content-type": "application/json",
      "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
    },
  });

  const data = await res.data;

  if (data.error) throw new Error(data.error);

  return data.data;  
};

interface BuildTransactionParams {
  receiver?: string;
  transactionRequestId?: string;
  payerConfig: {
    payer: string;
    token: string;
    address: string;
    chain: number;
    amount: string;
  };
}

export const buildTransaction = async (params: BuildTransactionParams) => {
  // const res = await request(
  //   `query t($data: BuildTransactionInput) {
  //       buildTransaction(data:$data){
  //         transactionData
  //         approvalTransaction
  //         bridgeDetails {
  //             tool
  //             name
  //             estAmount
  //             toChain {
  //                 name
  //             }
  //             gasFeesUsd
  //             toToken
  //         }
  //         payee
  //         userConfig {
  //           fromId {
  //             id
  //           }
  //           fromAddress
  //           fromToken
  //           fromChain {
  //             id
  //             name
  //             chainId
  //           }
  //           amount
  //         }
  //       }
  //     }`,
  //   {
  //     data: {
  //       ...params,
  //       userConfig: {
  //         ...params.userConfig,
  //         fromChain: fetcchChains[params.userConfig.fromChain]
  //       }
  //     },
  //   }
  // );

  // const data = await res.data;

  // return data.data.buildTransaction;

  const res = await axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/payment/build-transaction`,
    data: params,
    headers: {
      "content-type": "application/json",
      "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
    },
  });

  const data = await res.data;

  if (data.error) throw new Error(data.error);

  return data.data;
}

export const getTokenDetail = async (address: string, chain: string): Promise<Partial<Balance>> => {
  const res = await axios({
    url: `/api/tokens/`,
    params: {
      address: address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? (chain === "137" ? "0x0000000000000000000000000000000000001010" : (chain === "1" ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")) : address,
      chain
    }
  })

  const data = (await res.data).data

  return {
    tokenAddress: data.id,
    chain: chain,
    tokenName: data.name,
    tokenTicker: data.symbol,
    tokenDecimal: data.decimals,
    usdPrice: data.price,
    tokenLogo: data.logo_url
  }
}