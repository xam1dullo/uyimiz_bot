import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, completeTask } from '../../lib/api';
import { Card, Pill, Sheet, EmptyState, SkeletonCard, Check, Badge, StatCard } from '../../components/ui/premium';

export default function TasksPage() {
  const familyId = localStorage.getItem('familyId') ?? 'unknown';
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', familyId, filter],
    queryFn: () => getTasks(familyId, filter === 'all' ? undefined : 'pending'), enabled: !!familyId,
  });
  const addMutation = useMutation({
    mutationFn: (d: any) => createTask(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks', familyId] }); setShowAdd(false); setTitle(''); },
  });
  const completeMutation = useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] }),
  });

  const tasksArr = (tasks as unknown as any[]) ?? [];
  const done = tasksArr.filter((t: any) => t.status === 'completed').length;
  const active = tasksArr.length - done;

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <section className="screen-title">
        <p className="eyebrow">oilaviy</p>
        <h1>Vazifalar</h1>
        <div className="pills" style={{ marginTop: 12 }}>
          <Pill text={`Yangi (${active})`} active={filter === 'pending'} onClick={() => setFilter('pending')} />
          <Pill text="Bajarilgan" active={filter === 'all' && done > 0} onClick={() => setFilter('all')} />
          <Pill text="Filter" />
        </div>
      </section>

      {isLoading ? (
        <div className="stack">{Array.from({length:4}).map((_,i) => <SkeletonCard key={i} />)}</div>
      ) : tasksArr.length ? (
        <div className="stack">
          {tasksArr.map((t: any) => (
            <div key={t.id} className={`list-card${t.status === 'overdue' ? ' is-overdue' : ''}${t.status === 'completed' ? ' is-completed' : ''}`}>
              <Check done={t.status === 'completed'} onClick={() => t.status !== 'completed' && completeMutation.mutate(t.id)} />
              <div className="meta"><strong>{t.title}</strong><span>{t.points ?? 0} ball · {t.status === 'completed' ? 'Bajarildi' : 'Kutilmoqda'}</span></div>
              <Badge text={t.priority ?? 'M'} tone={t.status === 'completed' ? 'mint' : 'red'} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="📋" title="Vazifalar yo'q" action={<button className="button primary" onClick={() => setShowAdd(true)}>Birinchi vazifani qo'shish</button>} />
      )}

      <button className="fab" onClick={() => setShowAdd(true)}>+</button>

      {showAdd && (
        <Sheet title="Yangi vazifa" onClose={() => setShowAdd(false)}>
          <label style={{ display: 'grid', gap: 8, marginBottom: 14 }}>Sarlavha<input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Idishlarni yuvish" /></label>
          <button className="button primary full" onClick={() => title.trim() && addMutation.mutate({ familyId, title: title.trim(), priority: 'medium', points: 10 })}>✅ Yaratish</button>
        </Sheet>
      )}
    </div>
  );
}
