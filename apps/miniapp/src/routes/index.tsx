import { useQuery } from '@tanstack/react-query';
import { getBalance, getTasks } from '../lib/api';
import { StatCard, Card, SkeletonCard, EmptyState } from '../components/ui/premium';

export default function Dashboard() {
  const familyId = localStorage.getItem('familyId') ?? 'unknown';
  
  const { data: balance } = useQuery({
    queryKey: ['balance', familyId],
    queryFn: () => getBalance(familyId), enabled: !!familyId,
  });
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', familyId, 'active'],
    queryFn: () => getTasks(familyId, 'active'), enabled: !!familyId,
  });

  const tasksArr = (tasks as unknown as any[]) ?? [];

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <section className="screen-title">
        <p className="eyebrow">oilangiz</p>
        <h1>Dashboard</h1>
      </section>

      <section className="hero-card balance-card" style={{ marginBottom: 18 }}>
        <div className="stats-grid">
          <StatCard value="{(balance ?? 0).toLocaleString()} UZS" label="Balans" />
          <StatCard value="+1.2M" label="Bu oy kirim" />
          <StatCard value="-800K" label="Bu oy chiqim" tone="danger" />
        </div>
      </section>

      <section className="section-head">
        <h2>Faol vazifalar</h2>
        <a href="/tasks" className="soft-link">Barchasi →</a>
      </section>

      {isLoading ? (
        <div className="stack">{Array.from({length:3}).map((_,i) => <SkeletonCard key={i} />)}</div>
      ) : tasksArr.length ? (
        <div className="stack">
          {tasksArr.map((t: any) => (
            <Card key={t.id} icon="📋" title={t.title} sub={`${t.points ?? 0} ball · ${t.status}`} tone={t.status==='overdue'?'red':'mint'} />
          ))}
        </div>
      ) : (
        <EmptyState icon="📋" title="Hozircha vazifalar yo'q" action={<a href="/tasks" className="button primary">Vazifa qo'shish</a>} />
      )}
    </div>
  );
}
