import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';

import { Cross } from '../icons/cross';
import { Loading } from '../icons/loading';

interface ISendModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SendModal = ({ isOpen, setIsOpen }: ISendModalProps) => {
  const [loading, setLoading] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setIsOpen(false);
  });
  useLockBodyScroll(isOpen);

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
                <div className="flex h-44 flex-col items-center justify-center">
                  <Loading className="mb-4 h-20 w-20 animate-spin" />
                  <h3>Processing Transaction</h3>
                </div>
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
                      0.5 USDC
                    </span>
                    {/* details */}
                    <div className="my-4 flex w-full flex-col space-y-2 rounded-xl border border-card p-2">
                      {/* from */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">From</h3>
                        <span className="font-semibold">mandar@backpack</span>
                      </div>
                      {/* to details */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">To</h3>
                        <span className="font-semibold">rohan@fetcch</span>
                      </div>
                      {/* Network Details */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">
                          Network
                        </h3>
                        <span className="font-semibold">Ethereum</span>
                      </div>
                      {/* Network Fee */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">
                          Netwrok Fee
                        </h3>
                        <span className="font-semibold">0.089753 ETH</span>
                      </div>
                      {/* Bridge Used */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-500">
                          Bridge Used
                        </h3>
                        <span className="font-semibold">
                          mandar@Bridge Name
                        </span>
                      </div>
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
                      onClick={() => setLoading(true)}
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
