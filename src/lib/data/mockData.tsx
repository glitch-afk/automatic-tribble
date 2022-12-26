import { Bnb } from "@/components/icons/coins/bnb";
import { Ethereum } from "@/components/icons/coins/ethereum";
import { Polygon } from "@/components/icons/coins/polygon";
import { Chain } from "@/types";

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