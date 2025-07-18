import React from 'react';

function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" placeholder="Search by name, amount, or category" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export default SearchBar; 