import React, { useState } from 'react';

function ForgotPassword({ onSent }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://spend-log-qukd.onrender.com'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send email');
      setMessage('Password reset email sent! Check your inbox.');
      setEmail('');
      if (onSent) onSent();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Forgot Password</h2>
      {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <div className="mb-6">
        <label className="block mb-1 dark:text-gray-200">Email</label>
        <input type="email" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-900 dark:text-white" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <button type="submit" className="w-full bg-blue-500 dark:bg-blue-700 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Email'}
      </button>
    </form>
  );
}

export default ForgotPassword; 
