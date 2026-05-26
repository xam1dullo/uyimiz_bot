import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, completeTask } from '../../lib/api';

export default function TasksPage() {
  const familyId = localStorage.getItem('familyId') ?? 'unknown';
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', familyId, filter],
    queryFn: () => getTasks(familyId, filter === 'all' ? undefined : 'pending'),
    enabled: !!familyId,
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', familyId] });
      setShowAdd(false); setTitle('');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] }),
  });

  const stats = tasks?.length
    ? { total: tasks.length, done: tasks.filter((t: any) => t.status === 'completed').length }
    : { total: 0, done: 0 };

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="screen-title">
        <div className="eyebrow">oilaviy</div>
        <h1>Yumushlar</h1>
      </div>

      {/* ─── Stats ─── */}
      <div className="stats-grid" style={{ marginBottom: 18 }}>
        <div className="stat-card"><strong>{stats.total}</strong><span>Jami</span></div>
        <div className="stat-card"><strong>{stats.done}</strong><span>Bajarildi</span></div>
        <div className="stat-card" style={{ '--mint': 'var(--blue)' } as any}><strong>{stats.total - stats.done}</strong><span>Kutilmoqda</span></div>
      </div>

      {/* ─── Pills ─── */}
      <div className="pills" style={{ marginBottom: 14 }}>
        <button className={`pill${filter === 'pending' ? ' active' : ''}`} onClick={() => setFilter('pending')}>Faol</button>
        <button className={`pill${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>Barchasi</button>
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ minHeight: 40, padding: '9px 12px', fontSize: 13, borderRadius: 15, marginLeft: 'auto' }}>
          + Qo'shish
        </button>
      </div>

      {/* ─── Task List ─── */}
      {isLoading ? (
        <div className="stack">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton">
              <div style={{ width: 52, height: 52, borderRadius: 18, float: 'left', marginRight: 14 }} />
              <div style={{ width: '60%', height: 18, margin: '6px 0 12px' }} />
              <div style={{ width: '42%', height: 14 }} />
            </div>
          ))}
        </div>
      ) : tasks?.length ? (
        <div className="stack">
          {tasks.map((t: any) => (
            <div key={t.id} className={`list-card${t.status === 'overdue' ? ' is-overdue' : ''}${t.status === 'completed' ? ' is-completed' : ''}`}>
              <button
                className="check"
                style={{ border: '3px solid var(--mint)', borderRadius: '50%', width: 42, height: 42, display: 'grid', placeItems: 'center', background: t.status === 'completed' ? 'var(--mint)' : 'transparent', color: t.status === 'completed' ? 'white' : 'transparent', cursor: 'pointer', fontWeight: 950 }}
                onClick={() => t.status !== 'completed' && completeMutation.mutate(t.id)}
              >
                ✓
              </button>
              <div className="meta">
                <strong>{t.title}</strong>
                <span>{t.points ? `⭐ ${t.points} ball` : 'Yangi'} · {t.status === 'completed' ? 'Bajarildi' : 'Kutilmoqda'}</span>
              </div>
              <span className="badge" style={{ minWidth: 26, height: 26, borderRadius: 999, padding: '0 9px', display: 'inline-grid', placeItems: 'center', background: t.status === 'completed' ? 'var(--mint-soft)' : 'var(--red-soft)', color: t.status === 'completed' ? 'var(--mint)' : 'var(--red)', fontSize: 12, fontWeight: 950 }}>
                {t.priority ?? 'M'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon-box icon-mint" style={{ width: 76, height: 76, borderRadius: 28, fontSize: 30 }}>📋</div>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>Yumushlar yo'q</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ marginTop: 8 }}>
            Birinchi yumushni qo'shish
          </button>
        </div>
      )}

      {/* ─── Add Sheet ─── */}
      {showAdd && (
        <>
          <div className="scrim" onClick={() => setShowAdd(false)} />
          <div className="sheet">
            <div className="sheet__handle" />
            <div className="sheet__head">
              <h3>Yangi yumush</h3>
              <button onClick={() => setShowAdd(false)} className="btn-secondary" style={{ minHeight: 40, padding: '9px 12px', borderRadius: 15, fontSize: 13 }}>✕</button>
            </div>
            <label style={{ display: 'grid', gap: 8, color: 'var(--text)', fontWeight: 900, marginBottom: 14 }}>
              Nomi
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Idishlarni yuvish" />
            </label>
            <button
              className="btn-primary full"
              onClick={() => {
                if (!title.trim()) return;
                addMutation.mutate({ familyId, title: title.trim(), priority: 'medium', points: 10 });
              }}
            >
              Qo'shish
            </button>
          </div>
        </>
      )}
    </div>
  );
}
