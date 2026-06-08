'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

interface Stats {
  users: { total: number; active: number; newToday: number };
  transactions: { pending: number; totalRevenue: number };
  kyc: { pending: number };
  investments: { active: number; totalInvested: number };
  games: { totalPlays: number; rewardsGiven: number };
  coins: { inCirculation: number };
}

// Simple bar chart using divs
function MiniBarChart({ data }: { data: { day: string; deposits: number; withdrawals: number }[] }) {
  const max = Math.max(...data.map((d) => d.deposits));
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120, padding: '0 4px' }}>
      {data.map((d) => (
        <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 96 }}>
            <div
              style={{ flex: 1, background: 'var(--primary)', borderRadius: '4px 4px 0 0', transition: 'height 0.6s ease',
                height: `${(d.deposits / max) * 96}px`, opacity: 0.8 }}
            />
            <div
              style={{ flex: 1, background: 'var(--danger)', borderRadius: '4px 4px 0 0', transition: 'height 0.6s ease',
                height: `${(d.withdrawals / max) * 96}px`, opacity: 0.6 }}
            />
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/stats`).then((r) => r.json()),
      fetch(`${API}/analytics/revenue-chart`).then((r) => r.json()),
      fetch(`${API}/analytics/user-growth`).then((r) => r.json()),
    ]).then(([s, chart, growth]) => {
      setStats(s);
      setChartData(chart);
      setUserGrowth(growth);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Loading latest data...</p>
        </div>
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="stat-card" style={{ height: 120, background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-elevated) 50%, var(--bg-card) 75%)', backgroundSize: '1000px 100%', animation: 'shimmer 2s infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: '👥', label: 'Total Users', value: stats?.users.total.toLocaleString() || '—',
      change: `+${stats?.users.newToday || 0} today`, changeColor: 'var(--success)',
      iconBg: 'var(--primary-glow)', iconColor: 'var(--primary)',
    },
    {
      icon: '💰', label: 'Total Revenue', value: `🪙 ${stats?.transactions.totalRevenue.toLocaleString() || '—'}`,
      change: `${stats?.transactions.pending || 0} pending`, changeColor: 'var(--warning)',
      iconBg: 'var(--success-bg)', iconColor: 'var(--success)',
    },
    {
      icon: '📈', label: 'Active Investments', value: stats?.investments.active.toLocaleString() || '—',
      change: `🪙 ${stats?.investments.totalInvested.toLocaleString() || 0} invested`, changeColor: 'var(--text-secondary)',
      iconBg: 'var(--warning-bg)', iconColor: 'var(--warning)',
    },
    {
      icon: '🪪', label: 'KYC Pending', value: stats?.kyc.pending.toLocaleString() || '—',
      change: 'Needs review', changeColor: 'var(--danger)',
      iconBg: 'var(--danger-bg)', iconColor: 'var(--danger)',
    },
    {
      icon: '🎮', label: 'Game Plays', value: stats?.games.totalPlays.toLocaleString() || '—',
      change: `🪙 ${stats?.games.rewardsGiven.toLocaleString() || 0} given`, changeColor: 'var(--purple)',
      iconBg: 'var(--purple-bg)', iconColor: 'var(--purple)',
    },
    {
      icon: '🟡', label: 'Coins Circulating', value: `🪙 ${stats?.coins.inCirculation.toLocaleString() || '—'}`,
      change: 'Total balance', changeColor: 'var(--text-muted)',
      iconBg: '#f59e0b20', iconColor: '#f59e0b',
    },
    {
      icon: '👤', label: 'Active Users', value: stats?.users.active.toLocaleString() || '—',
      change: `${stats?.users.total ? Math.round((stats.users.active / stats.users.total) * 100) : 0}% active rate`,
      changeColor: 'var(--success)', iconBg: 'var(--success-bg)', iconColor: 'var(--success)',
    },
    {
      icon: '💳', label: 'Pending Txns', value: stats?.transactions.pending.toLocaleString() || '—',
      change: 'Awaiting approval', changeColor: 'var(--warning)',
      iconBg: 'var(--warning-bg)', iconColor: 'var(--warning)',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Real-time platform metrics and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-icon" style={{ background: s.iconBg }}>
              <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
            </div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-change" style={{ color: s.changeColor }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Revenue Chart */}
        <div className="chart-wrap">
          <div className="chart-header">
            <h3 className="chart-title">Revenue This Week</h3>
            <div className="flex gap-3">
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--primary)', display: 'inline-block' }} />Deposits
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--danger)', display: 'inline-block' }} />Withdrawals
              </span>
            </div>
          </div>
          <MiniBarChart data={chartData} />
        </div>

        {/* User Growth */}
        <div className="chart-wrap">
          <div className="chart-header">
            <h3 className="chart-title">User Growth</h3>
            <span className="badge badge-success">+12% this month</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120, padding: '0 4px' }}>
            {userGrowth.map((d: any, i: number) => {
              const max = Math.max(...userGrowth.map((u: any) => u.users));
              return (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    style={{ width: '100%', background: i === userGrowth.length - 1 ? 'var(--primary)' : 'var(--border-medium)', borderRadius: '4px 4px 0 0',
                      height: `${(d.users / max) * 96}px`, transition: 'height 0.6s ease' }}
                  />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="chart-wrap">
        <div className="chart-header">
          <h3 className="chart-title">Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: '🪪 Review KYC', href: '/admin/kyc', badge: stats?.kyc.pending, badgeClass: 'badge-danger' },
            { label: '💳 Approve Transactions', href: '/admin/transactions', badge: stats?.transactions.pending, badgeClass: 'badge-warning' },
            { label: '📢 Send Notification', href: '/admin/notifications', badge: null, badgeClass: '' },
            { label: '📈 Manage Plans', href: '/admin/plans', badge: null, badgeClass: '' },
            { label: '🏆 View Leaderboard', href: '/admin/battle', badge: null, badgeClass: '' },
          ].map((a) => (
            <a key={a.label} href={a.href} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {a.label}
              {a.badge ? <span className={`badge ${a.badgeClass}`} style={{ padding: '2px 6px', fontSize: '0.65rem' }}>{a.badge}</span> : null}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
