import { Listbox, Transition } from '@headlessui/react';

import { ChevDown } from './icons/ChevDown';
import { ethers } from 'ethers';
import { Balance } from '@/hooks/useBalances';


const SelectToken = ({
  selectedToken,
  tokens,
  setSelectedToken,
}: {
  selectedToken: Balance | undefined;
  tokens: Balance[];
  setSelectedToken: any;
}) => {
  return (
    <div className="mb-8">
      <label htmlFor="token" className="mb-2 text-sm">
        Select Token
      </label>
      <div className="relative">
        <Listbox value={selectedToken} onChange={setSelectedToken}>
          <Listbox.Button className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-4 text-sm font-medium text-gray-900 outline-none duration-200 focus:outline-neutral-400 sm:h-12 sm:px-5">
            <div className="flex items-center">
              <img src={selectedToken?.tokenLogo} alt="" className="w-5 h-5" />
              {/* <span className="mr-2">{selectedToken?.tokenLogo}</span> */}
              <p className="ml-2">{selectedToken?.tokenTicker}</p>
            </div>
            <ChevDown className="h-3 w-3" />
          </Listbox.Button>
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="xs:p-2 absolute left-0 z-10 mt-1 grid w-full gap-0.5 rounded-xl border border-gray-200 bg-white p-1 outline-none">
              {tokens.map((token) => (
                <Listbox.Option key={"randomUUID()"} value={token}>
                  {({ selected }) => (
                    <div
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm
                    transition  ${
                      selected
                        ? "bg-gray-200/70 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                    >
                      <div
                        className={`flex cursor-pointer items-center rounded-md  text-sm text-gray-900`}
                      >
                        <img
                          src={token?.tokenLogo}
                          alt=""
                          className="w-5 h-5"
                        />
                        <p className="ml-2">{token.tokenName}</p>
                        <span className="ml-1 text-xs text-neutral-400">
                          on ethereum
                        </span>
                      </div>
                      <span className="text-xs font-semibold">
                        {ethers.utils.formatUnits(
                          token.balance.toString(),
                          token.tokenDecimal
                        )}
                      </span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    </div>
  );
};

export default SelectToken;
