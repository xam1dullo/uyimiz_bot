import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../../lib/api';
import { useStore } from '../../stores';

export default function BudgetReportPage() {
  const familyId = useStore((s) => s.familyId)!;
  const { data: txs } = useQuery({
    queryKey: ['transactions', familyId],
    queryFn: () => getTransactions(familyId), enabled: !!familyId,
  });
  const arr = (txs as unknown as any[]) ?? [];

  const totalExpense = arr.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + (t.amount ?? 0), 0);
  const cats = arr.filter((t: any) => t.type === 'expense').reduce((acc: Record<string,number>, t: any) => {
    acc[t.category ?? t.categoryId ?? 'boshqa'] = (acc[t.category ?? t.categoryId ?? 'boshqa'] ?? 0) + (t.amount ?? 0);
    return acc;
  }, {});
  const entries = Object.entries(cats).sort(([,a],[,b]) => (b as number) - (a as number));

  return (
    <div>
      <section className="screen-title">
        <p className="eyebrow">moliyaviy</p>
        <h1>Hisobot</h1>
        <div className="pills">
          <button className="pill is-active">Bu oy</button>
          <button className="pill">O'tgan oy</button>
          <button className="pill">Haftali</button>
        </div>
      </section>

      <section className="hero-card" style={{ marginBottom: 18 }}>
        <div className="donut"><div><strong>{(totalExpense).toLocaleString()}</strong><span>Xarajat</span></div></div>
      </section>

      <section className="section-head"><h2>Kategoriyalar</h2></section>
      <div className="stack">
        {entries.length ? entries.slice(0, 6).map(([cat, amt], i) => {
          const pct = totalExpense ? Math.round(((amt as number) / totalExpense) * 100) : 0;
          return (
            <div key={cat} className="report-row">
              <div className="icon icon-blue">📊</div>
              <div className="meta">
                <strong>{cat}</strong>
                <span>{(amt as number).toLocaleString()} · {pct}%</span>
                <div className="progress"><i style={{ width: `${Math.min(pct, 100)}%` }} /></div>
              </div>
            </div>
          );
        }) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>Hozircha ma'lumot yo'q</p>
        )}
      </div>
    </div>
  );
}
