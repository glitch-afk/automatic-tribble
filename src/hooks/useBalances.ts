import { useEffect, useState } from "react"
import axios from 'axios'
import { findWalletId } from "./user"
import { useAppContext } from "@/lib/store";

export interface Balance {
  tokenName: string;
  tokenAddress: string;
  tokenLogo: string;
  tokenTicker: string;
  balance: string | number;
  balanceUsd: string | number;
  chain: string | number;
  tokenDecimal: number;
}

const API_KEY = 'ckey_ed497df39d654966875e01c195e'

export const getBalance = async (address: string, chain: string) => {
  return axios({
    url: `https://api.covalenthq.com/v1/${chain}/address/${address}/balances_v2/?key=${API_KEY}`,
  });
}

export const useBalances = (id: string) => {
  const { balances, setBalances, setUsdBalance } = useAppContext()
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>()

  const getBalances = async () => {
    try {
      let balances: { [key: string]: Array<Balance> } = {}
      let usdBalance = 0
      
      const walletId = await findWalletId(id)

      if(!walletId) throw new Error(`${id} doesn't exist`)
  
      const addresses: { address: string, chain: string[] }[] = [{ address: walletId.default.address, chain: [walletId.default.chain.chainId] }, walletId.others.map((other: any) => ( { address: other.address, chain: other.chain.map((chain: any) => chain.chainId) } ))].flat()
  
      for(let i = 0; i < addresses.length; i++) {
        const address = addresses[i]
  
        if(!address) continue
        
        for(let j = 0; j < address.chain.length; j++) {
          getBalance(address.address, address.chain[j] as string)
            .then(res => res.data.data.items)
            .then(tokens => {
              for(let k = 0; k < tokens.length; k++) {
                const token = tokens[k];
                
                if(!balances[token.contract_ticker_symbol]) balances[token.contract_ticker_symbol] = []
                
                usdBalance += token.quote ? Number(token.quote) : 0 ;

                balances[token.contract_ticker_symbol]?.push({
                  tokenAddress: token.contract_address,
                  tokenTicker: token.contract_ticker_symbol,
                  tokenName: token.contract_name,
                  tokenLogo: token.logo_url,
                  tokenDecimal: token.contract_decimals,
                  balance: token.balance,
                  balanceUsd: token.quote_rate,
                  chain: address.chain[j] as string
                })
              }

              setUsdBalance(usdBalance)
              setBalances(balances)
              setIsLoading(false)
              setError(null)
            })
  
        }
      }
  
    } catch (e) {
      console.log(e)
      setBalances(null);
      setIsLoading(false)
      setError(e)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    getBalances()
  }, [])

  return {
    result: balances,
    isLoading,
    error
  }
}