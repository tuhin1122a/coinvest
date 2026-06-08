'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', body: '', userId: 'all' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(`${API}/notifications`).then(r => r.json()).then(setNotifications);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const endpoint = form.userId === 'all' ? 'broadcast' : 'send';
    const body = form.userId === 'all' ? { title: form.title, body: form.body } : form;
    await fetch(`${API}/notifications/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSent(true);
    setSending(false);
    setForm({ title: '', body: '', userId: 'all' });
    const updated = await fetch(`${API}/notifications`).then(r => r.json());
    setNotifications(updated);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <p className="page-subtitle">Send push notifications to users or broadcast to all</p>
      </div>

      <div className="grid-2">
        {/* Send Form */}
        <div className="chart-wrap">
          <h3 className="chart-title" style={{ marginBottom: 20 }}>📢 Send Notification</h3>
          <form onSubmit={handleSend}>
            <div className="form-group">
              <label className="form-label">Target</label>
              <select className="filter-select form-input" value={form.userId} onChange={(e) => setForm(p => ({ ...p, userId: e.target.value }))}>
                <option value="all">📢 Broadcast to All Users</option>
                <option value="u1">Alex Rahman (u1)</option>
                <option value="u2">Sara Ahmed (u2)</option>
                <option value="u3">Rahim Hossain (u3)</option>
                <option value="u4">Nadia Islam (u4)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" placeholder="Notification title..." value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Write your notification message..."
                value={form.body}
                onChange={(e) => setForm(p => ({ ...p, body: e.target.value }))}
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            {sent && (
              <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, color: 'var(--success)', fontSize: '0.875rem' }}>
                ✅ Notification sent successfully!
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={sending}>
              {sending ? '⌛ Sending...' : '📨 Send Notification'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="data-table-wrap" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div className="table-header"><h3 className="table-title">Recent Notifications</h3></div>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {notifications.map((n) => (
              <div key={n.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{n.title}</div>
                  <span className="badge badge-primary" style={{ fontSize: '0.65rem', flexShrink: 0 }}>
                    {n.userId === 'all' ? '📢 All' : `👤 ${n.userId}`}
                  </span>
                </div>
                <div className="text-sm text-secondary" style={{ marginBottom: 6 }}>{n.body}</div>
                <div className="text-xs text-muted">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
