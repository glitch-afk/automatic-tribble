import { useAppContext } from "@/lib/store";
import Link from "next/link";
import { Check } from "../icons/check";

interface Props {
  walletName: string;
  balance: number;
  btnLable: string;
  onClick: any;
  address: string;
  selected: boolean;
}

const Wallet = ({ walletName, address, onClick, balance, btnLable, selected }: Props) => {
  return (
    <div onClick={onClick} className="cursor-pointer relative h-[140px] w-[165px] shrink-0 rounded-lg  bg-white  p-3 shadow-sm">
      {selected && (
        <Check className="text-green-500 border-2 border-green-500 rounded-full w-5 h-5 p-[2px] absolute top-2 right-2" />
      )}
      <h1 className="text-lg font-medium text-[#62769A]">{walletName}</h1>
      <p className="text-xs font-normal w-[20ch] truncate">{address}</p>
      <p className="my-3 text-xl font-extrabold">${balance}</p>
      <Link
        href={`/send/personal?request=${JSON.stringify({ to: address })}`}
        className="cursor-pointer rounded-full border border-gray-600  px-1 text-[10px] text-gray-700 transition duration-200 ease-out active:scale-95"
      >
        {btnLable}
      </Link>
    </div>
  );
};

const WalletsHome = () => {
  const { idData, balances, selectedAddress, setSelectedAddress, addresses } = useAppContext()
  
  return (
    <div className="mt-8 flex space-x-4 overflow-scroll ">
      <Wallet
        walletName="Main Wallet"
        address={idData?.default?.address as string}
        balance={Object.values(balances)
          .map((i) =>
            i
              .filter(
                (x) =>
                  x.address.toLowerCase() ===
                    idData?.default.address.toLowerCase() &&
                  x.chain === idData.default.chain.id
              )
              .map((x) => Number(x.balanceUsd))
          )
          .flat()
          .reduce((partialSum, a) => partialSum + a, 0)}
        onClick={() => setSelectedAddress(addresses.find(x => x.address.toLowerCase() === idData?.default.address.toLowerCase()) ?? { address: idData?.default.address, type: 'injected', fetcchType: 'secondary', chain: idData?.default.chain.id })}
        btnLable="Send funds to Main Wallet"
        selected={
          selectedAddress?.address.toLowerCase() ===
          (idData?.default.address.toLowerCase() as string)
        }
      />
      {idData?.secondary.map((other) => (
        <Wallet
          walletName={other.isContract ? "AA Wallet" : "Other Wallet"}
          address={other.address}
          balance={Object.values(balances)
            .map((i) =>
              i
                .filter(
                  (x) =>
                    x.address.toLowerCase() === other.address.toLowerCase() &&
                    other.chain == x.chain
                )
                .map((x) => Number(x.balanceUsd))
            )
            .flat()
            .reduce((partialSum, a) => partialSum + a, 0)}
          onClick={() => setSelectedAddress(addresses.find(x => x.address.toLowerCase() === other.address.toLowerCase()) ?? { address: other.address, type: 'injected', fetcchType: 'secondary', chain: other.chain.id })}
          btnLable={`Send funds to ${
            other.isContract ? "AA Wallet" : "Other Wallet"
          }`}
          selected={
            selectedAddress?.address.toLowerCase() ===
            (other.address.toLowerCase() as string)
          }
        />
      ))}
    </div>
  );
};

export default WalletsHome;
