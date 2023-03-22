import { Listbox, Transition } from "@headlessui/react";

import { ChevDown } from "./icons/ChevDown";
import { Address } from "@/types";

const SelectAddress = ({
  selectedAddress,
  addresses,
  setSelectedAddress,
  lockInput,
}: {
  selectedAddress: Address | undefined;
  addresses: Address[];
  setSelectedAddress: any;
  lockInput: boolean;
}) => {
  return (
    <div className="mb-8">
      <label htmlFor="token" className="mb-2 text-sm">
        Select Address
      </label>
      <div className="relative">
        <Listbox
          value={selectedAddress}
          onChange={setSelectedAddress}
          disabled={lockInput}
        >
          <Listbox.Button className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-4 text-sm font-medium text-gray-900 outline-none duration-200 focus:outline-neutral-400 sm:h-12 sm:px-5">
            <div className="flex items-center">
              {selectedAddress?.address && (
                <>
                  <p className="ml-2 truncate w-[30ch]">
                    {selectedAddress?.address ? (
                      selectedAddress?.address
                    ) : (
                      <span className="text-sm text-neutral-300">
                        No tokens available
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>
            {addresses.length > 0 && <ChevDown className="h-3 w-3" />}
          </Listbox.Button>
          {addresses.length > 0 && (
            <Transition
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="xs:p-2 absolute left-0 z-10 mt-1 grid w-full gap-0.5 rounded-xl border border-gray-200 bg-white p-1 outline-none">
                {addresses.map((token, index) => {
                  if(token.address.toLowerCase() === selectedAddress?.address.toLowerCase()) return <></>
                  
                  return (
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
                            <p className="ml-2 truncate w-[30ch]">
                              {token.address}
                            </p>
                          </div>
                        </div>
                      )}
                    </Listbox.Option>
                  )
                })}
              </Listbox.Options>
            </Transition>
          )}
        </Listbox>
      </div>
    </div>
  );
};

export default SelectAddress;
