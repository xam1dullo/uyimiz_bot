import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { getBalance, getTasks, type TaskDto } from '@/lib/api';
import { useFamilyId } from '@/hooks';
import {
  AppShell,
  EmptyState,
  IconBadge,
  ListCard,
  PremiumCard,
  SkeletonList,
  StatCard,
  StatusPill,
} from '@/components/app/premium';

function formatMoney(value?: number) {
  return `${(value ?? 0).toLocaleString('uz-UZ')} UZS`;
}

function taskSubtitle(task: TaskDto) {
  const parts = [task.assignedTo, task.category, task.priority].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'Oilaviy yumush';
}

function taskTone(task: TaskDto) {
  if (task.status === 'completed' || task.status === 'done') {
    return 'mint' as const;
  }

  if (task.priority === 'high' || task.priority === 'urgent') {
    return 'yellow' as const;
  }

  return 'purple' as const;
}

export function DashboardPage() {
  const familyId = useFamilyId();

  const { data: balance, isLoading: isBalanceLoading } = useQuery({
    queryKey: ['budget', familyId, 'balance'],
    queryFn: () => getBalance(familyId!),
    enabled: !!familyId,
  });

  const { data: tasksResponse, isLoading: areTasksLoading } = useQuery({
    queryKey: ['tasks', familyId, { status: 'active' }],
    queryFn: () => getTasks(familyId!, 'active'),
    enabled: !!familyId,
  });

  if (!familyId) {
    return (
      <AppShell
        eyebrow="Onboarding"
        title="Uyimiz"
        description="Mini App oilaga ulanganidan keyin dashboard ochiladi."
      >
        <EmptyState
          icon="home"
          title="Oilaga ulanmagan"
          description="Iltimos, avval bot orqali ro'yxatdan o'ting yoki invite link orqali oilaga qo'shiling."
        />
      </AppShell>
    );
  }

  const tasks = tasksResponse?.data ?? [];
  const activeTasks = tasks.slice(0, 4);

  return (
    <AppShell eyebrow="Bugun" title="Boshqaruv paneli" description="Oila ishlari, byudjet va eslatmalar bir joyda.">
      <PremiumCard tone="mint">
        <div className="row">
          <div>
            <p className="eyebrow">Bu oy</p>
            <h2>Oilaviy balans</h2>
          </div>
          <IconBadge icon="spark" tone="mint" />
        </div>
        <div className="stats-grid mt-4">
          <StatCard value={formatMoney(balance?.income)} label="Daromad" tone="mint" />
          <StatCard value={formatMoney(balance?.expense)} label="Xarajat" tone="red" />
          <StatCard value={formatMoney(balance?.balance)} label="Balans" tone="blue" />
        </div>
        {isBalanceLoading ? <p>Balans yangilanmoqda...</p> : null}
      </PremiumCard>

      <section className="section-head">
        <h2>Faol yumushlar</h2>
        <Link to="/tasks">{tasks.length} ta</Link>
      </section>

      {areTasksLoading ? (
        <SkeletonList count={3} />
      ) : activeTasks.length ? (
        <div className="stack">
          {activeTasks.map((task) => (
            <ListCard
              key={task.id}
              icon="tasks"
              title={task.title}
              subtitle={taskSubtitle(task)}
              tone={taskTone(task)}
              action={
                typeof task.points === 'number' ? (
                  <StatusPill tone="purple">+{task.points}</StatusPill>
                ) : null
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState icon="check" title="Faol yumush yo'q" description="Bugungi vazifalar bajarilgan yoki hali yaratilmagan." />
      )}

      <section className="section-head">
        <h2>Tezkor ko'rinish</h2>
      </section>
      <div className="grid-2">
        <PremiumCard tone="yellow">
          <IconBadge icon="bell" tone="yellow" />
          <h2 className="mt-4">Eslatmalar</h2>
          <p>Muhim vaqtlar va oilaviy xabarlar.</p>
        </PremiumCard>
        <PremiumCard tone="blue">
          <IconBadge icon="gift" tone="blue" />
          <h2 className="mt-4">Tug'ilgan kunlar</h2>
          <p>Yaqin sanalar nazoratda.</p>
        </PremiumCard>
      </div>
    </AppShell>
  );
}
