import React, { useState } from 'react';

function ResetPassword({ token }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://spend-log-qukd.onrender.com';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setMessage('Password has been reset! You can now log in.');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Reset Password</h2>
      {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <div className="mb-6">
        <label className="block mb-1 dark:text-gray-200">New Password</label>
        <input type="password" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-900 dark:text-white" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="w-full bg-green-500 dark:bg-green-700 text-white rounded px-3 py-2 font-semibold hover:bg-green-600 dark:hover:bg-green-800 transition" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default ResetPassword; 
