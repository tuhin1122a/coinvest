'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container flex items-center justify-between">
        <div className="nav-logo">⟳ CoinVest</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#plans">Plans</a></li>
          <li><a href="#games">Games</a></li>
          <li><a href="#stats">Stats</a></li>
        </ul>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary btn-sm">Download App</button>
        </div>
      </div>
    </nav>
  );
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="phone-wrap">
      <div className="phone-glow-ring" />
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-header">Good morning, Alex 👋</div>
          <div className="phone-balance-card">
            <div className="phone-balance-label">Total Coin Balance</div>
            <div className="phone-balance-amount">⟳ 125,000</div>
            <div className="phone-balance-gain">▲ +12.4% today · +5,330 coins</div>
          </div>
          <div className="phone-grid">
            {[['💰','Invest'],['👛','Wallet'],['🎡','Spin'],['⚔️','Battle']].map(([icon,label]) => (
              <div key={label} className="phone-grid-item">
                <div className="phone-grid-icon">{icon}</div>
                {label}
              </div>
            ))}
          </div>
          <div className="phone-mini-card" style={{color:'var(--text-secondary)'}}>
            <span style={{color:'var(--primary)',fontWeight:700,fontSize:9}}>💡 AI Insight</span>
            <br/>Lock 5,000 coins → +1,200 return by Sunday
          </div>
          <div className="phone-mini-card" style={{color:'var(--text-secondary)'}}>
            <span style={{color:'#f59e0b',fontWeight:700,fontSize:9}}>🔥 7-Day Streak!</span>
            <br/>Claim your daily reward
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
            {[['Gold','VIP'],['34.2%','Return']].map(([val,label]) => (
              <div key={label} className="phone-mini-card" style={{textAlign:'center'}}>
                <div style={{fontSize:11,fontWeight:800,color:'var(--primary)'}}>{val}</div>
                <div style={{fontSize:7,color:'var(--text-muted)'}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <span>🚀</span> Now live — 50K+ active investors
              </div>
              <h1 className="text-display hero-title">
                Invest Smart.<br />
                <span className="text-gradient">Win Big.</span><br />
                Have Fun.
              </h1>
              <p className="hero-desc">
                The gamified investment platform where your coins grow through AI-powered plans,
                epic battles, and exciting games. No experience required.
              </p>
              <div className="flex items-center gap-4">
                <button className="btn btn-primary btn-lg">
                  📱 Download App
                </button>
                <button 
                  className="btn btn-secondary btn-lg"
                  onClick={() => setShowVideoModal(true)}
                >
                  ▶ Watch Demo
                </button>
              </div>
              <div className="hero-stats">
                {[
                  { num: 50000, label: 'Active Users', suffix: '+' },
                  { num: 2400000, label: 'Coins in Circulation', suffix: '' },
                  { num: 34, label: 'Avg. Weekly Return', suffix: '%' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="hero-stat-num">
                      <Counter target={s.num} suffix={s.suffix} />
                    </div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ──────────────────────────────────────── */}
      <section id="stats" className="section-sm" style={{background:'var(--bg-card)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
        <div className="container">
          <div className="stats-grid">
            {[
              { num: 50000, suffix: '+', label: 'Registered Users' },
              { num: 98, suffix: '%', label: 'Uptime Guarantee' },
              { num: 12000000, suffix: '', label: 'Total Coins Traded' },
              { num: 4, suffix: '★', label: 'App Store Rating' },
            ].map((s) => (
              <div key={s.label} className="stat-item">
                <span className="stat-num"><Counter target={s.num} suffix={s.suffix} /></span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why CoinVest?</span>
            <h2 className="text-h1 section-title">Everything you need to grow</h2>
            <p className="section-desc">
              From smart investment plans to exciting games — CoinVest has it all packed into one beautiful app.
            </p>
          </div>
          <div className="grid-3">
            {[
              { icon: '📈', title: 'AI Investment Plans', desc: 'Smart algorithms suggest the best plans based on your risk appetite and coin balance.', color: '#e86c2c' },
              { icon: '🎡', title: 'Spin & Win Games', desc: 'Spin the wheel, scratch cards, and enter lucky draws to earn bonus coins daily.', color: '#a855f7' },
              { icon: '⚔️', title: 'Battle Arena', desc: 'Challenge other investors in head-to-head investment battles. Top performers win big.', color: '#ef4444' },
              { icon: '👑', title: 'VIP Tiers', desc: 'Unlock exclusive perks as you climb Bronze → Silver → Gold → Platinum tiers.', color: '#f59e0b' },
              { icon: '📊', title: 'Copy Trading', desc: 'Automatically mirror the moves of top-performing investors in real-time.', color: '#22c55e' },
              { icon: '🔒', title: 'Bank-Grade Security', desc: 'JWT auth, KYC verification, 2FA, and end-to-end encryption keep your coins safe.', color: '#3b82f6' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: `${f.color}15`, borderColor: `${f.color}30` }}>
                  <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
                </div>
                <h3 className="text-h3" style={{ marginBottom: 8 }}>{f.title}</h3>
                <p className="text-sm text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTMENT PLANS ─────────────────────────────────── */}
      <section id="plans" className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Investment Plans</span>
            <h2 className="text-h1 section-title">Choose your strategy</h2>
            <p className="section-desc">Three risk tiers designed for every investor profile.</p>
          </div>
          <div className="grid-3">
            {[
              { name: 'Safe Harbor', risk: 'Low Risk', return: '8–12%', duration: '7 days', min: '1,000', icon: '🛡️', color: '#22c55e', featured: false },
              { name: 'Growth Engine', risk: 'Medium Risk', return: '18–25%', duration: '7 days', min: '5,000', icon: '🔥', color: '#e86c2c', featured: true },
              { name: 'Rocket Fuel', risk: 'High Risk', return: '35–50%', duration: '7 days', min: '10,000', icon: '🚀', color: '#ef4444', featured: false },
            ].map((p) => (
              <div key={p.name} className={`plan-card ${p.featured ? 'featured' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: '1.8rem' }}>{p.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{p.name}</h3>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{p.risk}</span>
                  </div>
                </div>
                <div className="plan-return" style={{ color: p.color }}>
                  {p.return}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}> / week</span>
                </div>
                <div style={{ display: 'flex', gap: 24, margin: '16px 0', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Duration</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Min Coins</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>🪙 {p.min}</div>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: p.featured ? undefined : 'transparent', color: p.featured ? undefined : p.color, border: p.featured ? undefined : `1px solid ${p.color}30` }}>
                  Start Investing →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMES ─────────────────────────────────────────────── */}
      <section id="games" className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Mini Games</span>
            <h2 className="text-h1 section-title">Play & Earn Coins</h2>
            <p className="section-desc">Not just investing — we make it fun with daily games and rewards.</p>
          </div>
          <div className="grid-4">
            {[
              { icon: '🎡', name: 'Spin Wheel', desc: 'Spin daily for up to 1,000 coins', color: '#a855f7' },
              { icon: '🎴', name: 'Scratch Cards', desc: 'Reveal hidden prizes instantly', color: '#e86c2c' },
              { icon: '🎰', name: 'Lucky Draw', desc: 'Win jackpots up to 10,000 coins', color: '#f59e0b' },
              { icon: '🏆', name: 'Badge Shop', desc: 'Collect rare achievement badges', color: '#22c55e' },
            ].map((g) => (
              <div key={g.name} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>{g.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>{g.name}</h3>
                <p className="text-sm text-secondary">{g.desc}</p>
                <div style={{ marginTop: 16 }}>
                  <span className="badge" style={{ background: `${g.color}15`, color: g.color, border: `1px solid ${g.color}30` }}>
                    Play Now
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERBOARD TEASER ─────────────────────────────────── */}
      <section className="section-sm" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <span className="section-tag">⚔️ Battle Leaderboard</span>
              <h2 className="text-h1" style={{ margin: '12px 0 16px' }}>Top Investors<br />This Week</h2>
              <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 24 }}>
                Compete head-to-head with other investors. The best performers rise to the top and win exclusive rewards.
              </p>
              <button className="btn btn-primary">Join the Battle →</button>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {[
                { rank: 1, name: 'Rahim Hossain', coins: '210,000', tier: 'platinum', delta: '+42%' },
                { rank: 2, name: 'Priya Das', coins: '155,000', tier: 'gold', delta: '+34%' },
                { rank: 3, name: 'Alex Rahman', coins: '125,000', tier: 'gold', delta: '+28%' },
                { rank: 4, name: 'Sara Ahmed', coins: '89,500', tier: 'silver', delta: '+21%' },
                { rank: 5, name: 'Karim Uddin', coins: '67,000', tier: 'silver', delta: '+18%' },
              ].map((u) => (
                <div key={u.rank} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 28, fontWeight: 900, fontSize: u.rank <= 3 ? '1rem' : '0.85rem', color: u.rank === 1 ? '#f59e0b' : u.rank === 2 ? '#9ca3af' : u.rank === 3 ? '#c85010' : 'var(--text-muted)' }}>
                    {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank - 1] : `#${u.rank}`}
                  </div>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.65rem' }}>
                    {u.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🪙 {u.coins}</div>
                  </div>
                  <span className="badge badge-success">{u.delta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Testimonials</span>
            <h2 className="text-h1 section-title">Loved by investors</h2>
          </div>
          <div className="grid-3">
            {[
              { name: 'Tanvir C.', role: 'Gold Member · 30-day streak', quote: '"CoinVest changed how I think about saving. I\'ve earned 40,000 coins in 3 weeks just by using the Growth Engine plan!"', stars: 5 },
              { name: 'Nadia I.', role: 'Silver Member · Copy Trader', quote: '"The copy trading feature is genius. I just mirror top investors and my coins grow automatically. Best app I\'ve ever used."', stars: 5 },
              { name: 'Rahim H.', role: 'Platinum Member · Battle Legend', quote: '"I dominate the leaderboard every week. The battle system is so exciting — pure strategy and skill."', stars: 5 },
            ].map((t) => (
              <div key={t.name} className="card">
                <div style={{ fontSize: '1.2rem', marginBottom: 12 }}>{'⭐'.repeat(t.stars)}</div>
                <p className="text-sm text-secondary" style={{ lineHeight: 1.7, marginBottom: 16 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar">{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', padding: '60px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(232,108,44,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <span className="section-tag" style={{ position: 'relative' }}>📱 Download Now</span>
            <h2 className="text-h1" style={{ margin: '12px 0 16px', position: 'relative' }}>Start earning today</h2>
            <p className="text-secondary" style={{ maxWidth: 500, margin: '0 auto 32px', position: 'relative' }}>
              Join 50,000+ investors already growing their coins. Download CoinVest free on iOS and Android.
            </p>
            <div className="flex items-center justify-center gap-4" style={{ position: 'relative' }}>
              <button className="btn btn-primary btn-lg">🍎 App Store</button>
              <button className="btn btn-secondary btn-lg">🤖 Google Play</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="nav-logo" style={{ fontSize: '1.2rem', marginBottom: 12 }}>⟳ CoinVest</div>
              <p className="footer-brand-desc">
                The next-generation coin investment and gaming platform. Grow smarter, play harder, earn bigger.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Investment Plans', 'Games', 'Battle Arena', 'VIP Tiers'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="footer-title">{col.title}</h4>
                <ul className="footer-links">
                  {col.links.map((link) => (
                    <li key={link}><a href="#">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="text-xs text-muted">© 2024 CoinVest. All rights reserved.</p>
            <div className="flex gap-4">
              {['Twitter', 'Discord', 'Telegram', 'YouTube'].map((s) => (
                <a key={s} href="#" className="text-xs text-muted" style={{ transition: 'var(--transition)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}>
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── VIDEO MODAL ────────────────────────────────────────── */}
      {showVideoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 5, 8, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowVideoModal(false)}
        >
          <div 
            className="card animate-fadeInUp"
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '800px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 80px rgba(232,108,44,0.15)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 className="text-h3" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                ⟳ CoinVest Platform Overview
              </h3>
              <button 
                onClick={() => setShowVideoModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                ✕
              </button>
            </div>

            {/* Video Player wrapper */}
            <div 
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#000',
                border: '1px solid var(--border)',
              }}
            >
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-spinning-gold-coin-on-black-background-34293-large.mp4"
                poster="/demo_poster.png"
                controls
                autoPlay
                loop
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Footer details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <p className="text-xs text-muted">
                🎬 Intro Video: Real-time Coin Accrual & Investment Mechanics
              </p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowVideoModal(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
