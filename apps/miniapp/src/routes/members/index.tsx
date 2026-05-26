import { useQuery } from '@tanstack/react-query';
import { getMembers } from '../../lib/api';
import { useStore } from '../../stores';

export default function MembersPage() {
  const familyId = useStore((s) => s.familyId)!;
  const { data: members, isLoading } = useQuery({
    queryKey: ['members', familyId],
    queryFn: () => getMembers(familyId), enabled: !!familyId,
  });
  const arr = (members as unknown as any[]) ?? [];

  return (
    <div>
      <section className="screen-title">
        <p className="eyebrow">oilangiz</p>
        <h1>A'zolar</h1>
      </section>
      <div className="stack">
        {isLoading
          ? Array.from({length:4}).map((_,i) => <div key={i} className="skeleton-card"><i /><b /><span /></div>)
          : arr.map((m: any) => (
            <div key={m.id} className="list-card">
              <div className="icon icon-mint">{m.name?.[0] ?? '?'}{m.name?.[1] ?? ''}</div>
              <div className="meta">
                <strong>{m.name}</strong>
                <span>{m.role ?? 'member'}{m.email ? ` · ${m.email}` : ''}</span>
              </div>
              <span className="badge">{m.role === 'owner' ? 'Admin' : m.role}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
