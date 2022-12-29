import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import { ChevDown } from '../icons/ChevDown';
import { ChevUp } from '../icons/ChevUp';

const WalletList = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  const [isExpand, setIsExpand] = useState(false);
  return (
    <li className=" mb-3 w-full list-none">
      <div className="relative w-full rounded-xl bg-white px-2 py-3">
        <div className="flex items-center justify-between">
          {/* left side */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-b from-yellow-500 to-orange-600" />
            <span className="ml-3 text-lg font-bold">{name}</span>
          </div>
          {/* right side */}
          <div className="flex items-center space-x-2">
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

export default WalletList;
