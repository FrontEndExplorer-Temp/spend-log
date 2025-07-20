import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfileOrAdmin = location.pathname === '/profile' || location.pathname === '/admin';

  return (
    <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10 transition-colors duration-300">
      <a href="#main-content" className="sr-only focus:not-sr-only absolute left-2 top-2 bg-blue-600 text-white px-3 py-1 rounded z-50">Skip to main content</a>
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Slogan */}
        <div 
          className="flex flex-col cursor-pointer transition-colors duration-200"
          onClick={() => navigate('/')}
        >
          <h1 
            className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200" 
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Spend Log
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-300" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Track every penny, grow your savings.
          </span>
        </div>

        {/* Navigation Buttons */}
        <nav role="navigation" aria-label="Main navigation" className="flex gap-2 items-center">
          <button
            className="bg-blue-500 dark:bg-blue-700 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition"
            onClick={() => navigate('/')}
          >
            Home
          </button>
          
          <button
            className="bg-purple-500 dark:bg-purple-700 text-white rounded px-3 py-2 font-semibold hover:bg-purple-600 dark:hover:bg-purple-800 transition"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
          
          {user?.isAdmin && (
            <button 
              className="bg-yellow-500 dark:bg-yellow-700 text-white rounded px-3 py-2 font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-800 transition" 
              onClick={() => navigate('/admin')}
            >
              Admin
            </button>
          )}
          
          <button
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => setDarkMode(dm => !dm)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          <button
            className="bg-red-500 dark:bg-red-700 text-white rounded px-3 py-2 font-semibold hover:bg-red-600 dark:hover:bg-red-800 transition"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Expenses/Income Tabs - Only show on main page */}
      {!isProfileOrAdmin && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 mt-4">
            <button
              className={`flex-1 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${activeTab === 'expenses' ? 'bg-blue-500 text-white dark:bg-blue-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setActiveTab('expenses')}
            >
              Expenses
            </button>
            <button
              className={`flex-1 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${activeTab === 'income' ? 'bg-green-500 text-white dark:bg-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setActiveTab('income')}
            >
              Income
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar; 