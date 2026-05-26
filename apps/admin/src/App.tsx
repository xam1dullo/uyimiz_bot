import { useState } from 'react';

function StatCard({ value, label, tone }: { value: string; label: string; tone?: string }) {
  return <div className={`stat-card${tone === 'danger' ? ' danger' : ''}`}><strong>{value}</strong><span>{label}</span></div>;
}

function Dashboard() {
  return (
    <div>
      <p className="eyebrow">admin panel</p>
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <StatCard value="24" label="Oilalar" />
        <StatCard value="156" label="Foydalanuvchilar" />
        <StatCard value="1.2K" label="Tranzaksiyalar" tone="danger" />
        <StatCard value="98%" label="Uptime" />
      </div>
      <div className="table-card">
        <table>
          <thead><tr><th>Oila</th><th>A'zolar</th><th>Balans</th><th>Status</th></tr></thead>
          <tbody>
            {[['Karimovlar', '4', '1.4M UZS', 'Faol'], ['Alimovlar', '3', '850K UZS', 'Faol'], ['Valiyevlar', '5', '2.1M UZS', 'Faol']].map(([n, m, b, s]) => (
              <tr key={n}><td style={{ fontWeight: 900 }}>{n}</td><td>{m}</td><td style={{ color: 'var(--mint)', fontWeight: 900 }}>{b}</td><td style={{ color: 'var(--mint)' }}>● {s}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<'dashboard' | 'families' | 'users' | 'logs' | 'settings'>('dashboard');
  const nav = ['dashboard', 'families', 'users', 'logs', 'settings'];

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 20px' }}>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        <span className="logo-mark" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: 'var(--mint)', fontWeight: 950 }}>
          <span style={{ width: 35, height: 35, display: 'grid', placeItems: 'center', borderRadius: 14, background: 'var(--mint)', color: 'white', fontWeight: 950 }}>u</span>
          @uyimiz admin
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {nav.map(p => (
            <button key={p} onClick={() => setPage(p as any)} style={{ padding: '11px 14px', borderRadius: 999, border: 'none', background: page === p ? 'var(--mint)' : 'transparent', color: page === p ? 'white' : 'var(--muted)', fontWeight: 850, cursor: 'pointer', textTransform: 'capitalize' }}>
              {p}
            </button>
          ))}
        </div>
      </nav>
      {page === 'dashboard' && <Dashboard />}
      {page !== 'dashboard' && <div className="card"><h2 style={{ textTransform: 'capitalize' }}>{page}</h2><p style={{ color: 'var(--muted)' }}>Coming soon</p></div>}
    </div>
  );
}
