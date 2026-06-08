'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin/dashboard', icon: '📊' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'KYC Review', href: '/admin/kyc', icon: '🪪' },
  { label: 'Transactions', href: '/admin/transactions', icon: '💳' },
  { label: 'Plans', href: '/admin/plans', icon: '📈' },
  { label: 'Shares', href: '/admin/shares', icon: '🏢' },
  { label: 'Packages', href: '/admin/packages', icon: '📦' },
  { label: 'Games', href: '/admin/games', icon: '🎮' },
  { label: 'Battle', href: '/admin/battle', icon: '⚔️' },
  { label: 'Notifications', href: '/admin/notifications', icon: '🔔' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="nav-logo" style={{ fontSize: '1.2rem' }}>⟳ CoinVest</div>
        <div className="text-xs text-muted" style={{ marginTop: 2 }}>Admin Panel</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Main</div>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.75rem' }}>
            {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'SA'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{user?.name || 'Super Admin'}</div>
            <div className="text-xs text-muted">Administrator</div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') { setLoading(false); return; }
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    if (!token) { router.push('/admin/login'); return; }
    if (userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div className="text-secondary">Loading...</div>
    </div>
  );

  return (
    <div className="admin-layout">
      <Sidebar user={user} />
      <div className="main-content">
        <header className="topbar">
          <div>
            <div className="text-sm text-muted">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge badge-success">🟢 API Online</span>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.75rem', cursor: 'pointer' }}>
              {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'SA'}
            </div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
