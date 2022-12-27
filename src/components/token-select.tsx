import { Listbox, Transition } from '@headlessui/react';
import type { Balance } from '@/lib/hooks/useBalances';

import { ChevDown } from './icons/ChevDown';
import { chainsList } from '@/lib/data/mockData';

const SelectToken = ({
  selectedToken,
  tokens,
  setSelectedToken,
  lockInput,
}: {
  selectedToken: Balance | undefined;
  tokens: Partial<Balance>[];
  setSelectedToken: any;
  lockInput: boolean;
}) => {
  return (
    <div className="mb-8">
      <label htmlFor="token" className="mb-2 text-sm">
        Select Token
      </label>
      <div className="relative">
        <Listbox
          value={selectedToken}
          onChange={setSelectedToken}
          disabled={lockInput}
        >
          <Listbox.Button className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-4 text-sm font-medium text-gray-900 outline-none duration-200 focus:outline-neutral-400 sm:h-12 sm:px-5">
            <div className="flex items-center">
              {selectedToken?.tokenLogo && (
                <>
                  {typeof selectedToken.tokenLogo === "string" ? (
                    <img
                      src={selectedToken?.tokenLogo}
                      alt=""
                      className="h-5 w-5"
                    />
                  ) : (
                    <selectedToken.tokenLogo className="h-5 w-5" />
                  )}
                  <p className="ml-2">
                    {selectedToken?.tokenTicker ? (
                      selectedToken?.tokenTicker
                    ) : (
                      <span className="text-sm text-neutral-300">
                        No tokens available
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>
            {tokens.length > 0 && <ChevDown className="h-3 w-3" />}
          </Listbox.Button>
          {tokens.length > 0 && (
            <Transition
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="xs:p-2 absolute left-0 z-10 mt-1 grid w-full gap-0.5 rounded-xl border border-gray-200 bg-white p-1 outline-none">
                {tokens.map((token, index) => (
                  <Listbox.Option key={index} value={token}>
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
                          {token?.tokenLogo && (
                            <>
                              {typeof token.tokenLogo === "string" ? (
                                <img
                                  src={token?.tokenLogo}
                                  alt=""
                                  className="h-5 w-5"
                                />
                              ) : (
                                <token.tokenLogo className="h-5 w-5" />
                              )}
                            </>
                          )}
                          <p className="ml-2">{token.tokenName}</p>
                          <span className="ml-1 text-xs text-neutral-400">
                            on{" "}
                            {chainsList.find((c) => c.id === token.chain)?.name}
                          </span>
                        </div>
                        <span className="text-xs font-semibold">
                          {token?.balance?.toString()}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          )}
        </Listbox>
      </div>
    </div>
  );
};

export default SelectToken;
