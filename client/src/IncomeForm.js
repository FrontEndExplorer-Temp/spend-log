import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

function IncomeForm({ onAdd }) {
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
        <title>Add Income | Spend Log</title>
        <meta name="description" content="Add a new income entry to your Spend Log account and track your earnings." />
      </Helmet>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label htmlFor="incomeName" className="block text-sm font-medium mb-1 dark:text-gray-200">Income Name</label>
          <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white" id="incomeName" placeholder="e.g., Salary, Freelance" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="incomeCategory" className="block text-sm font-medium mb-1 dark:text-gray-200">Income Category</label>
          <select className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white" id="incomeCategory" value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            <option>💼 Salary</option>
            <option>🧑‍💻 Freelance</option>
            <option>🎁 Gift</option>
            <option>💸 Investment</option>
            <option>📦 Others</option>
          </select>
        </div>
        <div>
          <label htmlFor="incomeAmount" className="block text-sm font-medium mb-1 dark:text-gray-200">Amount</label>
          <input type="number" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white" id="incomeAmount" placeholder="₹" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="incomeDate" className="block text-sm font-medium mb-1 dark:text-gray-200">Date</label>
          <input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white" id="incomeDate" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <motion.button
            type="submit"
            className="w-full bg-green-500 dark:bg-green-700 text-white rounded px-3 py-2 font-semibold hover:bg-green-600 dark:hover:bg-green-800 transition"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            aria-label="Add income"
          >
            Add
          </motion.button>
        </div>
      </form>
    </>
  );
}

export default IncomeForm; 