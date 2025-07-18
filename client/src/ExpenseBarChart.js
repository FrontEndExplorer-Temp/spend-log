import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ExpenseBarChart({ expenses }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const categories = {};
    expenses.forEach(e => {
      const cat = e.category || 'Others';
      categories[cat] = (categories[cat] || 0) + Number(e.amount);
    });
    const chart = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: Object.keys(categories),
        datasets: [{
          label: 'Expenses by Category',
          data: Object.values(categories),
          backgroundColor: [
            '#3b82f6', '#22c55e', '#facc15', '#ef4444', '#6b7280', '#06b6d4', '#f97316'
          ],
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            ticks: { color: '#374151' },
            grid: { color: '#e5e7eb' },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#374151' },
            grid: { color: '#e5e7eb' },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [expenses]);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Expenses by Category (Bar)</h2>
      <div className="w-full max-w-xs h-64 mx-auto">
        <canvas ref={canvasRef} className="w-full h-full bg-white dark:bg-gray-900 rounded" />
      </div>
    </div>
  );
}

export default ExpenseBarChart; 