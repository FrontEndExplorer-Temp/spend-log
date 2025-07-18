import React from 'react';

function Filters({ filters, onChange, onApply, onClear }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label htmlFor="filterCategory" className="block text-sm font-medium mb-1 dark:text-gray-200">Filter by Category</label>
          <select className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="filterCategory" value={filters.category} onChange={e => onChange({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterStartDate" className="block text-sm font-medium mb-1 dark:text-gray-200">Start Date</label>
          <input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="filterStartDate" value={filters.startDate} onChange={e => onChange({ ...filters, startDate: e.target.value })} />
        </div>
        <div>
          <label htmlFor="filterEndDate" className="block text-sm font-medium mb-1 dark:text-gray-200">End Date</label>
          <input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="filterEndDate" value={filters.endDate} onChange={e => onChange({ ...filters, endDate: e.target.value })} />
        </div>
        <div>
          <button className="w-full bg-blue-500 dark:bg-blue-700 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition" onClick={onApply}>Apply</button>
        </div>
        <div>
          <button className="w-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition" onClick={onClear}>Clear Filters</button>
        </div>
      </div>
    </div>
  );
}

export default Filters; 