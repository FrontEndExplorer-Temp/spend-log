import React from 'react';
import { motion } from 'framer-motion';

function IncomeList({ incomes, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Income List</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {incomes.length === 0 && <li className="py-4 text-gray-500 dark:text-gray-400">No income found.</li>}
        {incomes.map((income, idx) => (
          <motion.li
            key={income._id || income.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-4 flex justify-between items-center"
          >
            <div>
              <span className="font-semibold dark:text-white">{income.title}</span> <span className="text-gray-400 dark:text-gray-300">({income.category})</span><br />
              <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(income.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 dark:text-green-400 font-bold mr-4">₹{income.amount}</span>
              <button className="bg-red-500 dark:bg-red-700 text-white rounded px-3 py-1 text-sm hover:bg-red-600 dark:hover:bg-red-800 transition" onClick={() => onDelete(income._id || income.id)}>Delete</button>
            </div>
          </motion.li>
        ))}
      </ul>
      <div className="mt-6 text-right">
        <span className="text-lg font-semibold dark:text-gray-200">Total: <span className="text-green-600 dark:text-green-400">₹{incomes.reduce((sum, e) => sum + Number(e.amount), 0)}</span></span>
      </div>
    </div>
  );
}

export default IncomeList; 