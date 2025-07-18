import React, { useState } from 'react';

function BudgetInput({ budget, onSave }) {
  const [value, setValue] = useState(budget || '');

  const handleSave = () => {
    if (!value) return;
    onSave(Number(value));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Set Your Monthly Budget</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white" value={value} onChange={e => setValue(e.target.value)} placeholder="Set Budget" />
        <button className="w-full bg-green-500 dark:bg-green-700 text-white rounded px-3 py-2 font-semibold hover:bg-green-600 dark:hover:bg-green-800 transition" onClick={handleSave}>Save Budget</button>
      </div>
    </div>
  );
}

export default BudgetInput; 