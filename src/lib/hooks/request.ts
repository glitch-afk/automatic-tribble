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

export const fetcchChains: any = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '137': '2',
  '56': '3',
  '10': '5',
  '43114': '4',
  '42161': '6',
  '7': '7',
  '8': '8'
}

export const createPaymentRequest = async (
  requestData: CreatePaymentRequest
) => {
  try {
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
  } catch (e: any) {
    throw new Error(e.response.data?.error)
  }
};

export const updatePaymentRequest = async (
  requestData: UpdatePaymentRequest
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/request`,
      data: {
        ...requestData,
        fromChain: Number(requestData.fromChain)
      },
      headers: {
        "content-type": "application/json",
        "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
      },
    });
  
    const data = await res.data;
  
    if (data.error) throw new Error(data.error);
  
    return data.data;
  } catch (e: any) {
    throw new Error(e.response.data?.error)
  }
};

export const getPaymentRequest = async (params: any) => {
  try {
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
  } catch (e: any) {
    throw new Error(e.response.data?.error)
  }
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
  try {
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
  } catch (e: any) {
    throw new Error(e.response.data?.error)
  }
}

export const getTokenDetail = async (address: string, chain: string): Promise<Partial<Balance>> => {
  const res = await axios({
    url: `/api/tokens/`,
    params: {
      token: address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? 
                (chain === "137" ? "0x0000000000000000000000000000000000001010" : 
                  (chain === "1" ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")) : address,
      chain
    }
  })

  const data = (await res.data)
  console.log(data, "123333")
  
  console.log(data, await res.data)

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