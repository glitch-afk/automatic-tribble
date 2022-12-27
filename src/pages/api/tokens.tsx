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

const tokens = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const params = req.query;

    const ress = await getTransactionsOnApi(
      params.address as string,
      params.chain as string
    );

    const data = await ress.data;

    res.status(200).send(data);
  } catch (e) {
    res.status(200).send(null);
  }
};

export default tokens;
