'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, statRes] = await Promise.all([
        fetch(`${API}/transactions?page=${page}&limit=10&status=${filter}`),
        fetch(`${API}/transactions/stats`),
      ]);
      const txData = await txRes.json();
      const statData = await statRes.json();
      setTransactions(txData.data);
      setTotal(txData.total);
      setStats(statData);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page, filter]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`${API}/transactions/${id}/${action}`, { method: 'PATCH' });
    fetchData();
  };

  const typeColors: Record<string, string> = { deposit: 'badge-success', withdrawal: 'badge-danger', reward: 'badge-purple', game_win: 'badge-warning' };
  const statusColors: Record<string, string> = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger' };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <p className="page-subtitle">Manage deposits, withdrawals and rewards</p>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Revenue', value: `🪙 ${stats.totalDeposits.toLocaleString()}`, color: 'var(--success)' },
            { label: 'Total Withdrawn', value: `🪙 ${stats.totalWithdrawals.toLocaleString()}`, color: 'var(--danger)' },
            { label: 'Net Flow', value: `🪙 ${stats.netFlow.toLocaleString()}`, color: 'var(--primary)' },
            { label: 'Pending', value: stats.pending, color: 'var(--warning)' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-value" style={{ color: s.color, fontSize: '1.25rem' }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="data-table-wrap">
        <div className="table-header">
          <h3 className="table-title">All Transactions</h3>
          <select className="filter-select" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>User</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</td></tr>
            ) : transactions.map((t) => (
              <tr key={t.id}>
                <td className="text-xs text-muted">{t.id}</td>
                <td className="font-medium">{t.userId}</td>
                <td><span className={`badge ${typeColors[t.type] || 'badge-primary'}`} style={{ textTransform: 'capitalize' }}>{t.type.replace('_', ' ')}</span></td>
                <td className="font-medium">🪙 {t.amount.toLocaleString()}</td>
                <td>{t.method || '—'}</td>
                <td><span className={`badge ${statusColors[t.status]}`} style={{ textTransform: 'capitalize' }}>{t.status}</span></td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>
                  {t.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="action-btn action-approve" onClick={() => handleAction(t.id, 'approve')}>Approve</button>
                      <button className="action-btn action-reject" onClick={() => handleAction(t.id, 'reject')}>Reject</button>
                    </div>
                  )}
                  {t.status !== 'pending' && <span className="text-xs text-muted">Done</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <span className="text-sm text-muted">Page {page} · {total} total</span>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
