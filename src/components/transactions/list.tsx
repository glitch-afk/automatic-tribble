import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import { Usdc } from '@/components/icons/coins/usdc';

import { ChevDown } from '../icons/ChevDown';
import { ChevUp } from '../icons/ChevUp';

const TransactionsList = ({ children }: { children: React.ReactNode }) => {
  const [isExpand, setIsExpand] = useState(false);
  return (
    <li className="mb-3">
      <div className="relative w-full rounded-xl bg-white px-2 py-3">
        <div className="flex items-center justify-between">
          {/* left side */}
          <div className="flex items-center">
            <Usdc />
            <span className="ml-1 text-sm font-semibold">USDC</span>
          </div>
          {/* right side */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold">$107.56</span>
            <div
              className="rounded-xl bg-card p-2"
              onClick={() => setIsExpand(!isExpand)}
            >
              {isExpand ? (
                <ChevUp className="h-4 w-4" />
              ) : (
                <ChevDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {isExpand && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="mt-3 border-t border-dashed border-gray-200 pt-3">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
};

export default TransactionsList;
