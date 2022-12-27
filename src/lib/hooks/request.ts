import { request } from '@/utils/request';
import axios from 'axios';
import { Balance } from './useBalances';

interface CreatePaymentRequest {
  payee: string;
  payer: string;
  token: string;
  chain: string;
  amount: string;
  message: string;
  label: string;
}

interface UpdatePaymentRequest {
  id: number;
  transactionHash: string;
  fromChain: string;
  fromToken: string;
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
  const res = await request(
    `mutation PaymentRequest($request: RequestCreateInput!) {
        paymentRequests(request: $request) {
            id
            payer {
              id
            }
            payee {
              id
            }
            token
            chain {
              id
              name
              chainId
            }
            amount
            message
            label
            data
            executed
            transactionHash
            sameChain
            fromChain {
              id
              name
              chainId
            }
            fromToken
            dstTransactionHash
            createdAt
        }
    }`,
    {
      request: {
        ...requestData,
        chain: fetcchChains[requestData.chain]
      },
    }
  );

  const data = await res.data;

  return data.data.paymentRequests;
};

export const updatePaymentRequest = async (
  requestData: UpdatePaymentRequest
) => {
  const res = await request(
    `mutation PaymentRequest($request: RequestCreateInput!) {
        paymentRequests(request: $request) {
            id
            payer {
              id
            }
            payee {
              id
            }
            token
            chain {
              id
              name
              chainId
            }
            amount
            message
            label
            data
            executed
            transactionHash
            sameChain
            fromChain {
              id
              name
              chainId
            }
            fromToken
            dstTransactionHash
            createdAt
        }
    }`,
    {
      request: requestData,
    }
  );

  const data = await res.data;

  return data.data.paymentRequests;
};

export const getPaymentRequest = async (params: any) => {
  const res = await request(
    `query PaymentRequest($request: RequestWhereInput!) {
        requests(where: $request) {
            id
            payer {
              id
            }
            payee {
              id
            }
            token
            chain {
              id
              name
              chainId
              explorers {
                url
              }
            }
            amount
            message
            label
            data
            executed
            transactionHash
            sameChain
            fromChain {
              id
              name
              chainId
              explorers {
                url
              }
            }
            fromToken
            dstTransactionHash
            createdAt
        }
    }`,
    {
      request: params,
    }
  );

  const data = await res.data;

  return data.data.requests;
};

interface BuildTransactionParams {
  payee?: string;
  paymentRequestId?: string;
  userConfig: {
    fromId: string;
    fromToken: string;
    fromAddress: string;
    fromChain: string;
    amount: string;
  };
}

export const buildTransaction = async (params: BuildTransactionParams) => {
  const res = await request(
    `query t($data: BuildTransactionInput) {
        buildTransaction(data:$data){
          transactionData
          approvalTransaction
          bridgeDetails {
              tool
              name
              estAmount
              toChain {
                  name
              }
              gasFeesUsd
              toToken
          }
        }
      }`,
    {
      data: params,
    }
  );

  const data = await res.data;

  return data.data.buildTransaction;
}

export const getTokenDetail = async (address: string, chain: string): Promise<Partial<Balance>> => {
  const res = await axios({
    url: `/api/tokens/`,
    params: {
      address,
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