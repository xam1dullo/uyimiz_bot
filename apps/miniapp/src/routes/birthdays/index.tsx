// ─── Birthdays Page ───
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useFamilyId } from '@/hooks';

const MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];

export function BirthdaysPage() {
  const familyId = useFamilyId();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('1');
  const [relation, setRelation] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['birthdays', familyId],
    queryFn: () => apiClient.get(`/birthdays?familyId=${familyId}`).then(r => r.data),
    enabled: !!familyId,
  });

  const addMutation = useMutation({
    mutationFn: (payload: any) => apiClient.post('/birthdays', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdays', familyId] });
      setShowAdd(false); setName(''); setDay(''); setRelation('');
    },
  });

  const handleAdd = () => {
    if (!name.trim() || !day) return;
    addMutation.mutate({ familyId, name: name.trim(), date: { day: parseInt(day), month: parseInt(month) }, relation });
  };

  const birthdays = data?.data ?? [];
  // Group by month
  const grouped: Record<number, any[]> = {};
  birthdays.forEach((b: any) => {
    const m = b.month ?? new Date(b.date).getMonth();
    if (!grouped[m]) grouped[m] = [];
    grouped[m].push(b);
  });

  if (!familyId) return <div className="p-6 text-center text-gray-500">Oilaga ulanmagan</div>;

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🎂 Tug'ilgan kunlar</h1>
        <button onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {showAdd ? '❌' : '+ Qo\'shish'}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="rounded-xl border p-4 space-y-3">
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Ism" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <input type="number" value={day} onChange={e => setDay(e.target.value)}
              placeholder="Kun" min={1} max={31} className="w-20 border rounded-lg px-3 py-2 text-sm" />
            <select value={month} onChange={e => setMonth(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm">
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <input type="text" value={relation} onChange={e => setRelation(e.target.value)}
            placeholder="Munosabat (ota, ona, do'st...)" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button onClick={handleAdd}
            disabled={addMutation.isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium">
            {addMutation.isPending ? 'Saqlanmoqda...' : '✅ Saqlash'}
          </button>
        </div>
      )}

      {/* Calendar-like list by month */}
      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : birthdays.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Hali tug'ilgan kun qo'shilmagan</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([monthNum, items]) => (
              <div key={monthNum}>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">{MONTHS[parseInt(monthNum) - 1]}</h3>
                <div className="space-y-1">
                  {items.map((b: any, i: number) => (
                    <div key={i} className="rounded-lg border p-2 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{b.name}</span>
                        {b.relation && <span className="text-gray-400 ml-1">· {b.relation}</span>}
                      </div>
                      <span className="text-gray-500 font-mono">{b.day ?? b.date?.slice(8, 10)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
