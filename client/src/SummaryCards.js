import React from 'react';

function SummaryCards({ income, expenses, budget, remaining }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-green-500 dark:bg-green-700 text-white dark:text-green-100 rounded-xl shadow p-6 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Total Income</h2>
        <h3 className="text-2xl font-bold">₹ {income}</h3>
      </div>
      <div className="bg-blue-500 dark:bg-blue-700 text-white dark:text-blue-100 rounded-xl shadow p-6 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
        <h3 className="text-2xl font-bold">₹ {expenses}</h3>
      </div>
      <div className="bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-yellow-100 rounded-xl shadow p-6 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Budget Limit</h2>
        <h3 className="text-2xl font-bold">₹ {budget}</h3>
      </div>
      <div className="bg-teal-600 dark:bg-indigo-800 text-white rounded-xl shadow p-6 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Net Balance</h2>
        <h3 className="text-2xl font-bold">₹ {income - expenses}</h3>
      </div>
    </div>
  );
}

export default SummaryCards; 