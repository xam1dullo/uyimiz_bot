// ─── Budget Page ───
import { useQuery } from '@tanstack/react-query';
import { getBudgets, getBudgetReport } from '@/lib/api';
import { useFamilyId } from '@/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function BudgetPage() {
  const familyId = useFamilyId();

  const { data, isLoading } = useQuery({
    queryKey: ['budget', familyId],
    queryFn: () => getBudgets(familyId!),
    enabled: !!familyId,
  });

  const { data: report } = useQuery({
    queryKey: ['budget', familyId, 'report', 'month'],
    queryFn: () => getBudgetReport(familyId!, 'month'),
    enabled: !!familyId,
  });

  if (!familyId) return <div className="p-6 text-center text-gray-500">Oilaga ulanmagan</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">💰 Byudjet</h1>

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
        <p className="text-sm text-gray-400">Bu oy xarajatlar yo'q</p>
      )}

      {/* Records */}
      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {data?.data?.slice(0, 10).map((r: any) => (
            <div key={r.id} className="rounded-xl border p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{r.category}</p>
                <p className="text-xs text-gray-400">{r.note ?? ''}</p>
              </div>
              <p className={`font-semibold ${r.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                {r.type === 'expense' ? '-' : '+'}{r.amount?.toLocaleString()} UZS
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
