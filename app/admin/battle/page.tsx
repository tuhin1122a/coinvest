'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function BattlePage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/battle/leaderboard`).then(r => r.json()),
      fetch(`${API}/battle/missions`).then(r => r.json()),
    ]).then(([lb, ms]) => { setLeaderboard(lb); setMissions(ms); });
  }, []);

  const toggleMission = async (id: string) => {
    await fetch(`${API}/battle/missions/${id}/toggle`, { method: 'PATCH' });
    const data = await fetch(`${API}/battle/missions`).then(r => r.json());
    setMissions(data);
  };

  const tierColors: Record<string, string> = { bronze: '#c85010', silver: '#9ca3af', gold: '#f59e0b', platinum: '#a855f7' };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Battle & Leaderboard</h1>
        <p className="page-subtitle">Monitor rankings and manage missions</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Leaderboard */}
        <div className="data-table-wrap" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div className="table-header"><h3 className="table-title">🏆 Top 10 Leaderboard</h3></div>
          <table>
            <thead><tr><th>Rank</th><th>User</th><th>Coins</th><th>Streak</th><th>VIP</th></tr></thead>
            <tbody>
              {leaderboard.map((u) => (
                <tr key={u.rank}>
                  <td style={{ fontWeight: 900, fontSize: u.rank <= 3 ? '1.1rem' : '0.875rem', color: u.rank === 1 ? '#f59e0b' : u.rank === 2 ? '#9ca3af' : u.rank === 3 ? '#c85010' : 'var(--text-muted)' }}>
                    {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank - 1] : `#${u.rank}`}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: '0.65rem' }}>
                        {u.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="font-medium" style={{ color: 'var(--primary)' }}>🪙 {u.coins.toLocaleString()}</td>
                  <td>🔥 {u.streak}</td>
                  <td><span className="badge" style={{ background: `${tierColors[u.vipTier]}20`, color: tierColors[u.vipTier], textTransform: 'capitalize' }}>{u.vipTier}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Missions */}
        <div className="chart-wrap">
          <h3 className="chart-title" style={{ marginBottom: 16 }}>⚔️ Missions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {missions.map((m) => (
              <div key={m.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 2 }}>{m.title}</div>
                    <div className="text-xs text-muted">{m.description}</div>
                  </div>
                  <span className={`badge ${m.isActive ? 'badge-success' : 'badge-danger'}`}>{m.isActive ? 'Active' : 'Off'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="flex gap-3">
                    <span className="badge badge-primary">🪙 {m.reward} reward</span>
                    <span className="badge badge-warning" style={{ textTransform: 'capitalize' }}>{m.type}</span>
                  </div>
                  <button className={`action-btn ${m.isActive ? 'action-reject' : 'action-approve'}`} onClick={() => toggleMission(m.id)}>
                    {m.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
