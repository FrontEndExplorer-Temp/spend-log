import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'https://spend-log-qukd.onrender.com';

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify-email/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully! You can now log in.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Verification failed.');
      }
    }
    verify();
  }, [API_URL, token]);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8 mt-12 text-center">
      <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Email Verification</h2>
      {status === 'verifying' && <div>Verifying...</div>}
      {status === 'success' && <div className="text-green-600">{message}</div>}
      {status === 'error' && <div className="text-red-500">{message}</div>}
    </div>
  );
}

export default VerifyEmail; 
