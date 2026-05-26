import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { getBalance, getTasks } from '../lib/api';

function StatCard({ value, label, type }: { value: string; label: string; type?: 'danger' }) {
  return (
    <div className="stat-card">
      <strong style={type === 'danger' ? { color: 'var(--red)' } : {}}>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ListCard({ title, subtitle, icon, status }: { title: string; subtitle: string; icon: string; status?: 'overdue' | 'completed' }) {
  return (
    <div className={`list-card${status === 'overdue' ? ' is-overdue' : ''}${status === 'completed' ? ' is-completed' : ''}`}>
      <div className="icon-box icon-mint">{icon}</div>
      <div className="meta">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const familyId = localStorage.getItem('familyId') ?? 'unknown';
  
  const { data: balance } = useQuery({
    queryKey: ['balance', familyId],
    queryFn: () => getBalance(familyId),
    enabled: !!familyId,
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', familyId, 'active'],
    queryFn: () => getTasks(familyId, 'active'),
    enabled: !!familyId,
  });

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="screen-title">
        <div className="eyebrow">oilangiz</div>
        <h1>Dashboard</h1>
      </div>

      {/* ─── Balance Hero ─── */}
      <div className="hero-card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div className="icon-box icon-mint" style={{ width: 60, height: 60, borderRadius: 24, fontSize: 26 }}>💰</div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 2 }}>balans</div>
            <strong style={{ fontSize: 32, fontWeight: 950, color: 'var(--mint)' }}>
              {(balance ?? 0).toLocaleString()} UZS
            </strong>
          </div>
        </div>
        <div className="stats-grid">
          <StatCard value="+500K" label="Kirim" />
          <StatCard value="-200K" label="Chiqim" type="danger" />
          <StatCard value="3/5" label="Bugun" />
        </div>
      </div>

      {/* ─── Tasks ─── */}
      <div className="section-head">
        <h3>Faol yumushlar</h3>
        <Link to="/tasks" className="soft-link" style={{ color: 'var(--mint)', fontWeight: 900, textDecoration: 'none' }}>
          Barchasi →
        </Link>
      </div>

      {isLoading ? (
        <div className="stack">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton">
              <div style={{ width: 52, height: 52, borderRadius: 18, float: 'left', marginRight: 14 }} />
              <div style={{ width: '60%', height: 18, margin: '6px 0 12px' }} />
              <div style={{ width: '42%', height: 14 }} />
            </div>
          ))}
        </div>
      ) : ((tasks as any)?.data ?? tasks ?? [])?.length ? (
        <div className="stack">
          {((tasks as any)?.data ?? tasks ?? []).map((t: any) => (
            <ListCard
              key={t.id}
              title={t.title}
              subtitle={t.status === 'completed' ? '✅ Bajarilgan' : '⏳ Kutilmoqda'}
              icon="📋"
              status={t.status === 'overdue' ? 'overdue' : t.status === 'completed' ? 'completed' : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon-box icon-mint" style={{ width: 76, height: 76, borderRadius: 28, fontSize: 30 }}>📋</div>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>Hozircha yumushlar yo'q</p>
          <Link to="/tasks" className="btn-primary" style={{ textDecoration: 'none', marginTop: 8 }}>
            Yumush qo'shish
          </Link>
        </div>
      )}
    </div>
  );
}
