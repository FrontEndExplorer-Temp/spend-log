import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

function AdminPanel() {
  const { fetchWithAuth, user } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const statsRes = await fetchWithAuth('/api/auth/admin/stats');
        const statsData = await statsRes.json();
        setStats(statsData);
        const usersRes = await fetchWithAuth('/api/auth/admin/users');
        const usersData = await usersRes.json();
        setUsers(usersData);
      } catch (err) {
        showToast('Failed to load admin data', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchWithAuth, showToast]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      const res = await fetchWithAuth(`/api/auth/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');
      setUsers(users.filter(u => u._id !== id));
      showToast('User deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  if (!user?.isAdmin) {
    return <div className="max-w-2xl mx-auto mt-12 text-center text-red-600 font-bold">Admin access required.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      {loading ? <div>Loading...</div> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-100 rounded-xl p-4 text-center">
              <div className="text-lg font-semibold">Users</div>
              <div className="text-2xl font-bold">{stats?.userCount ?? '-'}</div>
            </div>
            <div className="bg-green-100 rounded-xl p-4 text-center">
              <div className="text-lg font-semibold">Verified</div>
              <div className="text-2xl font-bold">{stats?.verifiedCount ?? '-'}</div>
            </div>
            <div className="bg-yellow-100 rounded-xl p-4 text-center">
              <div className="text-lg font-semibold">Expenses</div>
              <div className="text-2xl font-bold">{stats?.expenseCount ?? '-'}</div>
            </div>
            <div className="bg-purple-100 rounded-xl p-4 text-center">
              <div className="text-lg font-semibold">Incomes</div>
              <div className="text-2xl font-bold">{stats?.incomeCount ?? '-'}</div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Users</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Verified</th>
                  <th className="px-4 py-2">Admin</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t">
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 text-center">{u.isVerified ? '✅' : '❌'}</td>
                    <td className="px-4 py-2 text-center">{u.isAdmin ? '🛡️' : ''}</td>
                    <td className="px-4 py-2 text-center">
                      {!u.isAdmin && (
                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel; 