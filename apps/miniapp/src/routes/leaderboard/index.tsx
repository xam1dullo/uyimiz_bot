import { useQuery } from '@tanstack/react-query';
import { getMembers } from '../../lib/api';
import { useStore } from '../../stores';

export default function LeaderboardPage() {
  const familyId = useStore((s) => s.familyId)!;
  const { data: members } = useQuery({
    queryKey: ['members', familyId],
    queryFn: () => getMembers(familyId), enabled: !!familyId,
  });
  const arr = ((members as unknown as any[]) ?? [])
    .sort((a: any, b: any) => (b.points ?? 0) - (a.points ?? 0));

  return (
    <div>
      <section className="screen-title">
        <h1>Reyting</h1>
      </section>

      {arr.length > 0 && (
        <section className="hero-card leader-hero" style={{ marginBottom: 18, textAlign: 'center' }}>
          <div className="icon icon-yellow icon-large" style={{ margin: '0 auto 14px' }}>👑</div>
          <h2>{arr[0]?.name}</h2>
          <p>{arr[0]?.points ?? 0} ball · Bu hafta 1-o'rin</p>
        </section>
      )}

      <div className="stack">
        {arr.length ? arr.map((m: any, i: number) => (
          <div key={m.id} className={i === 0 ? 'list-card' : 'list-card'}>
            <strong className="rank" style={{ width: 32, textAlign: 'center', color: 'var(--mint)', fontWeight: 950, fontSize: 18 }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </strong>
            <div className="meta">
              <strong>{m.name}</strong>
              <span>{m.role ?? 'member'}</span>
            </div>
            <strong style={{ fontWeight: 950, color: 'var(--mint)' }}>{m.points ?? 0}</strong>
          </div>
        )) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>Hali reyting yo'q</p>
        )}
      </div>
    </div>
  );
}
