import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ user, darkMode, setDarkMode, logout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const hideTabs = location.pathname === '/profile' || location.pathname === '/admin';
  return (
    <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:gap-0">
        {/* Left: Title and Slogan stacked bottom left */}
        <div className="flex flex-col items-start justify-end flex-1">
          <span
            className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-[Montserrat] tracking-tight cursor-pointer select-none hover:underline"
            onClick={() => navigate('/')}
            title="Go to Home"
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/'); }}
          >
            Spend Log
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-300 font-medium font-[Lora] italic mt-1">Track every penny, grow your savings.</span>
        </div>
        {/* Right: Buttons */}
        <div className="flex gap-3 items-center mt-4 md:mt-0">
          {/* Home */}
          <button
            className="bg-cyan-500 dark:bg-cyan-700 text-white rounded px-3 py-2 font-semibold hover:bg-cyan-600 dark:hover:bg-cyan-800 transition"
            onClick={() => navigate('/')}
          >
            Home
          </button>
          {/* Profile */}
          <button
            className="bg-purple-500 dark:bg-purple-700 text-white rounded px-3 py-2 font-semibold hover:bg-purple-600 dark:hover:bg-purple-800 transition"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
          {/* Admin (only if user is admin) */}
          {user?.isAdmin && (
            <button className="bg-yellow-500 dark:bg-yellow-700 text-white rounded px-3 py-2 font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-800 transition" onClick={() => navigate('/admin')}>Admin</button>
          )}
          {/* Logout */}
          <button
            className="bg-red-500 dark:bg-red-700 text-white rounded px-3 py-2 font-semibold hover:bg-red-600 dark:hover:bg-red-800 transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
      {!hideTabs && (
        <div className="flex gap-2 mt-4 max-w-4xl mx-auto px-4">
          <button
            className={`flex-1 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${window.location.pathname === '/' || window.location.pathname === '/dashboard' ? 'bg-blue-500 text-white dark:bg-blue-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => navigate('/')}
          >
            Expenses
          </button>
          <button
            className={`flex-1 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${window.location.pathname === '/income' ? 'bg-green-500 text-white dark:bg-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => navigate('/income')}
          >
            Income
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar; 