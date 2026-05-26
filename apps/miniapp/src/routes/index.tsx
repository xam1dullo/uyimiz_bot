// ─── Dashboard Page ───
import { useQuery } from '@tanstack/react-query';
import { getBalance, getTasks } from '@/lib/api';
import { useFamilyId } from '@/hooks';

function useTgTheme() {
  try {
    const wp = (window as any).Telegram?.WebApp;
    return {
      buttonColor: wp?.themeParams?.button_color ?? '#4f46e5',
    };
  } catch {
    return { buttonColor: '#4f46e5' };
  }
}

export function DashboardPage() {
  const familyId = useFamilyId();
  const theme = useTgTheme();

  const { data: balance } = useQuery({
    queryKey: ['budget', familyId, 'balance'],
    queryFn: () => getBalance(familyId!),
    enabled: !!familyId,
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks', familyId, { status: 'active' }],
    queryFn: () => getTasks(familyId!, 'active'),
    enabled: !!familyId,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard', familyId, 'weekly'],
    queryFn: async () => ({ data: [] }), // leaderboard not yet implemented
    enabled: !!familyId,
  });

  if (!familyId) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold mb-2">Uyimiz</h1>
        <p className="text-gray-500">Iltimos, avval botda ro'yxatdan o'ting</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🏠 Boshqaruv paneli</h1>

      {/* Balance Card */}
      <div className="rounded-xl p-4 shadow-sm" style={{ background: theme.buttonColor }}>
        <p className="text-sm opacity-80">Oilaviy balans</p>
        <p className="text-2xl font-bold">
          {balance?.balance?.toLocaleString?.() ?? '0'} UZS
        </p>
      </div>

      {/* Active Tasks */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">📋 Faol vazifalar</h2>
        {tasks?.data?.length ? (
          <ul className="space-y-1">
            {tasks.data.slice(0, 5).map((t: any) => (
              <li key={t.id} className="text-sm flex justify-between">
                <span>{t.title}</span>
                <span className="text-gray-400">{t.assignedTo ?? '—'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Faol vazifalar yo'q</p>
        )}
      </div>

      {/* Leaderboard */}
      {leaderboard?.data?.length ? (
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold mb-2">🏆 Bu hafta liderlari</h2>
          <ol className="space-y-1">
            {leaderboard.data.slice(0, 5).map((u: any, i: number) => (
              <li key={i} className="text-sm flex justify-between">
                <span>{['🥇','🥈','🥉'][i] ?? `${i+1}.`} {u.name}</span>
                <span className="font-mono">{u.points} ball</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
