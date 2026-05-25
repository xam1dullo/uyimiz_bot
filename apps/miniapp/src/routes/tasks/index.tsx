// ─── Tasks Page (with Create form) ───
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, completeTask, apiClient } from '@/lib/api';
import { useFamilyId } from '@/hooks';

const TASK_CATEGORIES = ['🍽️ Oshxona', '🧹 Tozalash', '🛒 Xarid', '👶 Bola', '🔧 Ta\'mirlash', '📦 Boshqa'];

export function TasksPage() {
  const familyId = useFamilyId();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(TASK_CATEGORIES[0]);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', familyId, { status: statusFilter === 'all' ? undefined : statusFilter }],
    queryFn: () => getTasks(familyId!, statusFilter === 'all' ? undefined : statusFilter),
    enabled: !!familyId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => apiClient.post('/tasks', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', familyId] });
      setShowCreate(false); setTitle('');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', familyId] });
      const prev = queryClient.getQueryData(['tasks', familyId]);
      queryClient.setQueryData(['tasks', familyId], (old: any) => ({
        ...old,
        data: old?.data?.map((t: any) => t.id === taskId ? { ...t, status: 'done' } : t),
      }));
      return { prev };
    },
    onError: (_err, _taskId, context: any) => {
      queryClient.setQueryData(['tasks', familyId], context?.prev);
    },
  });

  const handleCreate = () => {
    if (!title.trim()) return;
    createMutation.mutate({ familyId, title: title.trim(), category });
  };

  if (!familyId) return <div className="p-6 text-center text-gray-500">Oilaga ulanmagan</div>;

  const tasks = data?.data ?? [];

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📋 Yumushlar</h1>
        <button onClick={() => setShowCreate(!showCreate)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {showCreate ? '❌' : '+ Yangi'}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Vazifa nomi" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm">
            {TASK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={handleCreate}
            disabled={createMutation.isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium">
            {createMutation.isPending ? 'Saqlanmoqda...' : '✅ Yaratish'}
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1">
        {['all', 'new', 'active', 'done'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
            }`}>
            {s === 'all' ? 'Hammasi' : s === 'new' ? 'Yangi' : s === 'active' ? 'Faol' : 'Bajarildi'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Vazifalar yo'q</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((t: any) => (
            <div key={t.id} className="rounded-xl border p-3 flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{t.title}</p>
                <p className="text-xs text-gray-400">{t.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  t.status === 'done' ? 'bg-green-100 text-green-700' :
                  t.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {t.status === 'done' ? '✓' : t.status === 'new' ? 'N' : 'A'}
                </span>
                {t.status !== 'done' && (
                  <button onClick={() => completeMutation.mutate(t.id)}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg">
                    ✓ Bajar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
