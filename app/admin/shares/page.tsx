'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function SharesPage() {
  const [shares, setShares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShare, setEditingShare] = useState<any>(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    ticker: '',
    price: 100,
    change: 1.5,
    logo: '🍎',
    color: '#ffebed',
  });

  const fetchShares = async () => {
    setLoading(true);
    try {
      const data = await fetch(`${API}/shares/admin`).then(r => r.json());
      setShares(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShares();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.ticker || !form.logo) {
      alert('Please fill out all required fields.');
      return;
    }
    await fetch(`${API}/shares`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', ticker: '', price: 100, change: 1.5, logo: '🍎', color: '#ffebed' });
    setShowForm(false);
    fetchShares();
  };

  const handleUpdate = async () => {
    if (!editingShare) return;
    await fetch(`${API}/shares/${editingShare.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setEditingShare(null);
    setForm({ name: '', ticker: '', price: 100, change: 1.5, logo: '🍎', color: '#ffebed' });
    setShowForm(false);
    fetchShares();
  };

  const handleEditClick = (share: any) => {
    setEditingShare(share);
    setForm({
      name: share.name,
      ticker: share.ticker,
      price: share.price,
      change: share.change,
      logo: share.logo,
      color: share.color,
    });
    setShowForm(true);
  };

  const handleToggle = async (id: string) => {
    await fetch(`${API}/shares/${id}/toggle`, { method: 'PATCH' });
    fetchShares();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this share? This will affect user portfolio tracking.')) return;
    await fetch(`${API}/shares/${id}`, { method: 'DELETE' });
    fetchShares();
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Company Shares</h1>
          <p className="page-subtitle">Add, remove, and update company stock share parameters</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            if (showForm && editingShare) {
              setEditingShare(null);
              setForm({ name: '', ticker: '', price: 100, change: 1.5, logo: '🍎', color: '#ffebed' });
            } else {
              setShowForm(!showForm);
            }
          }}
        >
          {showForm ? 'Cancel' : '+ Create Share'}
        </button>
      </div>

      {showForm && (
        <div className="chart-wrap" style={{ marginBottom: 24, padding: 20 }}>
          <h3 className="chart-title" style={{ marginBottom: 16 }}>
            {editingShare ? `Edit ${editingShare.ticker} Parameters` : 'Add New Company Share'}
          </h3>
          <div className="grid-3" style={{ gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company Name *</label>
              <input 
                className="form-input" 
                type="text" 
                value={form.name} 
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Apple Inc."
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ticker symbol *</label>
              <input 
                className="form-input" 
                type="text" 
                value={form.ticker} 
                onChange={(e) => setForm(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
                placeholder="e.g. AAPL"
                disabled={!!editingShare} // Ticker is immutable for consistency
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stock Price (Coins) *</label>
              <input 
                className="form-input" 
                type="number" 
                value={form.price} 
                onChange={(e) => setForm(prev => ({ ...prev, price: +e.target.value }))}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Change % (Positive for Profit, Negative for Loss)</label>
              <input 
                className="form-input" 
                type="number" 
                step="0.1"
                value={form.change} 
                onChange={(e) => setForm(prev => ({ ...prev, change: +e.target.value }))}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Logo Icon/Emoji *</label>
              <input 
                className="form-input" 
                type="text" 
                value={form.logo} 
                onChange={(e) => setForm(prev => ({ ...prev, logo: e.target.value }))}
                placeholder="e.g. 🍎"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Card Background (Hex Color)</label>
              <input 
                className="form-input" 
                type="text" 
                value={form.color} 
                onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                placeholder="e.g. #ffebed"
              />
            </div>
          </div>
          <div className="flex gap-3" style={{ marginTop: 20 }}>
            {editingShare ? (
              <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
            ) : (
              <button className="btn btn-primary" onClick={handleCreate}>Add Share</button>
            )}
            <button className="btn btn-secondary" onClick={() => {
              setShowForm(false);
              setEditingShare(null);
              setForm({ name: '', ticker: '', price: 100, change: 1.5, logo: '🍎', color: '#ffebed' });
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid-3">
        {loading ? (
          <div className="text-secondary">Loading shares...</div>
        ) : shares.length === 0 ? (
          <div className="text-secondary">No shares registered. Click "+ Create Share" to start.</div>
        ) : (
          shares.map((s) => {
            const isProfit = s.change >= 0;
            return (
              <div 
                key={s.id} 
                className="card" 
                style={{ 
                  border: `1px solid ${isProfit ? 'var(--success)' : 'var(--danger)'}30`, 
                  opacity: s.isActive ? 1 : 0.6,
                  background: 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.75rem', padding: '6px 10px', borderRadius: 8, background: s.color }}>
                        {s.logo}
                      </span>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{s.name}</h3>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{s.ticker}</span>
                      </div>
                    </div>
                    <span className={`badge ${s.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '16px 0 12px 0' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      🪙 {s.price.toLocaleString()}
                    </span>
                    <span 
                      style={{ 
                        fontWeight: 700, 
                        fontSize: '0.95rem', 
                        color: isProfit ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {isProfit ? '▲' : '▼'} {Math.abs(s.change)}% ({isProfit ? 'Profit' : 'Loss'})
                    </span>
                  </div>
                </div>

                <div 
                  className="flex gap-2" 
                  style={{ 
                    paddingTop: 12, 
                    borderTop: '1px solid var(--border)', 
                    marginTop: 12,
                  }}
                >
                  <button className="action-btn action-view" onClick={() => handleEditClick(s)}>
                    Edit Parameters
                  </button>
                  <button 
                    className={`action-btn ${s.isActive ? 'action-reject' : 'action-approve'}`} 
                    onClick={() => handleToggle(s.id)}
                  >
                    {s.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="action-btn action-reject" onClick={() => handleDelete(s.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
