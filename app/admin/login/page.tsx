'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@coinvest.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow" />
      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="nav-logo" style={{ fontSize: '1.8rem', marginBottom: 8 }}>⟳ CoinVest</div>
          <p className="text-secondary text-sm">Admin Control Panel</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@coinvest.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, color: 'var(--danger)', fontSize: '0.875rem' }}>
              ⚠ {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: 16, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? '⌛ Signing in...' : '🔐 Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 4 }}>
          <p className="text-xs text-muted">Demo credentials: admin@coinvest.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
