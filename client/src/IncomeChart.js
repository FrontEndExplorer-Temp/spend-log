import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function IncomeChart({ incomes }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const categories = {};
    incomes.forEach(e => {
      const cat = e.category || 'Others';
      categories[cat] = (categories[cat] || 0) + Number(e.amount);
    });
    const chart = new Chart(canvasRef.current, {
      type: 'pie',
      data: {
        labels: Object.keys(categories),
        datasets: [{
          data: Object.values(categories),
          backgroundColor: [
            '#22c55e', '#3b82f6', '#facc15', '#ef4444', '#6b7280', '#06b6d4', '#f97316'
          ],
        }],
      },
      options: {
        plugins: {
          legend: { position: 'bottom', labels: { color: '#374151' } }
        },
        maintainAspectRatio: false,
        responsive: true,
      }
    });
    return () => chart.destroy();
  }, [incomes]);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Income by Category (Pie)</h2>
      <div className="w-full max-w-xs h-64 mx-auto">
        <canvas ref={canvasRef} className="w-full h-full bg-white dark:bg-gray-900 rounded" />
      </div>
    </div>
  );
}

export default IncomeChart; 