import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReminders, createReminder } from '../../lib/api';

export default function RemindersPage() {
  const familyId = localStorage.getItem('familyId') ?? 'unknown';
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const { data: reminders, isLoading } = useQuery({
    queryKey: ['reminders', familyId],
    queryFn: () => getReminders(familyId),
    enabled: !!familyId,
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => createReminder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', familyId] });
      setShowAdd(false); setTitle(''); setScheduledAt('');
    },
  });

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="screen-title">
        <div className="eyebrow">unutmaslik uchun</div>
        <h1>Eslatmalar</h1>
      </div>

      <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ minHeight: 40, padding: '9px 12px', fontSize: 13, borderRadius: 15, marginBottom: 18 }}>
        + Yangi eslatma
      </button>

      {isLoading ? (
        <div className="stack">
          {[1,2,3].map(i => <div key={i} className="skeleton"><div style={{ width: 52, height: 52, borderRadius: 18, float: 'left', marginRight: 14 }} /><div style={{ width: '60%', height: 18, margin: '6px 0 12px' }} /><div style={{ width: '42%', height: 14 }} /></div>)}
        </div>
      ) : reminders?.length ? (
        <div className="stack">
          {reminders.map((r: any) => (
            <div key={r.id} className={`list-card${!r.isActive ? ' is-completed' : ''}`}>
              <div className={`icon-box ${r.isActive ? 'icon-blue' : 'icon-mint'}`}>{r.isActive ? '🔔' : '🔕'}</div>
              <div className="meta">
                <strong>{r.title}</strong>
                <span>{new Date(r.scheduledAt).toLocaleString()} · {r.isActive ? 'Faol' : 'O\'chirilgan'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon-box icon-blue" style={{ width: 76, height: 76, borderRadius: 28, fontSize: 30 }}>🔔</div>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>Hozircha eslatmalar yo'q</p>
        </div>
      )}

      {showAdd && (
        <>
          <div className="scrim" onClick={() => setShowAdd(false)} />
          <div className="sheet">
            <div className="sheet__handle" />
            <div className="sheet__head">
              <h3>Yangi eslatma</h3>
              <button onClick={() => setShowAdd(false)} className="btn-secondary" style={{ minHeight: 40, padding: '9px 12px', borderRadius: 15, fontSize: 13 }}>✕</button>
            </div>
            <label style={{ display: 'grid', gap: 8, color: 'var(--text)', fontWeight: 900, marginBottom: 14 }}>
              Matn
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Dorini ichish" />
            </label>
            <label style={{ display: 'grid', gap: 8, color: 'var(--text)', fontWeight: 900, marginBottom: 14 }}>
              Vaqt
              <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="input" />
            </label>
            <button className="btn-primary full" onClick={() => addMutation.mutate({ familyId, title, scheduledAt, type: 'one_time', description: '' })}>
              Qo'shish
            </button>
          </div>
        </>
      )}
    </div>
  );
}
