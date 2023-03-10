import { NextApiRequest, NextApiResponse } from "next"
import axios from 'axios'

const chains: any = {
  '137': 'matic',
  '1': 'ethereum',
  '56': 'bsc'
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

const assets = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const params = req.query
    console.log(params)
    const ress = await getBalanceOnApi(params.address as string, params.chain as string)
    console.log(ress)
    const data = await ress.data
    console.log(data)
  
    res.status(200).send(data)
  } catch (e) {
    console.log(e)
    res.status(200).send(null);
  }
}

export default assets