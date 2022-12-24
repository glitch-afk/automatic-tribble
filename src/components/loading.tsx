import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react';
import { useClickAway, useLockBodyScroll } from 'react-use';

import { Loading } from './icons/loading';

interface ILoadingScreenProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const LoadingScreen = ({ isLoading, setIsLoading }: ILoadingScreenProps) => {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setIsLoading(false);
  });
  useLockBodyScroll(isLoading);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="xs:p-5 fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-700/60 p-4 text-center backdrop-blur"
      >
        <span className="inline-block h-screen align-middle" aria-hidden="true">
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
          {/* add here */}
          <div className="flex h-44 flex-col items-center justify-center">
            <Loading className="mb-4 h-20 w-20 animate-spin" />
            <h3>Processing Transaction</h3>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
