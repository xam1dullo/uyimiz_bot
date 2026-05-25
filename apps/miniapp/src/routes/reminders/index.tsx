// ─── Reminders Page ───
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useFamilyId } from '@/hooks';

export function RemindersPage() {
  const familyId = useFamilyId();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [remindAt, setRemindAt] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reminders', familyId],
    queryFn: () => apiClient.get(`/reminders?familyId=${familyId}`).then(r => r.data),
    enabled: !!familyId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => apiClient.post('/reminders', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', familyId] });
      setShowCreate(false); setTitle(''); setText(''); setRemindAt('');
    },
  });

  const handleCreate = () => {
    if (!title.trim() || !remindAt) return;
    createMutation.mutate({ familyId, title: title.trim(), text: text.trim(), remindAt });
  };

  const reminders = data?.data ?? [];

  if (!familyId) return <div className="p-6 text-center text-gray-500">Oilaga ulanmagan</div>;

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🔔 Eslatmalar</h1>
        <button onClick={() => setShowCreate(!showCreate)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {showCreate ? '❌' : '+ Yangi'}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Sarlavha" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Matn" rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="datetime-local" value={remindAt} onChange={e => setRemindAt(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button onClick={handleCreate}
            disabled={createMutation.isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium">
            {createMutation.isPending ? 'Saqlanmoqda...' : '✅ Yaratish'}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : reminders.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Eslatmalar yo'q</p>
      ) : (
        <div className="space-y-2">
          {reminders.map((r: any) => (
            <div key={r.id} className="rounded-xl border p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{r.title}</p>
                  {r.text && <p className="text-xs text-gray-400 mt-0.5">{r.text}</p>}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {new Date(r.remindAt).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  r.confirmedAt ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {r.confirmedAt ? '✓ Qabul qilingan' : 'Kutilmoqda'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
