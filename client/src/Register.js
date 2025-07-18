import React, { useState } from 'react';
import { useAuth } from './AuthContext';

function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyMsg, setVerifyMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || '';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(null); setVerifyMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setVerifyMsg(data.message || 'Registration successful! Please check your email to verify your account.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Register</h2>
      {verifyMsg ? (
        <div className="text-green-600 text-center mb-4">{verifyMsg}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <div className="mb-4">
            <label className="block mb-1 dark:text-gray-200">Email</label>
            <input type="email" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-900 dark:text-white" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block mb-1 dark:text-gray-200">Password</label>
            <input type="password" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-900 dark:text-white" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-green-500 dark:bg-green-700 text-white rounded px-3 py-2 font-semibold hover:bg-green-600 dark:hover:bg-green-800 transition" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}
      {error && <div className="text-red-500 text-center mt-2">{error}</div>}
    </div>
  );
}

export default Register; 