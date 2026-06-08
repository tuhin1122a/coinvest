'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', risk: 'low', returnRate: '', returnPercent: 10, duration: '7 days', durationDays: 7, minCoins: 1000 });

  const fetchPlans = async () => {
    setLoading(true);
    try { const data = await fetch(`${API}/plans`).then(r => r.json()); setPlans(data); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleCreate = async () => {
    await fetch(`${API}/plans`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false);
    fetchPlans();
  };

  const handleToggle = async (id: string) => {
    await fetch(`${API}/plans/${id}/toggle`, { method: 'PATCH' });
    fetchPlans();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this plan?')) return;
    await fetch(`${API}/plans/${id}`, { method: 'DELETE' });
    fetchPlans();
  };

  const riskColors: Record<string, string> = { low: 'var(--success)', med: 'var(--warning)', hi: 'var(--danger)' };
  const riskLabels: Record<string, string> = { low: 'Low Risk', med: 'Medium', hi: 'High Risk' };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Investment Plans</h1>
          <p className="page-subtitle">Create and manage investment plan tiers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Create Plan</button>
      </div>

      {showForm && (
        <div className="chart-wrap" style={{ marginBottom: 24 }}>
          <h3 className="chart-title" style={{ marginBottom: 16 }}>New Investment Plan</h3>
          <div className="grid-3">
            {[
              { label: 'Plan Name', key: 'name', type: 'text' },
              { label: 'Return Rate (e.g. 10–15%)', key: 'returnRate', type: 'text' },
              { label: 'Return % (number)', key: 'returnPercent', type: 'number' },
              { label: 'Duration Label', key: 'duration', type: 'text' },
              { label: 'Duration Days', key: 'durationDays', type: 'number' },
              { label: 'Min Coins', key: 'minCoins', type: 'number' },
            ].map((f) => (
              <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm(prev => ({ ...prev, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))} />
              </div>
            ))}
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Risk Level</label>
            <select className="filter-select form-input" style={{ width: 200 }} value={form.risk} onChange={(e) => setForm(p => ({ ...p, risk: e.target.value as any }))}>
              <option value="low">Low Risk</option>
              <option value="med">Medium Risk</option>
              <option value="hi">High Risk</option>
            </select>
          </div>
          <div className="flex gap-3" style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={handleCreate}>Create Plan</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid-3">
        {loading ? <div className="text-secondary">Loading...</div> : plans.map((p) => (
          <div key={p.id} className="card" style={{ border: `1px solid ${riskColors[p.risk]}30`, opacity: p.isActive ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{p.name}</h3>
                <span className="badge" style={{ background: `${riskColors[p.risk]}15`, color: riskColors[p.risk] }}>{riskLabels[p.risk]}</span>
              </div>
              <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: riskColors[p.risk], marginBottom: 12 }}>{p.returnRate}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div><div className="text-xs text-muted">Duration</div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.duration}</div></div>
              <div><div className="text-xs text-muted">Min Coins</div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>🪙 {p.minCoins.toLocaleString()}</div></div>
            </div>
            <div className="flex gap-2">
              <button className={`action-btn ${p.isActive ? 'action-reject' : 'action-approve'}`} onClick={() => handleToggle(p.id)}>{p.isActive ? 'Deactivate' : 'Activate'}</button>
              <button className="action-btn action-reject" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
