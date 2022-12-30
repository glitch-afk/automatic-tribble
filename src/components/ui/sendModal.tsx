import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';

import { Cross } from '../icons/cross';
import LoadingScreen from '../loading';
import { useAppContext } from '@/lib/store';
import { BigNumber, ethers } from 'ethers';
import { fetcchChains, getTokenDetail, updatePaymentRequest } from '@/lib/hooks/request';
import { chainsList } from '@/lib/data/mockData';
import { useSigner, useSwitchNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { WalletAddress } from '@/lib/hooks/user';

const ERC_20_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authorizer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "nonce",
        type: "bytes32",
      },
    ],
    name: "AuthorizationCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authorizer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "nonce",
        type: "bytes32",
      },
    ],
    name: "AuthorizationUsed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "Blacklisted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newBlacklister",
        type: "address",
      },
    ],
    name: "BlacklisterChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "burner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newMasterMinter",
        type: "address",
      },
    ],
    name: "MasterMinterChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minterAllowedAmount",
        type: "uint256",
      },
    ],
    name: "MinterConfigured",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldMinter",
        type: "address",
      },
    ],
    name: "MinterRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "PauserChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newRescuer",
        type: "address",
      },
    ],
    name: "RescuerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "UnBlacklisted",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" },
  {
    inputs: [],
    name: "CANCEL_AUTHORIZATION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RECEIVE_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "authorizer", type: "address" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
    ],
    name: "authorizationState",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "blacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "blacklister",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "authorizer", type: "address" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "minter", type: "address" },
      { internalType: "uint256", name: "minterAllowedAmount", type: "uint256" },
    ],
    name: "configureMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currency",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "decrement", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "increment", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "tokenName", type: "string" },
      { internalType: "string", name: "tokenSymbol", type: "string" },
      { internalType: "string", name: "tokenCurrency", type: "string" },
      { internalType: "uint8", name: "tokenDecimals", type: "uint8" },
      { internalType: "address", name: "newMasterMinter", type: "address" },
      { internalType: "address", name: "newPauser", type: "address" },
      { internalType: "address", name: "newBlacklister", type: "address" },
      { internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "newName", type: "string" }],
    name: "initializeV2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "lostAndFound", type: "address" },
    ],
    name: "initializeV2_1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "isBlacklisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "masterMinter",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "minter", type: "address" }],
    name: "minterAllowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pauser",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "validAfter", type: "uint256" },
      { internalType: "uint256", name: "validBefore", type: "uint256" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "minter", type: "address" }],
    name: "removeMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenContract",
        type: "address",
      },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "rescueERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rescuer",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "validAfter", type: "uint256" },
      { internalType: "uint256", name: "validBefore", type: "uint256" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "unBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_newBlacklister", type: "address" },
    ],
    name: "updateBlacklister",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_newMasterMinter", type: "address" },
    ],
    name: "updateMasterMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newPauser", type: "address" }],
    name: "updatePauser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newRescuer", type: "address" }],
    name: "updateRescuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];
export const AA_ABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"handler","type":"address"}],"name":"ChangedFallbackHandler","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"module","type":"address"}],"name":"DisabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_scw","type":"address"},{"indexed":true,"internalType":"address","name":"_oldEOA","type":"address"},{"indexed":true,"internalType":"address","name":"_newEOA","type":"address"}],"name":"EOAChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"module","type":"address"}],"name":"EnabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldEntryPoint","type":"address"},{"indexed":false,"internalType":"address","name":"newEntryPoint","type":"address"}],"name":"EntryPointChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"txGas","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"txGas","type":"uint256"}],"name":"ExecutionSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_scw","type":"address"},{"indexed":false,"internalType":"string","name":"version","type":"string"},{"indexed":false,"internalType":"address","name":"newImplementation","type":"address"}],"name":"ImplementationUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"WalletHandlePayment","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"checkSignatures","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"prevModule","type":"address"},{"internalType":"address","name":"module","type":"address"}],"name":"disableModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"enableModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"targetTxGas","type":"uint256"}],"internalType":"struct Transaction","name":"_tx","type":"tuple"},{"components":[{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"uint256","name":"tokenGasPriceFactor","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"}],"internalType":"struct FeeRefund","name":"refundInfo","type":"tuple"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"encodeTransactionData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"entryPoint","outputs":[{"internalType":"contract IEntryPoint","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dest","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"func","type":"bytes"}],"name":"exec","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"dest","type":"address[]"},{"internalType":"bytes[]","name":"func","type":"bytes[]"}],"name":"execBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"dest","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"func","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"gasLimit","type":"uint256"}],"name":"execFromEntryPoint","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"targetTxGas","type":"uint256"}],"internalType":"struct Transaction","name":"_tx","type":"tuple"},{"internalType":"uint256","name":"batchId","type":"uint256"},{"components":[{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"uint256","name":"tokenGasPriceFactor","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"}],"internalType":"struct FeeRefund","name":"refundInfo","type":"tuple"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"execTransaction","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModule","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModuleReturnData","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"start","type":"address"},{"internalType":"uint256","name":"pageSize","type":"uint256"}],"name":"getModulesPaginated","outputs":[{"internalType":"address[]","name":"array","type":"address[]"},{"internalType":"address","name":"next","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"batchId","type":"uint256"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"targetTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"uint256","name":"tokenGasPriceFactor","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gasUsed","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"uint256","name":"tokenGasPriceFactor","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"}],"name":"handlePaymentRevert","outputs":[{"internalType":"uint256","name":"payment","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address[]","name":"_others","type":"address[]"},{"internalType":"address","name":"_entryPointAddress","type":"address"},{"internalType":"address","name":"_handler","type":"address"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"isModuleEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isOtherAddresses","outputs":[{"internalType":"bool","name":"check","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"others","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"dest","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"pullTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"requiredTxGas","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handler","type":"address"}],"name":"setFallbackHandler","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"dest","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newEntryPoint","type":"address"}],"name":"updateEntryPoint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"updateImplementation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct UserOperation","name":"userOp","type":"tuple"},{"internalType":"bytes32","name":"requestId","type":"bytes32"},{"internalType":"address","name":"aggregator","type":"address"},{"internalType":"uint256","name":"missingWalletFunds","type":"uint256"}],"name":"validateUserOp","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const rpcs: any = {
  1: "https://eth-mainnet.g.alchemy.com/v2/y141okG6TC3PecBM1mL0BfST9f4WQmLx",
  2: "https://polygon-mainnet.g.alchemy.com/v2/y141okG6TC3PecBM1mL0BfST9f4WQmLx",
  3: "https://binance.nodereal.io",
};

