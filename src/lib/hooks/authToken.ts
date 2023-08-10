import axios from "axios"
import base58 from "bs58"
import { ethers } from "ethers"
import nacl from "tweetnacl"


export const createAuthToken = async (privateKey: string, chainType: "EVM" | "SOLANA", id: string) => {
  const res = await axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/authentication/generate-message`,
    data: {
      owner: id
    },
    headers: {
      "content-type": "application/json",
      "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
    }
  })

  const { message, timestamp } = (await res.data).data

  let signature = ""
   if(chainType === "EVM") {
    const wallet = new ethers.Wallet(privateKey)

    signature = await wallet.signMessage(message)
   } else {
    const pKey = base58.decode(privateKey)

      const signaturex = nacl.sign.detached(Buffer.from(message), pKey)

      signature =  base58.encode(signaturex)
   }

   const res1 = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/authentication`,
      data: {
        owner: id,
        signature,
        timestamp
      },
      headers: {
        "content-type": "application/json",
        "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
      }
   })

   const data1 = await res1.data

   return data1.data.accessToken
}