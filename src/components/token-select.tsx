import { Listbox, Transition } from '@headlessui/react';
import React, { useState } from 'react';

import { Bnb } from '@/components/icons/coins/bnb';
import { Usdc } from '@/components/icons/coins/usdc';

import { ChevDown } from './icons/ChevDown';

const tokensList = [
  {
    id: 1,
    name: 'USDC',
    value: 'usdc',
    icon: <Usdc />,
  },
  {
    id: 2,
    name: 'BNB',
    value: 'bnb',
    icon: <Bnb />,
  },
];

const SelectToken = () => {
  const [selectedToken, setSeletedToken] = useState(tokensList[0]);
  return (
    <div className="mb-8">
      <label htmlFor="token" className="mb-2 text-sm">
        Select Token
      </label>
      <div className="relative">
        <Listbox value={selectedToken} onChange={setSeletedToken}>
          <Listbox.Button className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-4 text-sm font-medium text-gray-900 outline-none duration-200 focus:outline-neutral-400 sm:h-12 sm:px-5">
            <div className="flex items-center">
              <span className="mr-2">{selectedToken?.icon}</span>
              {selectedToken?.name}
            </div>
            <ChevDown className="h-3 w-3" />
          </Listbox.Button>
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="xs:p-2 absolute left-0 z-10 mt-1 grid w-full gap-0.5 rounded-xl border border-gray-200 bg-white p-1 outline-none">
              {tokensList.map((token) => (
                <Listbox.Option key={token.id} value={token}>
                  {({ selected }) => (
                    <div
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm
                    transition  ${
                      selected
                        ? 'bg-gray-200/70 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                    >
                      <div
                        className={`flex cursor-pointer items-center rounded-md  text-sm text-gray-900`}
                      >
                        <span className="mr-2">{token.icon}</span>
                        {token.name}
                        <span className="ml-1 text-xs text-neutral-400">
                          on ethereum
                        </span>
                      </div>
                      <span className="text-xs font-semibold">35 USDC</span>
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
