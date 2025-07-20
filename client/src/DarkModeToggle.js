import React from 'react';

function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 text-3xl rounded-full p-3 transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 bg-transparent shadow-none"
      onClick={() => setDarkMode(dm => !dm)}
      aria-label="Toggle dark mode"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default DarkModeToggle; 