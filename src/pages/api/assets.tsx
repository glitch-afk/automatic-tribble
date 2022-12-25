import { NextApiRequest, NextApiResponse } from "next"
import axios from 'axios'

const ON_API_KEY = "b80d94df2319fbeee26092357b4400d9bf303f2d";

const getBalanceOnApi = async (address: string, chain: string) => {
  return axios({
    url: `https://beta.onapi.xyz/api/v1/assets?provider=unmarshall&wallet_address=${address}&chain=${chain}`,
    headers: {
      "X-OnAPI-Key": ON_API_KEY,
      "content-type": "application/json",
      "Accept-Encoding": "gzip,deflate,compress",
    },
  });
};

const assets = async (req: NextApiRequest, res: NextApiResponse) => {
  const params = req.query

  const ress = await getBalanceOnApi(params.address as string, params.chain as string)
  console.log(ress)
  const data = await ress.data
  console.log(data)

  res.status(200).send(data)
}

export default assets