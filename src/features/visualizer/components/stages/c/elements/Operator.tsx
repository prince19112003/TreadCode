import React from 'react';
import { motion } from 'motion/react';

interface OperatorProps {
  symbol: string;
  isSmall?: boolean;
}

export const Operator: React.FC<OperatorProps> = ({ symbol, isSmall }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center justify-center font-black ${isSmall ? 'text-xl' : 'text-2xl'} text-slate-400 select-none px-2`}
    >
      {symbol}
    </motion.div>
  );
};
