import Link from "next/link";
import { ReactElement, useEffect } from "react";
import { useState } from "react";

import { LeftIcon } from "@/components/icons/leftIcon";
import SelectToken from "@/components/token-select";
import SendModal from "@/components/ui/sendModal";
import { ActionLayout } from "@/layouts/Action";
import { Meta } from "@/lib/Meta";
import { useAppContext } from "@/lib/store";
import type { Address, NextPageWithLayout } from "@/types";
import { ethers } from "ethers";
import { useLockBodyScroll } from "@/lib/hooks/use-lock-body-scroll";
import LoadingScreen from "@/components/loading";
import { useRouter } from "next/router";
import ErrorScreen from "@/components/error";
import SucessScreen from "@/components/success";
import SelectAddress from "@/components/address-select";

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

const SendPersonalPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Transaction not executed");
  useLockBodyScroll(loading);

  const [lockInput, setLockInput] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { balances } = useAppContext();
  const [tokens, _setTokens] = useState(
    balances != null ? Object.values(balances).flat() : []
  );

  const { idData } = useAppContext();
  
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(idData ? {address: idData?.default.address as string, type: "injected"} as Address : undefined);
  const [isValid, setIsValid] = useState(true);

  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");
  const [txRequest, setTxRequest] = useState();

  const [transactionDetails, setTransactionDetails] = useState<any>();

  const { query } = useRouter();

  useEffect(() => {
    if (query) {
      try {
        setLockInput(true);
        const request = JSON.parse(query.request as string);

        setTxRequest(request);
        setPayerId(request.to);
      } catch (e) {
        setLockInput(false);
      }
    }
  }, []);

  useEffect(() => {
    console.log(
      amount,
      selectedToken?.balance,
      Number(amount) > Number(selectedToken?.balance)
    );
    if (!amount || Number(amount) > Number(selectedToken?.balance) || !payerId)
      setIsValid(false);
    else setIsValid(true);
  }, [amount, payerId]);

  const sendDetails = async () => {
    // TODO
    
    setLoading(true);

    try {
      const token = (selectedToken?.tokenAddress.toString() as string) ===
      "0x0000000000000000000000000000000000001010"
        ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        : (selectedToken?.tokenAddress.toString() as string);

      let nativeToken = false

      if (token.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") nativeToken = true

      if(nativeToken) {
        const tx = {
          from: selectedAddress?.address,
          to: payerId,
          value: ethers.utils.parseEther(amount),
        }
        setTransactionDetails({
          userConfig: {
            fromAddress: selectedAddress?.address,
            fromChain: {
              chainId: selectedToken?.chain,
            },
          },
          transactionData: tx,
        });
      } else {
        const erc20 = new ethers.utils.Interface(ERC_20_ABI)

        const data = erc20.encodeFunctionData("transfer", [
          payerId,
          ethers.utils.parseUnits(amount, selectedToken?.tokenDecimal),
        ]);
        setTransactionDetails({
          userConfig: {
            fromAddress: selectedAddress?.address,
            fromChain: {
              chainId: selectedToken?.chain
            }
          },
          transactionData: {
            from: selectedAddress?.address,
            to: token,
            value: 0,
            data: data,
          },
        });
      }


      setShowModal(true);
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div>
      <header className="flex w-full items-center">
        {/* back button */}
        <Link href="/home" className="z-20">
          <LeftIcon className="z-10 h-6 w-6" />
        </Link>
        <Link href="/home"></Link>
        <h2 className="-ml-6 w-full text-center text-xl font-semibold">Send</h2>
      </header>
      {/* send to */}
      <div className="mt-12 flex flex-col space-y-4">
        <div className="flex flex-col">
          <label htmlFor="wallet_id" className="mb-1">
            Send to
          </label>
          <input
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            type="email"
            name="wallet_id"
            id="wallet_id"
            placeholder="rohan@fetcch"
            pattern="[-+]?[0-9]*[.,]?[0-9]+"
            className="mb-3 rounded-md border-none px-2 py-3 outline-none ring-0 placeholder:text-neutral-300 focus:outline-neutral-300 focus:ring-0"
            disabled={lockInput}
          />
        </div>
        {idData?.default && (
          <SelectAddress
            addresses={[
              { address: idData.default.address } as Address,
              idData?.secondary.map((i) => ({ address: i.address } as Address)),
            ].flat()}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            lockInput={false}
          />
        )}
        {/* select token */}
        <SelectToken
          tokens={tokens}
          setSelectedToken={setSelectedToken}
          selectedToken={selectedToken}
          lockInput={false}
        />
        {/* amount */}
        <div className="mb-4 mt-8 flex flex-col">
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="amount">Amount</label>
            <span
              onClick={() =>
                setAmount(selectedToken?.balance.toString() as string)
              }
              className="cursor-pointer text-xs text-neutral-500"
            >
              Max ${selectedToken?.balance ?? "0.00"}
            </span>
          </div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            name="amount"
            id="amount"
            placeholder="0.00"
            className="mb-3 rounded-md border-none px-2 py-3 outline-none ring-0 placeholder:text-neutral-300 focus:outline-neutral-300 focus:ring-0"
          />
        </div>
        {/* send button */}
        {isValid && (
          <button
            type="button"
            className="w-full rounded-xl bg-black py-3 text-sm text-white"
            onClick={() => sendDetails()}
          >
            Continue
          </button>
        )}

        {!isValid && (
          <button
            type="button"
            className="w-full rounded-xl bg-red-400 py-3 text-sm text-black"
          >
            Invalid Details
          </button>
        )}
      </div>

      {/* modal */}
      {showModal && (
        <SendModal
          reviewDetails={{
            payerId: payerId.substring(0, 20),
            amount,
            selectedToken,
          }}
          txDetails={transactionDetails}
          isOpen={showModal}
          setIsOpen={setShowModal}
          isLoading={loading}
          setIsLoading={setLoading}
          error={error}
          setError={setError}
          setErrorMessage={setErrorMessage}
          setSuccess={setSuccess}
          request={txRequest}
          account={selectedAddress?.address as string}
        />
      )}
      {loading && (
        <LoadingScreen isLoading={loading} setIsLoading={setLoading} />
      )}
      {error && (
        <ErrorScreen
          message={errorMessage}
          isLoading={error}
          setIsLoading={setError}
        />
      )}
      {success && (
        <SucessScreen
          message={"Successful transaction"}
          isLoading={success}
          setIsLoading={setSuccess}
        />
      )}
    </div>
  );
};

SendPersonalPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ActionLayout
      meta={<Meta title="Fetcch Wallet" description="Send Tokens" />}
    >
      {page}
    </ActionLayout>
  );
};

export default SendPersonalPage;
