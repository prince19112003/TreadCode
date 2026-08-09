import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FunctionStatementRowProps {
  code?: string;
  statementType?: 'print' | 'return' | 'variable' | 'compute' | 'condition' | 'other';
  isActive: boolean;
  hasExecuted: boolean;
  activeComponent?: React.ReactNode;
}

export const FunctionStatementRow: React.FC<FunctionStatementRowProps> = ({
  isActive,
  hasExecuted,
  activeComponent,
}) => {
  if (!activeComponent || (!hasExecuted && !isActive)) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key="active-component"
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="w-full flex justify-center"
        >
          {activeComponent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

