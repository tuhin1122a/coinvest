'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function GamesPage() {
  const [config, setConfig] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/games/config`).then(r => r.json()),
      fetch(`${API}/games/stats`).then(r => r.json()),
      fetch(`${API}/games/results`).then(r => r.json()),
    ]).then(([c, s, r]) => { setConfig(c); setStats(s); setResults(r.data); });
  }, []);

  const saveConfig = async () => {
    setSaving(true);
    await fetch(`${API}/games/config`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    setSaving(false);
  };

  if (!config) return <div className="text-secondary" style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Games Management</h1>
        <p className="page-subtitle">Configure game settings and view results</p>
      </div>

      {stats && (
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Plays', value: stats.totalPlays, color: 'var(--primary)' },
            { label: 'Rewards Given', value: `🪙 ${stats.totalRewardsGiven?.toLocaleString()}`, color: 'var(--success)' },
            { label: 'Spin Plays', value: stats.byGame?.spin, color: 'var(--purple)' },
            { label: 'Lucky Draw Plays', value: stats.byGame?.lucky_draw, color: 'var(--warning)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-value" style={{ color: s.color, fontSize: '1.5rem' }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="chart-wrap">
          <h3 className="chart-title" style={{ marginBottom: 16 }}>Game Toggles</h3>
          {[
            { key: 'spinWheelEnabled', label: '🎡 Spin Wheel' },
            { key: 'scratchCardEnabled', label: '🎴 Scratch Cards' },
            { key: 'luckyDrawEnabled', label: '🎰 Lucky Draw' },
          ].map((g) => (
            <div key={g.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{g.label}</span>
              <button
                className={`badge ${config[g.key] ? 'badge-success' : 'badge-danger'}`}
                style={{ cursor: 'pointer', padding: '6px 14px' }}
                onClick={() => setConfig((p: any) => ({ ...p, [g.key]: !p[g.key] }))}
              >
                {config[g.key] ? '● Enabled' : '○ Disabled'}
              </button>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <div className="form-group">
              <label className="form-label">Daily Spin Limit</label>
              <input type="number" className="form-input" value={config.dailySpinLimit} onChange={(e) => setConfig((p: any) => ({ ...p, dailySpinLimit: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Lucky Draw Ticket Price (coins)</label>
              <input type="number" className="form-input" value={config.luckyDrawTicketPrice} onChange={(e) => setConfig((p: any) => ({ ...p, luckyDrawTicketPrice: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Lucky Draw Prize (coins)</label>
              <input type="number" className="form-input" value={config.luckyDrawPrize} onChange={(e) => setConfig((p: any) => ({ ...p, luckyDrawPrize: +e.target.value }))} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={saveConfig} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Config'}
            </button>
          </div>
        </div>

        <div className="data-table-wrap" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div className="table-header"><h3 className="table-title">Recent Game Results</h3></div>
          <table>
            <thead><tr><th>User</th><th>Game</th><th>Reward</th><th>Date</th></tr></thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.userName || r.userId}</td>
                  <td><span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{r.gameType.replace('_', ' ')}</span></td>
                  <td className="font-medium" style={{ color: 'var(--success)' }}>🪙 {r.reward}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
