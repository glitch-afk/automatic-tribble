import { request } from '@/utils/request';

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

type PaymentRequest = CreatePaymentRequest & UpdatePaymentRequest;

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
      request: requestData,
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

export const getPaymentRequest = async (params: Partial<PaymentRequest>) => {
  const res = await request(
    `mutation PaymentRequest($request: RequestWhereInput!) {
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
      where: params,
    }
  );

  const data = await res.data;

  return data.data.requests;
};
