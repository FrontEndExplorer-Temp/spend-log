import React, { useState, useEffect } from 'react';
import SummaryCards from './SummaryCards';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import BudgetInput from './BudgetInput';
import Filters from './Filters';
import SearchBar from './SearchBar';
import ExpenseChart from './ExpenseChart';
import ExportSection from './ExportSection';
import ExpenseBarChart from './ExpenseBarChart';
import IncomeForm from './IncomeForm';
import IncomeList from './IncomeList';
import IncomeChart from './IncomeChart';
import IncomeBarChart from './IncomeBarChart';
import ExportIncomeSection from './ExportIncomeSection';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import { useAuth } from './AuthContext';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Profile from './Profile';
import SummaryTrendsChart from './SummaryTrendsChart';
import VerifyEmail from './VerifyEmail';
import TopCategories from './TopCategories';
import BudgetProgressBar from './BudgetProgressBar';
import DatePeriodSelector from './DatePeriodSelector';
import { useToast } from './ToastContext';
import AdminPanel from './AdminPanel';
import DarkModeToggle from './DarkModeToggle';
import Navbar from './Navbar';

function ResetPasswordWrapper() {
  const { token } = useParams();
  return <ResetPassword token={token} />;
}

function AppContent({ user, logout, darkMode, setDarkMode }) {
  const { token, fetchWithAuth } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? Number(saved) : 0;
  });
  const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '' });
  const [incomeFilters, setIncomeFilters] = useState({ category: '', startDate: '', endDate: '' });
  const [search, setSearch] = useState('');
  const [incomeSearch, setIncomeSearch] = useState('');
  const [activeTab, setActiveTab] = useState('expenses');
  const now = new Date();
  const [period, setPeriod] = useState({ type: 'month', month: now.getMonth(), year: now.getFullYear(), startDate: '', endDate: '' });
  const { showToast } = useToast();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Fetch expenses and income from backend (with JWT)
  useEffect(() => {
    if (!token) return;
    fetchWithAuth('/api/expenses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExpenses(data);
        } else {
          setExpenses([]);
        }
      })
      .catch(() => setExpenses([]));
    fetchWithAuth('/api/income')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIncomes(data);
        } else {
          setIncomes([]);
        }
      })
      .catch(() => setIncomes([]));
  }, [token, fetchWithAuth]);

  // Add expense
  const handleAddExpense = (expense) => {
    fetchWithAuth('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    })
      .then(res => res.json())
      .then(newExpense => {
        setExpenses(prev => [newExpense, ...prev]);
        showToast('Expense added!', 'success');
      })
      .catch(() => showToast('Failed to add expense', 'error'));
  };

  // Delete expense
  const handleDeleteExpense = (id) => {
    fetchWithAuth(`/api/expenses/${id}`, { method: 'DELETE' })
      .then(() => {
        setExpenses(prev => prev.filter(e => (e._id || e.id) !== id));
        showToast('Expense deleted!', 'success');
      })
      .catch(() => showToast('Failed to delete expense', 'error'));
  };

  // Add income
  const handleAddIncome = (income) => {
    fetchWithAuth('/api/income', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(income),
    })
      .then(res => res.json())
      .then(newIncome => {
        setIncomes(prev => [newIncome, ...prev]);
        showToast('Income added!', 'success');
      })
      .catch(() => showToast('Failed to add income', 'error'));
  };

  // Delete income
  const handleDeleteIncome = (id) => {
    fetchWithAuth(`/api/income/${id}`, { method: 'DELETE' })
      .then(() => {
        setIncomes(prev => prev.filter(e => (e._id || e.id) !== id));
        showToast('Income deleted!', 'success');
      })
      .catch(() => showToast('Failed to delete income', 'error'));
  };

  // Save budget
  const handleSaveBudget = (value) => {
    setBudget(value);
    localStorage.setItem('budget', value);
    showToast('Budget updated!', 'success');
  };

  // Filtering logic (for expenses)
  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = !filters.category || (exp.category && exp.category.includes(filters.category));
    const matchesSearch = !search ||
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      (exp.category && exp.category.toLowerCase().includes(search.toLowerCase())) ||
      String(exp.amount).includes(search);
    const matchesStart = !filters.startDate || new Date(exp.date) >= new Date(filters.startDate);
    const matchesEnd = !filters.endDate || new Date(exp.date) <= new Date(filters.endDate);
    return matchesCategory && matchesSearch && matchesStart && matchesEnd;
  });

  // Filtering logic (for incomes)
  const filteredIncomes = incomes.filter(inc => {
    const matchesCategory = !incomeFilters.category || (inc.category && inc.category.includes(incomeFilters.category));
    const matchesSearch = !incomeSearch ||
      inc.title.toLowerCase().includes(incomeSearch.toLowerCase()) ||
      (inc.category && inc.category.toLowerCase().includes(incomeSearch.toLowerCase())) ||
      String(inc.amount).includes(incomeSearch);
    const matchesStart = !incomeFilters.startDate || new Date(inc.date) >= new Date(incomeFilters.startDate);
    const matchesEnd = !incomeFilters.endDate || new Date(inc.date) <= new Date(incomeFilters.endDate);
    return matchesCategory && matchesSearch && matchesStart && matchesEnd;
  });

  // Filter by selected period or custom range
  let periodExpenses = expenses;
  let periodIncomes = incomes;
  if (period.type === 'month') {
    periodExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === period.month && d.getFullYear() === period.year;
    });
    periodIncomes = incomes.filter(inc => {
      const d = new Date(inc.date);
      return d.getMonth() === period.month && d.getFullYear() === period.year;
    });
  } else if (period.type === 'custom' && period.startDate && period.endDate) {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    periodExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d >= start && d <= end;
    });
    periodIncomes = incomes.filter(inc => {
      const d = new Date(inc.date);
      return d >= start && d <= end;
    });
  }

  // Filter apply/clear
  const handleApplyFilters = () => setFilters({ ...filters });
  const handleClearFilters = () => setFilters({ category: '', startDate: '', endDate: '' });
  const handleApplyIncomeFilters = () => setIncomeFilters({ ...incomeFilters });
  const handleClearIncomeFilters = () => setIncomeFilters({ category: '', startDate: '', endDate: '' });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
        {!showForgot ? (
          <>
            <div className="flex gap-4 mb-8">
              <button
                className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${showLogin ? 'bg-blue-500 text-white dark:bg-blue-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                onClick={() => { setShowLogin(true); setShowForgot(false); }}
              >
                Login
              </button>
              <button
                className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${!showLogin ? 'bg-green-500 text-white dark:bg-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                onClick={() => { setShowLogin(false); setShowForgot(false); }}
              >
                Register
              </button>
            </div>
            {showLogin ? <Login /> : <Register />}
            {showLogin && (
              <button className="mt-4 text-blue-600 dark:text-blue-400 underline" onClick={() => setShowForgot(true)}>
                Forgot password?
              </button>
            )}
          </>
        ) : (
          <ForgotPassword onSent={() => setShowForgot(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Navbar user={user} logout={logout} darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <DatePeriodSelector {...period} onChange={setPeriod} expenses={expenses} incomes={incomes} />
        <SummaryCards income={periodIncomes.reduce((sum, e) => sum + Number(e.amount), 0)} expenses={periodExpenses.reduce((sum, e) => sum + Number(e.amount), 0)} budget={budget} remaining={budget - periodExpenses.reduce((sum, e) => sum + Number(e.amount), 0)} />
        <TopCategories expenses={periodExpenses} incomes={periodIncomes} />
        <BudgetProgressBar expenses={periodExpenses} budget={budget} />
        <SummaryTrendsChart expenses={periodExpenses} incomes={periodIncomes} />
        {activeTab === 'expenses' && (
          <>
            <ExpenseForm onAdd={handleAddExpense} />
            <SearchBar value={search} onChange={setSearch} />
            <Filters filters={filters} onChange={setFilters} onApply={handleApplyFilters} onClear={handleClearFilters} />
            <BudgetInput budget={budget} onSave={handleSaveBudget} />
            <ExpenseList expenses={filteredExpenses} onDelete={handleDeleteExpense} />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <ExpenseChart expenses={filteredExpenses} />
              </div>
              <div className="flex-1">
                <ExpenseBarChart expenses={filteredExpenses} />
              </div>
            </div>
            <ExportSection expenses={filteredExpenses} />
          </>
        )}
        {activeTab === 'income' && (
          <>
            <IncomeForm onAdd={handleAddIncome} />
            <SearchBar value={incomeSearch} onChange={setIncomeSearch} />
            <Filters filters={incomeFilters} onChange={setIncomeFilters} onApply={handleApplyIncomeFilters} onClear={handleClearIncomeFilters} />
            <IncomeList incomes={filteredIncomes} onDelete={handleDeleteIncome} />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <IncomeChart incomes={filteredIncomes} />
              </div>
              <div className="flex-1">
                <IncomeBarChart incomes={filteredIncomes} />
              </div>
            </div>
            <ExportIncomeSection incomes={filteredIncomes} />
          </>
        )}
      </main>
    </div>
  );
}

function App() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = React.useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <>
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <Router>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordWrapper />} />
          <Route path="/profile" element={<Profile user={user} logout={logout} darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/admin" element={<AdminPanel user={user} logout={logout} darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="*" element={<AppContent user={user} logout={logout} darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
