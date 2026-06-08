'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function KYCPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const fetchKyc = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/kyc?status=${filter}`);
      const data = await res.json();
      setRecords(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchKyc(); }, [filter]);

  const handleStatus = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`${API}/kyc/${id}/${action}`, { method: 'PATCH' });
    fetchKyc();
  };

  const statusColors: Record<string, string> = {
    approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger',
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">KYC Review</h1>
        <p className="page-subtitle">Review and approve user identity verifications</p>
      </div>

      <div className="data-table-wrap">
        <div className="table-header">
          <h3 className="table-title">KYC Applications</h3>
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Document Type</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No records found</td></tr>
            ) : records.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar">{r.userName?.split(' ').map((n: string) => n[0]).join('')}</div>
                    <span className="font-medium">{r.userName}</span>
                  </div>
                </td>
                <td>{r.userEmail}</td>
                <td style={{ textTransform: 'capitalize' }}>{r.documentType?.replace('_', ' ')}</td>
                <td><span className={`badge ${statusColors[r.status]}`} style={{ textTransform: 'capitalize' }}>{r.status}</span></td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  {r.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="action-btn action-approve" onClick={() => handleStatus(r.id, 'approve')}>✓ Approve</button>
                      <button className="action-btn action-reject" onClick={() => handleStatus(r.id, 'reject')}>✗ Reject</button>
                    </div>
                  )}
                  {r.status !== 'pending' && <span className="text-xs text-muted">Reviewed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
