'use client';
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

export default function SettingsPage() {
  const [welcomeBonus, setWelcomeBonus] = useState<number>(1000);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await fetch(`${API}/admin/settings`).then(r => r.json());
      if (data && data.welcomeBonus !== undefined) {
        setWelcomeBonus(data.welcomeBonus);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/admin/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ welcomeBonus }),
      });
      if (res.ok) {
        setMessage({ text: 'System settings updated successfully! 🚀', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update system settings.', type: 'error' });
      }
    } catch (e: any) {
      setMessage({ text: e.message || 'An error occurred while saving.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-subtitle">Configure application settings and variables globally</p>
      </div>

      {loading ? (
        <div className="text-secondary">Loading configurations...</div>
      ) : (
        <div className="chart-wrap" style={{ padding: 24 }}>
          <h3 className="chart-title" style={{ marginBottom: 20 }}>General Configuration</h3>
          
          {message && (
            <div 
              style={{ 
                padding: '12px 16px', 
                borderRadius: 8, 
                marginBottom: 20, 
                fontSize: '0.875rem',
                fontWeight: 600,
                color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                background: message.type === 'success' ? 'var(--success)10' : 'var(--danger)10',
                border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}20`
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>
                New User Registration Welcome Bonus (Coins)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.25rem' }}>🪙</span>
                <input 
                  className="form-input" 
                  type="number" 
                  style={{ maxWidth: 200, fontSize: '1.1rem', fontWeight: 700 }}
                  value={welcomeBonus}
                  onChange={(e) => setWelcomeBonus(Math.max(0, +e.target.value))}
                  min="0"
                />
              </div>
              <p className="text-xs text-muted" style={{ marginTop: 8, lineHeight: 1.5 }}>
                When users register a new account through the mobile application, they will be given this number of coins automatically as a welcome reward.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {saving ? 'Saving...' : '💾 Save Configurations'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
