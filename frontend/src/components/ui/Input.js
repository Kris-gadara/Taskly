import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export const Input = forwardRef(({ error, label, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <motion.div
        initial={false}
        animate={error ? { x: [-10, 10] } : { x: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <input
          ref={ref}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm
            text-gray-900 dark:text-white
            bg-white dark:bg-gray-800
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            }
          `}
          {...props}
        />
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-500"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
});