import React from 'react';

function getTopCategories(items, type = 'expense') {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const filtered = items.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const totals = {};
  filtered.forEach(e => {
    const cat = e.category || 'Others';
    totals[cat] = (totals[cat] || 0) + Number(e.amount);
  });
  const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  return sorted;
}

function TopCategories({ expenses, incomes }) {
  const topExpenses = getTopCategories(expenses, 'expense');
  const topIncomes = getTopCategories(incomes, 'income');
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-100 dark:bg-blue-900 rounded-xl shadow p-6 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">Top Expense Categories</h2>
        {topExpenses.length === 0 ? (
          <div className="text-gray-500">No expenses this month.</div>
        ) : (
          <ul className="w-full">
            {topExpenses.map(([cat, amt]) => (
              <li key={cat} className="flex justify-between py-1 text-blue-900 dark:text-blue-100">
                <span>{cat}</span>
                <span>₹{amt.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-green-100 dark:bg-green-900 rounded-xl shadow p-6 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">Top Income Categories</h2>
        {topIncomes.length === 0 ? (
          <div className="text-gray-500">No income this month.</div>
        ) : (
          <ul className="w-full">
            {topIncomes.map(([cat, amt]) => (
              <li key={cat} className="flex justify-between py-1 text-green-900 dark:text-green-100">
                <span>{cat}</span>
                <span>₹{amt.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TopCategories; 