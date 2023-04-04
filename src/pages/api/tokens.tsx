import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const ON_API_KEY = "b80d94df2319fbeee26092357b4400d9bf303f2d";

const getTransactionsOnApi = async (address: string, chain: string) => {
  return axios({
    url: `https://beta.onapi.xyz/api/v1/tokens/details?provider=debank&contract_address=${address}&chain=${chain}`,
    headers: {
      "X-OnAPI-Key": ON_API_KEY,
      "content-type": "application/json",
      "Accept-Encoding": "gzip,deflate,compress",
    },
  });
};

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

const getTokensSolana = async (address: string) => {
  return axios({
    url: `https://api.unmarshal.com/v1/tokenstore/token/address/${address}?auth_key=kfzpwdqrQD9FdaMbIdSXm4CTiD2oBzzt9uQ6fleA`,
  })
}

const tokens = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const params = req.query;

    if(params.chain == '8') {
      const ress = await getTokensAptos(
        [params.address as string],
      );
  
      const data = await ress.data;
  
      res.status(200).send(data.map((x: any) => ({
        tokenAddress: x.coin_type,
        chain: 8,
        tokenName: x.name,
        tokenTicker: x.symbol,
        tokenDecimal: x.decimals,
        usdPrice: 0,
        tokenLogo: ""
      })));
    } else if (params.chain === '7') {
      console.log(params.token, "TOKENNNNNNNNNNNNNNNNNN")
      if(params.token === '11111111111111111111111111111111111111111111') {
        res.status(200).send({
          id: '11111111111111111111111111111111111111111111',
          chain: 7,
          name: 'Solana',
          symbol: 'SOL',
          decimals: 9,
          price: 0,
          logo_url: ""
        })
      }
      const ress = await getTokensSolana(
        params.address as string,
      );
        console.log(ress, "ress")
      const data = await ress.data;
  
      res.status(200).send({
        id: data[0].contract,
        chain: 7,
        name: data[0].name,
        symbol: data[0].symbol,
        decimals: data[0].decimal,
        price: 0,
        logo_url: ""
      });
    } else {
      const ress = await getTransactionsOnApi(
        params.address as string,
        params.chain as string
      );
  
      const data = await ress.data;
  
      res.status(200).send(data);
    }
  } catch (e) {
    res.status(200).send(null);
  }
};

export default tokens;
