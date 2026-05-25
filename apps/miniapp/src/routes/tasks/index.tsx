// ─── Tasks Page ───
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@/lib/api';
import { useFamilyId } from '@/hooks';

export function TasksPage() {
  const familyId = useFamilyId();

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', familyId],
    queryFn: () => getTasks(familyId!),
    enabled: !!familyId,
  });

  if (!familyId) return <div className="p-6 text-center text-gray-500">Oilaga ulanmagan</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📋 Yumushlar</h1>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {data?.data?.map((t: any) => (
            <div key={t.id} className="rounded-xl border p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{t.title}</p>
                <p className="text-xs text-gray-400">{t.category} · {t.assignedTo ?? '—'}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                t.status === 'done' ? 'bg-green-100 text-green-700' :
                t.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
