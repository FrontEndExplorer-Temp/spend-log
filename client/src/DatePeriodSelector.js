import React from 'react';

function getMonthOptions() {
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
}

function getYearOptions(expenses, incomes) {
  const years = new Set();
  [...expenses, ...incomes].forEach(e => {
    const d = new Date(e.date);
    years.add(d.getFullYear());
  });
  const arr = Array.from(years).sort((a, b) => b - a);
  const thisYear = new Date().getFullYear();
  if (!arr.includes(thisYear)) arr.unshift(thisYear);
  return arr;
}

function DatePeriodSelector({ type, month, year, startDate, endDate, onChange, expenses, incomes }) {
  const months = getMonthOptions();
  const years = getYearOptions(expenses, incomes);
  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Period:</label>
      <select
        className="border rounded px-2 py-1 dark:bg-gray-900 dark:text-white"
        value={type}
        onChange={e => onChange({ type: e.target.value, month, year, startDate, endDate })}
      >
        <option value="month">Month/Year</option>
        <option value="custom">Custom Range</option>
      </select>
      {type === 'month' && <>
        <select
          className="border rounded px-2 py-1 dark:bg-gray-900 dark:text-white"
          value={month}
          onChange={e => onChange({ type, month: Number(e.target.value), year, startDate, endDate })}
        >
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1 dark:bg-gray-900 dark:text-white"
          value={year}
          onChange={e => onChange({ type, month, year: Number(e.target.value), startDate, endDate })}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </>}
      {type === 'custom' && <>
        <input
          type="date"
          className="border rounded px-2 py-1 dark:bg-gray-900 dark:text-white"
          value={startDate}
          onChange={e => onChange({ type, month, year, startDate: e.target.value, endDate })}
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          className="border rounded px-2 py-1 dark:bg-gray-900 dark:text-white"
          value={endDate}
          onChange={e => onChange({ type, month, year, startDate, endDate: e.target.value })}
        />
      </>}
    </div>
  );
}

export default DatePeriodSelector; 