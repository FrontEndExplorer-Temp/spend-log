import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRef } from 'react';
import Spinner from './Spinner';
import SkeletonProfile from './SkeletonProfile';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
import Navbar from './Navbar';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

function Profile({ user, logout, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState(null);
  const [emailErr, setEmailErr] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState(null);
  const [pwErr, setPwErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState(null);
  const [avatarErr, setAvatarErr] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef();
  const [avatar, setAvatar] = useState("");
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [deleteErr, setDeleteErr] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  if (!user) return <SkeletonProfile />;

  const handleEmailUpdate = async e => {
    e.preventDefault();
    setLoading(true); setEmailMsg(null); setEmailErr(null);
    try {
      const res = await fetchWithAuth('/api/auth/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update email');
      setEmailMsg('Email updated!');
      showToast('Email updated!', 'success');
    } catch (err) {
      setEmailErr(err.message);
      showToast(err.message || 'Failed to update email', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async e => {
    e.preventDefault();
    setLoading(true); setPwMsg(null); setPwErr(null);
    try {
      const res = await fetchWithAuth('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');
      setPwMsg('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
      showToast('Password updated!', 'success');
    } catch (err) {
      setPwErr(err.message);
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setAvatarErr('Only image files are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setAvatarErr('Image size must be less than 2MB.');
      return;
    }
    // Show preview before upload
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setAvatarLoading(true); setAvatarMsg(null); setAvatarErr(null);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetchWithAuth('/api/auth/avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to upload avatar');
      // Accept either a full URL or a filename
      const avatarUrl = data.avatar?.startsWith('http') ? data.avatar : `https://spend-log-qukd.onrender.com/images/${data.avatar}`;
      setAvatar(data.avatar);
      setAvatarPreview("");
      setAvatarMsg('Avatar updated!');
      user.avatar = data.avatar;
      localStorage.setItem('avatar', data.avatar);
      showToast('Avatar updated!', 'success');
    } catch (err) {
      setAvatarErr(err.message);
      showToast(err.message || 'Failed to upload avatar', 'error');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setDeleteLoading(true); setDeleteMsg(null); setDeleteErr(null);
    try {
      const res = await fetchWithAuth('/api/auth/delete-account', {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete account');
      setDeleteMsg('Account deleted.');
      showToast('Account deleted.', 'success');
      setTimeout(() => {
        logout();
        navigate('/');
      }, 1500);
    } catch (err) {
      setDeleteErr(err.message);
      showToast(err.message || 'Failed to delete account', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile | Spend Log</title>
        <meta name="description" content="View and update your Spend Log profile, email, password, and avatar." />
      </Helmet>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} activeTab="expenses" setActiveTab={() => {}} />
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8 mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Profile</h2>
          <div className="flex flex-col items-center mb-6">
            <img
              src={avatarPreview || (avatar ? (avatar.startsWith('http') ? avatar : `https://spend-log-qukd.onrender.com/images/${avatar}`) : '/favicon.ico')}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 mb-2"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded mb-2 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => fileInputRef.current.click()}
              disabled={avatarLoading}
            >
              {avatarLoading ? <Spinner className="h-5 w-5" /> : 'Change Avatar'}
            </button>
            {avatarMsg && <div className="text-green-600 text-center">{avatarMsg}</div>}
            {avatarErr && <div className="text-red-500 text-center">{avatarErr}</div>}
          </div>
          <form onSubmit={handleEmailUpdate} className="mb-8">
            <label className="block mb-1 dark:text-gray-200">Email</label>
            <input type="email" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-2 dark:bg-gray-900 dark:text-white" value={email} onChange={e => setEmail(e.target.value)} required />
            {emailMsg && <div className="mb-2 text-green-600 text-center">{emailMsg}</div>}
            {emailErr && <div className="mb-2 text-red-500 text-center">{emailErr}</div>}
            <motion.button
              type="submit"
              className="w-full bg-blue-500 dark:bg-blue-700 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition mb-2"
              disabled={loading}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
            >
              Update Email
            </motion.button>
          </form>
          <form onSubmit={handlePasswordUpdate}>
            <label className="block mb-1 dark:text-gray-200">Current Password</label>
            <input type="password" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-2 dark:bg-gray-900 dark:text-white" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            <label className="block mb-1 dark:text-gray-200">New Password</label>
            <input type="password" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-2 dark:bg-gray-900 dark:text-white" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            {pwMsg && <div className="mb-2 text-green-600 text-center">{pwMsg}</div>}
            {pwErr && <div className="mb-2 text-red-500 text-center">{pwErr}</div>}
            <motion.button
              type="submit"
              className="w-full bg-green-500 dark:bg-green-700 text-white rounded px-3 py-2 font-semibold hover:bg-green-600 dark:hover:bg-green-800 transition"
              disabled={loading}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
            >
              Update Password
            </motion.button>
          </form>
          <motion.button
            className="w-full mt-6 bg-red-500 dark:bg-red-700 text-white rounded px-3 py-2 font-semibold hover:bg-red-600 dark:hover:bg-red-800 transition"
            onClick={logout}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
          >
            Logout
          </motion.button>
          <motion.button
            className="w-full mt-3 bg-red-700 dark:bg-red-900 text-white rounded px-3 py-2 font-semibold hover:bg-red-800 dark:hover:bg-red-950 transition"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
          >
            Delete Account
          </motion.button>
          {deleteMsg && <div className="text-green-600 text-center mt-2">{deleteMsg}</div>}
          {deleteErr && <div className="text-red-500 text-center mt-2">{deleteErr}</div>}
        </div>
      </div>
    </>
  );
}

export default Profile; 
