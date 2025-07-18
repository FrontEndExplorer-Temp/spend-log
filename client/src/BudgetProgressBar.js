import React from 'react';

function BudgetProgressBar({ expenses, budget }) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const percent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  let barColor = 'bg-green-500';
  if (percent > 90) barColor = 'bg-red-500';
  else if (percent > 70) barColor = 'bg-yellow-400';

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Budget Usage</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{percent.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className={`${barColor} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
        <span>Spent: ₹{total.toFixed(2)}</span>
        <span>Budget: ₹{budget.toFixed(2)}</span>
      </div>
      {budget > 0 && total > budget && (
        <div className="text-red-600 dark:text-red-400 text-center mt-2 font-semibold">You are over budget!</div>
      )}
    </div>
  );
}

export default BudgetProgressBar; 