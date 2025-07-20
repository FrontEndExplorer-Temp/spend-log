import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

function Login() {
  // Remove loading and error from useAuth destructure
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendMsg, setResendMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://spend-log-qukd.onrender.com';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(null); setShowResend(false); setResendMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 && data.message && data.message.includes('verify your email')) {
          setShowResend(true);
        }
        throw new Error(data.message || 'Login failed');
      }
      login(email, password); // fallback, should use context
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setResendMsg(data.message);
    } catch (err) {
      setResendMsg('Failed to resend verification email.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Spend Log</title>
        <meta name="description" content="Login to your Spend Log account to track your expenses and income." />
      </Helmet>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Login</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 dark:text-gray-200">Email</label>
          <input type="email" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-900 dark:text-white" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 dark:text-gray-200">Password</label>
          <input type="password" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-900 dark:text-white" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <motion.button
          type="submit"
          className="w-full bg-blue-500 dark:bg-blue-700 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition"
          disabled={loading}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.03 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </motion.button>
        {showResend && (
          <div className="mt-4 text-center">
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleResend}>
              Resend Verification Email
            </button>
            {resendMsg && <div className="mt-2 text-green-600">{resendMsg}</div>}
          </div>
        )}
      </form>
    </>
  );
}

export default Login; 
