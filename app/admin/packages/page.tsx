'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [form, setForm] = useState({
    title: '',
    coins: 500,
    price: 5.0, // starts at minimum $5.00
    desc: '',
    icon: 'shield',
    color: '#e0f4dc',
    popular: false,
  });

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await fetch(`${API}/coin-packages/admin`).then(r => r.json());
      setPackages(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreate = async () => {
    setErrorMsg('');
    if (!form.title || !form.desc || !form.icon) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }
    if (form.price < 5) {
      setErrorMsg('Package price must be at least $5.00 USD.');
      return;
    }

    const res = await fetch(`${API}/coin-packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ title: '', coins: 500, price: 5.0, desc: '', icon: 'shield', color: '#e0f4dc', popular: false });
      setShowForm(false);
      fetchPackages();
    } else {
      const err = await res.json();
      setErrorMsg(err.message || 'Failed to create package.');
    }
  };

  const handleUpdate = async () => {
    setErrorMsg('');
    if (!editingPackage) return;
    if (form.price < 5) {
      setErrorMsg('Package price must be at least $5.00 USD.');
      return;
    }

    const res = await fetch(`${API}/coin-packages/${editingPackage.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setEditingPackage(null);
      setForm({ title: '', coins: 500, price: 5.0, desc: '', icon: 'shield', color: '#e0f4dc', popular: false });
      setShowForm(false);
      fetchPackages();
    } else {
      const err = await res.json();
      setErrorMsg(err.message || 'Failed to update package.');
    }
  };

  const handleEditClick = (pkg: any) => {
    setEditingPackage(pkg);
    setForm({
      title: pkg.title,
      coins: pkg.coins,
      price: pkg.price,
      desc: pkg.desc,
      icon: pkg.icon,
      color: pkg.color,
      popular: pkg.popular,
    });
    setShowForm(true);
  };

  const handleToggle = async (id: string) => {
    await fetch(`${API}/coin-packages/${id}/toggle`, { method: 'PATCH' });
    fetchPackages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coin package?')) return;
    await fetch(`${API}/coin-packages/${id}`, { method: 'DELETE' });
    fetchPackages();
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Coin Packages</h1>
          <p className="page-subtitle">Manage dynamic packages for users to purchase coins</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            if (showForm && editingPackage) {
              setEditingPackage(null);
              setForm({ title: '', coins: 500, price: 5.0, desc: '', icon: 'shield', color: '#e0f4dc', popular: false });
            } else {
              setShowForm(!showForm);
            }
          }}
        >
          {showForm ? 'Cancel' : '+ Create Package'}
        </button>
      </div>

      {showForm && (
        <div className="chart-wrap" style={{ marginBottom: 24, padding: 20 }}>
          <h3 className="chart-title" style={{ marginBottom: 16 }}>
            {editingPackage ? `Edit ${editingPackage.title}` : 'Create New Coin Package'}
          </h3>

          {errorMsg ? (
            <div 
              style={{ 
                padding: '10px 14px', 
                backgroundColor: 'var(--danger)10', 
                border: '1px dashed var(--danger)', 
                borderRadius: 8, 
                color: 'var(--danger)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              ⚠️ {errorMsg}
            </div>
          ) : null}

          <div className="grid-3" style={{ gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Package Title *</label>
              <input 
                className="form-input" 
                type="text" 
                value={form.title} 
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Starter Pack"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Coins Quantity *</label>
              <input 
                className="form-input" 
                type="number" 
                value={form.coins} 
                onChange={(e) => setForm(prev => ({ ...prev, coins: +e.target.value }))}
                min="1"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">USD Price (Min $5.00) *</label>
              <input 
                className="form-input" 
                type="number" 
                step="0.01"
                min="5"
                value={form.price} 
                onChange={(e) => setForm(prev => ({ ...prev, price: +e.target.value }))}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description *</label>
              <input 
                className="form-input" 
                type="text" 
                value={form.desc} 
                onChange={(e) => setForm(prev => ({ ...prev, desc: e.target.value }))}
                placeholder="e.g. Perfect for testing small strategies"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Icon Name (shield / chart-bar / rocket) *</label>
              <input 
                className="form-input" 
                type="text" 
                value={form.icon} 
                onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g. shield"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Icon Background Hex Color *</label>
              <input 
                className="form-input" 
                type="text" 
                value={form.color} 
                onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                placeholder="e.g. #e0f4dc"
              />
            </div>
          </div>
          
          <div className="form-group" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input 
              type="checkbox" 
              id="popular" 
              checked={form.popular} 
              onChange={(e) => setForm(prev => ({ ...prev, popular: e.target.checked }))} 
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="popular" style={{ fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
              Mark as "Popular" (Adds a highlight badge on mobile screen)
            </label>
          </div>

          <div className="flex gap-3" style={{ marginTop: 20 }}>
            {editingPackage ? (
              <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
            ) : (
              <button className="btn btn-primary" onClick={handleCreate}>Create Package</button>
            )}
            <button className="btn btn-secondary" onClick={() => {
              setShowForm(false);
              setEditingPackage(null);
              setForm({ title: '', coins: 500, price: 5.0, desc: '', icon: 'shield', color: '#e0f4dc', popular: false });
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid-3">
        {loading ? (
          <div className="text-secondary">Loading coin packages...</div>
        ) : packages.length === 0 ? (
          <div className="text-secondary">No coin packages registered. Click "+ Create Package" to start.</div>
        ) : (
          packages.map((p) => (
            <div 
              key={p.id} 
              className="card" 
              style={{ 
                border: `1px solid ${p.popular ? 'var(--primary)' : 'var(--border)'}`, 
                opacity: p.isActive ? 1 : 0.6,
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 20,
                borderRadius: 12,
                position: 'relative'
              }}
            >
              {p.popular && (
                <span 
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'var(--primary)15',
                    color: 'var(--primary)',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                >
                  POPULAR
                </span>
              )}
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.25rem', padding: '6px 10px', borderRadius: 8, background: p.color }}>
                    🪙
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{p.title}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {p.coins.toLocaleString()} Coins
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 16px 0', lineHeight: 1.4 }}>
                  {p.desc}
                </p>

                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 16 }}>
                  ${p.price.toFixed(2)}
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
                <button className="action-btn action-view" onClick={() => handleEditClick(p)}>
                  Edit
                </button>
                <button 
                  className={`action-btn ${p.isActive ? 'action-reject' : 'action-approve'}`} 
                  onClick={() => handleToggle(p.id)}
                >
                  {p.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="action-btn action-reject" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
