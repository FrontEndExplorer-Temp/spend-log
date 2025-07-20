import React from 'react';
import { motion } from 'framer-motion';

function ExpenseList({ expenses, onDelete, onEdit }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Expenses List</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {expenses.length === 0 && <li className="py-4 text-gray-500 dark:text-gray-400">No expenses found.</li>}
        {expenses.map((expense, idx) => (
          <motion.li
            key={expense._id || expense.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-4 flex justify-between items-center"
          >
            <div>
              <span className="font-semibold dark:text-white">{expense.title}</span> <span className="text-gray-400 dark:text-gray-300">({expense.category})</span><br />
              <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(expense.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-4">₹{expense.amount}</span>
              <button className="bg-red-500 dark:bg-red-700 text-white rounded px-3 py-1 text-sm hover:bg-red-600 dark:hover:bg-red-800 transition" onClick={() => onDelete(expense._id || expense.id)}>Delete</button>
              {/* <button className="bg-gray-300 text-gray-700 rounded px-3 py-1 text-sm" onClick={() => onEdit(expense)}>Edit</button> */}
            </div>
          </motion.li>
        ))}
      </ul>
      <div className="mt-6 text-right">
        <span className="text-lg font-semibold dark:text-gray-200">Total: <span className="text-blue-600 dark:text-blue-400">₹{expenses.reduce((sum, e) => sum + Number(e.amount), 0)}</span></span>
      </div>
    </div>
  );
}

export default ExpenseList; 