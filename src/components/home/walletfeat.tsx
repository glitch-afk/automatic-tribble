interface Props {
  walletName: string;
  balance: number;
  btnLable: string;
  onClick: any;
}

const Wallet = ({ walletName, balance, btnLable }: Props) => {
  return (
    <div className="h-[140px] w-[165px] shrink-0 rounded-lg  bg-white  p-3 shadow-sm  ">
      <h1 className="text-lg font-medium text-[#62769A]">{walletName}</h1>
      <p className="my-3 text-3xl font-extrabold">${balance}</p>
      <button className="rounded-full border border-gray-600  px-1 text-xs text-gray-700 transition duration-200 ease-out active:scale-95">
        {btnLable}
      </button>
    </div>
  );
};

const WalletsHome = () => {
  return (
    <div className="my-8 flex space-x-4 overflow-hidden ">
      <Wallet
        walletName="Main Wallet"
        balance={234}
        onClick={null}
        btnLable="Sned funds to AA"
      />
      <Wallet
        walletName="AA Wallet"
        balance={234}
        onClick={null}
        btnLable="Sned funds to Main "
      />
    </div>
  );
};

export default WalletsHome;
