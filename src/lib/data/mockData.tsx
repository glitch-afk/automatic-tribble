import { Aptos } from "@/components/icons/coins/aptos";
import { Arbitrium } from "@/components/icons/coins/arbitrium";
import { Avax } from "@/components/icons/coins/avax";
import { Bnb } from "@/components/icons/coins/bnb";
import { Busd } from "@/components/icons/coins/busd";
import { Ethereum } from "@/components/icons/coins/ethereum";
import { Optimism } from "@/components/icons/coins/optimism";
import { Polygon } from "@/components/icons/coins/polygon";
import { Solana } from "@/components/icons/coins/solana";
import { Usdc } from "@/components/icons/coins/usdc";
import { Chain } from "@/types";
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
    type: 'EVM'
  },
  {
    id: 2,
    chainId: 137,
    name: "Polygon Mainnet",
    logo: Polygon,
    blockExplorer: "https://polygonscan.io",
    selected: false,
    type: 'EVM'
  },
  {
    id: 3,
    chainId: 56,
    name: "BSC Mainnet",
    logo: Bnb,
    blockExplorer: "https://bscscan.io",
    selected: false,
    type: 'EVM'
  },
  {
    id: 4,
    chainId: 43114,
    name: "Avalanche C-Chain Mainnet",
    logo: Avax,
    blockExplorer: "https://bscscan.io",
    selected: false,
    type: 'EVM'
  },
  {
    id: 5,
    chainId: 10,
    name: "Optimism Mainnet",
    logo: Optimism,
    blockExplorer: "https://bscscan.io",
    selected: false,
    type: 'EVM'
  },
  {
    id: 6,
    chainId: 42161,
    name: "Arbitrium Mainnet",
    logo: Arbitrium,
    blockExplorer: "https://bscscan.io",
    selected: false,
    type: 'EVM'
  },
  {
    id: 7,
    chainId: 7,
    name: "Solana Mainnet",
    logo: Solana,
    blockExplorer: "https://bscscan.io",
    selected: false,
    type: 'SOLANA'
  },
  {
    id: 8,
    chainId: 8,
    name: "Aptos Mainnet",
    logo: Aptos,
    blockExplorer: "https://bscscan.io",
    selected: false,
    type: 'APTOS'
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
  {
    tokenName: "Aptos",
    tokenTicker: "APT",
    tokenAddress: "0x1::aptos_coin::AptosCoin",
    tokenLogo: Aptos,
    tokenDecimal: 10,
    chain: 8,
  },
  {
    tokenName: "Solana",
    tokenTicker: "SOL",
    tokenAddress: "11111111111111111111111111111111111111111111",
    tokenLogo: Solana,
    tokenDecimal: 9,
    chain: 7,
  },
];