interface ISendModalProps {
  txDetails?: any;
  reviewDetails: any;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: boolean;
  setError: (error: boolean) => void;
  setErrorMessage: (error: string) => void;
  setSuccess: (success: boolean) => void;
  request: any;
  account: string
}

const SendModal = ({ reviewDetails, account, txDetails, isOpen, setIsOpen, setIsLoading, setError, setErrorMessage, setSuccess, request }: ISendModalProps) => {
  const [loading, setLoading] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [ethPrice, setETHPrice] = useState(0)

  useEffect(() => {
    getTokenDetail(
      reviewDetails.selectedToken.chain === "137" ? "0x0000000000000000000000000000000000001010" : (reviewDetails.selectedToken.chain === "1" ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"),
      reviewDetails.selectedToken.chain
    ).then((res) => {
      setETHPrice(Number(res.usdPrice));
    });
  }, [])

  useClickAway(modalContainerRef, () => {
    setIsOpen(false);
  });
  useLockBodyScroll(isOpen);

  const { idData } = useAppContext()
  const { data: signerData } = useSigner()
  const { openConnectModal } = useConnectModal();
  const { switchNetwork } =
    useSwitchNetwork();

  const { addresses } = useAppContext()

  const doTransaction = async () => {
    try {
      const address: WalletAddress =
        idData?.default.address.toLowerCase() === account.toLowerCase()
          ? idData.default
          : (idData?.others.find(
              (i) => i.address.toLowerCase() === account.toLowerCase()
            ) as WalletAddress);

      const addressWithPrivate = addresses.find(x => x.address.toLowerCase() === account.toLowerCase())

      let signer = signerData

      if(addressWithPrivate?.privateKey) {
        const wallet = new ethers.Wallet(addressWithPrivate.privateKey)
        const provider = ethers.getDefaultProvider(
          rpcs[txDetails.userConfig.fromChain.id]
        );
        signer = wallet.connect(provider)
      } else {
        if (!signer) {
          if (openConnectModal) {
            openConnectModal();
          }
          return;
        }
      }

      const currChainId = await signer.getChainId()
      const currAddress = await signer.getAddress()

      if(currChainId !== Number(txDetails.userConfig.fromChain.chainId) && switchNetwork) {
        switchNetwork(Number(txDetails.userConfig.fromChain.chainId));
      }

      if (
        (currAddress.toLowerCase() !==
        txDetails.userConfig.fromAddress.toLowerCase()) && !address.isContract
      )
        throw new Error("from");

      setIsLoading(true)

      if(address.isContract) {
        // aa function
        const aaAccount = new ethers.Contract(account, AA_ABI, signer)
        
        let batchAddresses: string[] = []
        let batchData: string[] = [];
        
        if(txDetails.approvalTransaction) {
          const approval = txDetails.approvalTransaction;
          const contract = new ethers.Contract(
            approval.tokenAddress,
            ERC_20_ABI,
            signer
          );
          // console.log(account)
          const balance = await contract.balanceOf(account)
          if(Number(balance) < Number(approval.approvalAmount)) throw new Error("balance too low")
          const erc20 = new ethers.utils.Interface(ERC_20_ABI)

          const approvalData = erc20.encodeFunctionData("approve", [approval.to, approval.approvalAmount])

          batchAddresses.push(approval.tokenAddress)
          batchData.push(approvalData)
        }

        const txData = txDetails.transactionData;

        if(txData.data) {
          batchAddresses.push(txData.to);
          batchData.push(txData.data);
        } else {
          // eth transfer

          const tx = await aaAccount.transfer(txData.to, txData.amount)
          await tx.wait()

          setSuccess(true)
          setLoading(false)

          return
        }

        console.log(batchAddresses, batchData)

        const tx = await aaAccount.execBatch(batchAddresses, batchData, {
          gasLimit: 3000000,
          gasPrice: await signer.provider?.getGasPrice()
        })

        await tx.wait()
      } else {
        if(txDetails.approvalTransaction) {
          const approval = txDetails.approvalTransaction;
          const contract = new ethers.Contract(
            approval.tokenAddress,
            ERC_20_ABI,
            signer
          );
          const _tx = await contract.approve(approval.to, approval.approvalAmount)
          await _tx.wait()
        }
  
        const tx = await signer.sendTransaction(txDetails.transactionData)
        await tx.wait()
        console.log(tx)
  
        if(request) {
          await updatePaymentRequest({
            payer: idData?.id as string,
            id: Number(request.id),
            fromChain:
              fetcchChains[reviewDetails.selectedToken.chain.toString()],
            fromToken:
              reviewDetails.selectedToken.tokenAddress
                .toString()
                .toLowerCase() === "0x0000000000000000000000000000000000001010"
                ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                : reviewDetails.selectedToken.tokenAddress.toString(),
            transactionHash: tx.hash,
          });
        }
      }


      setSuccess(true)
      setIsLoading(false);
    } catch (e: any) {
      console.log(e.message);
      setIsLoading(false)
      if(e.message.startsWith("Signer") || e.message.startsWith("balance")) setErrorMessage(e.message)
      if(e.message.startsWith("from")) setErrorMessage("From address and signer's address different");
      else setErrorMessage("Transaction couldn't be executed")

      setError(true)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="xs:p-5 fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-700/60 p-4 text-center backdrop-blur"
        >
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            ref={modalContainerRef}
            className="inline-block text-left align-middle"
          >
            <div className="xs:w-[440px] container w-full min-w-[400px] rounded-lg bg-white text-sm">
              {loading ? (
                <LoadingScreen isLoading={loading} setIsLoading={setLoading} />
              ) : (
                <>
                  {/* send data */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex w-full items-center justify-between py-3">
                      <h2 className="text-base font-semibold text-black">
                        Review Send
                      </h2>
                      <button onClick={() => setIsOpen(false)}>
                        <Cross />
                      </button>
                    </div>
                    {/* amount */}
                    <span className="text-center text-2xl font-bold">
                      {reviewDetails.amount}{" "}
                      {reviewDetails.selectedToken.tokenTicker}
                    </span>
                    {/* details */}
                    <div className="my-4 flex w-full flex-col space-y-2 rounded-xl border border-card p-2">
                      {/* from */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">From</h3>
                        <span className="font-semibold">{idData?.id}</span>
                      </div>
                      {/* to details */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">To</h3>
                        <span className="font-semibold">
                          {reviewDetails.payerId}
                        </span>
                      </div>
                      {/* Network Details */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">
                          Network
                        </h3>
                        <span className="font-semibold">
                          {
                            chainsList.find(
                              (i) =>
                                i.chainId.toString() ===
                                reviewDetails.selectedToken.chain.toString()
                            )?.name
                          }
                        </span>
                      </div>
                      {/* Network Fee */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">
                          Netwrok Fee
                        </h3>
                        <span className="font-semibold">
                          {txDetails && txDetails.bridgeDetails && (
                            <p>${txDetails?.bridgeDetails?.gasFeesUsd}</p>
                          )}
                          {txDetails &&
                            !txDetails.bridgeDetails &&
                            txDetails.transactionData &&
                            txDetails.transactionData.gasLimit &&
                            ethPrice && (
                              <p>
                                $
                                {(
                                  BigNumber.from(
                                    txDetails?.transactionData.gasLimit
                                  ).toNumber() *
                                  Number(ethPrice) *
                                  0.000000001
                                ).toFixed(6)}
                              </p>
                            )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">
                          Need Approval
                        </h3>
                        <span className="font-semibold">
                          {txDetails.approvalTransaction ? "Yes" : "No"}
                        </span>
                      </div>
                      {/* Bridge Used */}
                      {txDetails?.bridgeDetails && (
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-neutral-500">
                            Bridge Used
                          </h3>
                          <span className="font-semibold">
                            {txDetails?.bridgeDetails?.name
                              .charAt(0)
                              .toUpperCase() +
                              txDetails?.bridgeDetails?.name.slice(1)}
                          </span>
                        </div>
                      )}
                      {/* Speed */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">
                          Speed
                        </h3>
                        <span className="font-semibold">Normal</span>
                      </div>
                    </div>
                    {/* send Button */}
                    <button
                      type="button"
                      className="mb-4 w-full rounded-xl bg-black py-3 text-sm text-white"
                      onClick={() => doTransaction()}
                    >
                      Send
                    </button>
                  </div>
                  {/* send data end */}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendModal;
