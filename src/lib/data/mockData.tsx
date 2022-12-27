import { Bnb } from "@/components/icons/coins/bnb";
import { Busd } from "@/components/icons/coins/busd";
import { Ethereum } from "@/components/icons/coins/ethereum";
import { Polygon } from "@/components/icons/coins/polygon";
import { Usdc } from "@/components/icons/coins/usdc";
import { Chain, Token } from "@/types";
import { Balance } from "../hooks/useBalances";

export const NotificationsData = [
  {
    amount: '20 MATIC',
    requestedBy: 'cosmix@metamask',
  },
  {
    amount: '20 USDC',
    requestedBy: 'mandar@backpack',
  },
  {
    amount: '12 BNB',
    requestedBy: 'rohan@fetcch',
  },
  {
    amount: '20 MATIC',
    requestedBy: 'cosmix@metamask',
  },
  {
    amount: '20 USDC',
    requestedBy: 'mandar@backpack',
  },
  {
    amount: '12 BNB',
    requestedBy: 'rohan@fetcch',
  },
];

export const secretPhrase = [
  'fan',
  'house',
  'flower',
  'table',
  'rail',
  'yarn',
  'number',
  'festive',
  'good',
  'tree',
  'vehicle',
  'letter',
];

export const chainsList: Chain[] = [
  {
    id: 1,
    chainId: 1,
    name: "Ethereum Mainnet",
    logo: Ethereum,
    blockExplorer: "https://etherscan.io",
    selected: false,
  },
  {
    id: 2,
    chainId: 137,
    name: "Polygon Mainnet",
    logo: Polygon,
    blockExplorer: "https://polygonscan.io",
    selected: false,
  },
  {
    id: 3,
    chainId: 56,
    name: "BSC Mainnet",
    logo: Bnb,
    blockExplorer: "https://bscscan.io",
    selected: false,
  },
];

export const tokensList: Partial<Balance>[] = [
  {
    tokenName: "USD Coin",
    tokenTicker: "USDC",
    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    tokenLogo: Usdc,
    tokenDecimal: 6,
    chain: 1,
  },
  {
    tokenName: "USD Coin",
    tokenTicker: "USDC",
    tokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    tokenLogo: Usdc,
    tokenDecimal: 6,
    chain: 2,
  },
  {
    tokenName: "Binance USD",
    tokenTicker: "BUSD",
    tokenAddress: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    tokenLogo: Busd,
    tokenDecimal: 18,
    chain: 3,
  },
  {
    tokenName: "Ethereum",
    tokenTicker: "ETH",
    tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    tokenLogo: Ethereum,
    tokenDecimal: 18,
    chain: 1,
  },
  {
    tokenName: "Matic",
    tokenTicker: "MATIC",
    tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    tokenLogo: Polygon,
    tokenDecimal: 18,
    chain: 2,
  },
  {
    tokenName: "Binance",
    tokenTicker: "BNB",
    tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    tokenLogo: Bnb,
    tokenDecimal: 18,
    chain: 3,
  },
];