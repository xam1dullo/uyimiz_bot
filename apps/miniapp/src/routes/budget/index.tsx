// ─── Budget Page (with Add form) ───
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBudgets, getBalance, apiClient } from '@/lib/api';
import { useFamilyId } from '@/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CATEGORIES = [
  '🍽️ Oziq-ovqat', '🏠 Uy-joy', '🚗 Transport', '💊 Sog\'liq',
  '📚 Ta\'lim', '🎉 Ko\'ngilochar', '👔 Kiyim', '📦 Boshqa',
];

export function BudgetPage() {
  const familyId = useFamilyId();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const { data, isLoading } = useQuery({
    queryKey: ['budget', familyId],
    queryFn: () => getBudgets(familyId!),
    enabled: !!familyId,
  });

  const { data: report } = useQuery({
    queryKey: ['budget', familyId, 'balance'],
    queryFn: () => getBalance(familyId!),
    enabled: !!familyId,
  });

  const addMutation = useMutation({
    mutationFn: (payload: any) => apiClient.post('/budget/records', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', familyId] });
      queryClient.invalidateQueries({ queryKey: ['budget', familyId, 'balance'] });
      setShowAdd(false); setAmount(''); setNote('');
    },
  });

  const handleAdd = () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0) return;
    addMutation.mutate({ familyId, amount: amt, category, note, type });
  };

  if (!familyId) return <div className="p-6 text-center text-gray-500">Oilaga ulanmagan</div>;

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">💰 Byudjet</h1>
        <button onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {showAdd ? '❌' : '+ Qo\'shish'}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="rounded-xl border p-4 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${type === 'expense' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
              💸 Xarajat
            </button>
            <button onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${type === 'income' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              💵 Daromad
            </button>
          </div>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="Miqdor (UZS)" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="text" value={note} onChange={e => setNote(e.target.value)}
            placeholder="Izoh (ixtiyoriy)" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button onClick={handleAdd}
            disabled={addMutation.isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium">
            {addMutation.isPending ? 'Saqlanmoqda...' : '✅ Saqlash'}
          </button>
          {addMutation.isError && <p className="text-red-500 text-xs">Xatolik yuz berdi</p>}
        </div>
      )}

      {/* Chart */}
      {report?.categories?.length ? (
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold mb-2">Bu oy xarajatlari</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={report.categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="amount" fill="#4f46e5" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">Bu oy xarajatlar yo'q</p>
      )}

      {/* Records */}
      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {data?.data?.slice(0, 20).map((r: any) => (
            <div key={r.id} className="rounded-xl border p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{r.category}</p>
                <p className="text-xs text-gray-400">{r.note || r.createdAt?.slice(0, 10)}</p>
              </div>
              <p className={`font-semibold text-sm ${r.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                {r.type === 'expense' ? '-' : '+'}{r.amount?.toLocaleString()} UZS
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
