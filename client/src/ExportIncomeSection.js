import React from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';

const removeEmojis = str => str.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

function ExportIncomeSection({ incomes }) {
  const handleExportCSV = () => {
    const csv = Papa.unparse(incomes.map(e => ({
      Name: e.title,
      Category: e.category,
      Amount: e.amount,
      Date: new Date(e.date).toLocaleDateString()
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'income.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Income Report', 10, 10);
    let y = 20;
    incomes.forEach((e, i) => {
      const cleanCategory = removeEmojis(e.category || '');
      doc.text(
        `${i + 1}. ${e.title} | ${cleanCategory} | Rs.${e.amount} | ${new Date(e.date).toLocaleDateString()}`,
        10,
        y
      );
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save('income.pdf');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Export Income</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-gray-700 dark:bg-gray-900 text-white rounded px-4 py-2 font-semibold hover:bg-gray-900 dark:hover:bg-gray-700 transition" onClick={handleExportCSV}>Export to CSV</button>
        <button className="bg-blue-500 dark:bg-blue-700 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition" onClick={handleExportPDF}>Export to PDF</button>
      </div>
    </div>
  );
}

export default ExportIncomeSection; 