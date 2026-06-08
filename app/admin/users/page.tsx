'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users?page=${page}&limit=10&search=${search}`);
      const data = await res.json();
      setUsers(data.data);
      setTotal(data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleBan = async (id: string) => {
    await fetch(`${API}/users/${id}/ban`, { method: 'PATCH' });
    fetchUsers();
  };

  const tierColors: Record<string, string> = {
    bronze: '#c85010', silver: '#9ca3af', gold: '#f59e0b', platinum: '#a855f7',
  };
  const kycColors: Record<string, string> = {
    approved: 'var(--success)', pending: 'var(--warning)', rejected: 'var(--danger)', none: 'var(--text-muted)',
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">{total} total users registered</p>
      </div>

      <div className="data-table-wrap">
        <div className="table-header">
          <h3 className="table-title">All Users</h3>
          <input
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Coins</th>
              <th>VIP</th>
              <th>KYC</th>
              <th>Streak</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</td></tr>
            ) : users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar">{u.name.split(' ').map((n: string) => n[0]).join('')}</div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td className="font-medium">🪙 {u.coins.toLocaleString()}</td>
                <td>
                  <span className="badge" style={{ background: `${tierColors[u.vipTier]}20`, color: tierColors[u.vipTier], textTransform: 'capitalize' }}>
                    {u.vipTier}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: kycColors[u.kycStatus], textTransform: 'capitalize' }}>
                    {u.kycStatus}
                  </span>
                </td>
                <td>🔥 {u.streak}</td>
                <td>
                  <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {u.isActive ? 'Active' : 'Banned'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className={`action-btn ${u.isActive ? 'action-reject' : 'action-approve'}`} onClick={() => handleBan(u.id)}>
                      {u.isActive ? 'Ban' : 'Unban'}
                    </button>
                    <button className="action-btn action-view">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <span className="text-sm text-muted">Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}</span>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
