import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function groupByMonth(data) {
  const result = {};
  data.forEach(e => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    result[key] = (result[key] || 0) + Number(e.amount);
  });
  return result;
}

function groupByYear(data) {
  const result = {};
  data.forEach(e => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}`;
    result[key] = (result[key] || 0) + Number(e.amount);
  });
  return result;
}

function SummaryTrendsChart({ expenses, incomes }) {
  const [view, setView] = useState('monthly');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let expenseData, incomeData, labels;
    if (view === 'monthly') {
      const exp = groupByMonth(expenses);
      const inc = groupByMonth(incomes);
      labels = Array.from(new Set([...Object.keys(exp), ...Object.keys(inc)])).sort();
      expenseData = labels.map(l => exp[l] || 0);
      incomeData = labels.map(l => inc[l] || 0);
    } else {
      const exp = groupByYear(expenses);
      const inc = groupByYear(incomes);
      labels = Array.from(new Set([...Object.keys(exp), ...Object.keys(inc)])).sort();
      expenseData = labels.map(l => exp[l] || 0);
      incomeData = labels.map(l => inc[l] || 0);
    }
    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Expenses',
            data: expenseData,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.2)',
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Income',
            data: incomeData,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: 'top', labels: { color: '#374151' } },
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: { ticks: { color: '#374151' }, grid: { color: '#e5e7eb' } },
          y: { beginAtZero: true, ticks: { color: '#374151' }, grid: { color: '#e5e7eb' } },
        },
      },
    });
    return () => chart.destroy();
  }, [expenses, incomes, view]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-gray-200">Summary Trends</h2>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${view === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setView('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-3 py-1 rounded ${view === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setView('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="w-full h-72">
        <canvas ref={canvasRef} className="w-full h-full bg-white dark:bg-gray-900 rounded" />
      </div>
    </div>
  );
}

export default SummaryTrendsChart; 