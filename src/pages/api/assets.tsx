import { NextApiRequest, NextApiResponse } from "next"
import axios from 'axios'

const chains: any = {
  '137': 'matic',
  '1': 'ethereum',
  '56': 'bsc',
  '7': 'solana',
  '8': 'aptos'
}

const getBalanceOnApi = async (address: string, chain: string) => {
  return axios({
    url: `https://api.unmarshal.com/v1/${chains[chain]}/address/${address}/assets?auth_key=kfzpwdqrQD9FdaMbIdSXm4CTiD2oBzzt9uQ6fleA`,
    headers: {
      "content-type": "application/json",
      "Accept-Encoding": "gzip,deflate,compress",
    },
  });
};

const getBalanceMoralisAptos = async (address: string, chain: string) => {
  return axios({
    url: `https://mainnet-aptos-api.moralis.io/wallets/coins?limit=100&owner_addresses%5B0%5D=${address}`,
    headers: {
      'x-api-key': 'iLeDGNjOtHTbBoE5xcmVB1cxsLQzHfGoqpJzvMrPaghOXeSAX0TRnSogHylVEFLs'
    }
  })
}

const getTokensAptos = async (address: string[]) => {
  return axios({
    url: `https://mainnet-aptos-api.moralis.io/coins`,
    params: {
      coin_type_hashes: address
    },
    headers: {
      'x-api-key': 'iLeDGNjOtHTbBoE5xcmVB1cxsLQzHfGoqpJzvMrPaghOXeSAX0TRnSogHylVEFLs'
    }
  })
}

const assets = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const params = req.query
    console.log(params)
    if(params.chain === '8') {
      const ress = await getBalanceMoralisAptos(params.address as string, params.chain as string)
      const data = await ress.data;

      const resTokens = await getTokensAptos(data.result.map((x: any) => x.coin_type_hash))
      const tokens = (await resTokens.data);

      console.log(resTokens.data, "tokens")
      res.status(200).send(
        data.result.map((x: any, index: number) => ({
          contract_address: x.coin_type,
          contract_ticker_symbol: tokens[index].symbol,
          contract_name: tokens[index].name,
          logo_url: "",
          contract_decimals: tokens[index].decimals,
          quote: 0,
          balance: x.amount
        })
      ))
    } else {
      const ress = await getBalanceOnApi(params.address as string, params.chain as string)
      console.log(ress)
      const data = await ress.data
      console.log(data)
    
      res.status(200).send(data)
    }
  } catch (e) {
    console.log(e)
    res.status(200).send(null);
  }
}

export default assets