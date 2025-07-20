import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;
    onAdd({ title, amount: parseFloat(amount), category, date });
    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
  };

  return (
    <>
      <Helmet>
        <title>Add Expense | Spend Log</title>
        <meta name="description" content="Add a new expense to your Spend Log account and track your spending." />
      </Helmet>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label htmlFor="expenseName" className="block text-sm font-medium mb-1 dark:text-gray-200">Expense Name</label>
          <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="expenseName" placeholder="e.g., Coffee, Taxi" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="expenseCategory" className="block text-sm font-medium mb-1 dark:text-gray-200">Expense Category</label>
          <select className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="expenseCategory" value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            <option>🍽️ Food</option>
            <option>✈️ Travel</option>
            <option>🛍️ Shopping</option>
            <option>📄 Bills</option>
            <option>📦 Others</option>
          </select>
        </div>
        <div>
          <label htmlFor="expenseAmount" className="block text-sm font-medium mb-1 dark:text-gray-200">Amount</label>
          <input type="number" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="expenseAmount" placeholder="₹" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="expenseDate" className="block text-sm font-medium mb-1 dark:text-gray-200">Date</label>
          <input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="expenseDate" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <motion.button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-700 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            aria-label="Add expense"
          >
            Add
          </motion.button>
        </div>
      </form>
    </>
  );
}

export default ExpenseForm; 