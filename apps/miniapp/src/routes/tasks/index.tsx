import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiClient,
  completeTask,
  getTasks,
  type ApiListResponse,
  type TaskDto,
} from '@/lib/api';
import { useFamilyId } from '@/hooks';
import {
  AppShell,
  EmptyState,
  FloatingActionButton,
  FloatingSheet,
  ListCard,
  PrimaryButton,
  SegmentedControl,
  SkeletonList,
  StatusPill,
} from '@/components/app/premium';
import { triggerNotification } from '@/components/app/telegram-theme';

const TASK_CATEGORIES = ['Oshxona', 'Tozalash', 'Xarid', 'Bola', "Ta'mirlash", 'Boshqa'] as const;
const STATUS_FILTERS = [
  { value: 'all', label: 'Hammasi' },
  { value: 'new', label: 'Yangi' },
  { value: 'active', label: 'Faol' },
  { value: 'done', label: 'Bajarildi' },
] as const;

type TaskCategory = (typeof TASK_CATEGORIES)[number];
type StatusFilter = (typeof STATUS_FILTERS)[number]['value'];

interface CreateTaskPayload {
  familyId: string;
  title: string;
  category: TaskCategory;
}

interface MutationContext {
  previous?: ApiListResponse<TaskDto>;
}

function taskTone(task: TaskDto) {
  if (task.status === 'done' || task.status === 'completed') {
    return 'mint' as const;
  }

  if (task.priority === 'high' || task.priority === 'urgent') {
    return 'yellow' as const;
  }

  return 'purple' as const;
}

function statusLabel(status?: string) {
  if (status === 'done' || status === 'completed') {
    return 'Bajarildi';
  }

  if (status === 'new' || status === 'pending') {
    return 'Yangi';
  }

  return 'Faol';
}

export function TasksPage() {
  const familyId = useFamilyId();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TASK_CATEGORIES[0]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const tasksQueryKey = useMemo(
    () => ['tasks', familyId, { status: statusFilter === 'all' ? undefined : statusFilter }] as const,
    [familyId, statusFilter],
  );

  const { data, isLoading } = useQuery({
    queryKey: tasksQueryKey,
    queryFn: () => getTasks(familyId!, statusFilter === 'all' ? undefined : statusFilter),
    enabled: !!familyId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => apiClient.post('/tasks', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', familyId] });
      setShowCreate(false);
      setTitle('');
      triggerNotification('success');
    },
    onError: () => triggerNotification('error'),
  });

  const completeMutation = useMutation<void, Error, string, MutationContext>({
    mutationFn: async (taskId: string) => {
      await completeTask(taskId);
    },
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });
      const previous = queryClient.getQueryData<ApiListResponse<TaskDto>>(tasksQueryKey);
      queryClient.setQueryData<ApiListResponse<TaskDto>>(tasksQueryKey, (old) => ({
        data: old?.data?.map((task) => (task.id === taskId ? { ...task, status: 'done' } : task)) ?? [],
        meta: old?.meta,
      }));
      return { previous };
    },
    onError: (_error, _taskId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tasksQueryKey, context.previous);
      }
      triggerNotification('error');
    },
    onSuccess: () => triggerNotification('success'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] }),
  });

  const handleCreate = () => {
    if (!familyId || !title.trim()) {
      return;
    }

    createMutation.mutate({ familyId, title: title.trim(), category });
  };

  if (!familyId) {
    return (
      <AppShell eyebrow="Yumushlar" title="Oilaga ulanmagan" description="Yumushlar oilaviy kontekst bilan ochiladi.">
        <EmptyState icon="tasks" title="Family context yo'q" description="Bot orqali oilaga qo'shiling yoki yangi oila yarating." />
      </AppShell>
    );
  }

  const tasks = data?.data ?? [];

  return (
    <AppShell
      eyebrow="Yumushlar"
      title="Vazifalar"
      description="Kim nima qiladi, holati va ballari aniq ko'rinadi."
      fab={<FloatingActionButton label="Yangi vazifa yaratish" onClick={() => setShowCreate(true)} />}
    >
      <SegmentedControl label="Vazifa holati" value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTERS} />

      {isLoading ? (
        <SkeletonList count={4} />
      ) : tasks.length ? (
        <div className="stack">
          {tasks.map((task) => {
            const isDone = task.status === 'done' || task.status === 'completed';

            return (
              <ListCard
                key={task.id}
                icon="tasks"
                title={task.title}
                subtitle={task.category ?? task.description ?? 'Oilaviy yumush'}
                tone={taskTone(task)}
                completed={isDone}
                action={
                  <div className="list-card__action">
                    <StatusPill tone={isDone ? 'mint' : 'yellow'}>{statusLabel(task.status)}</StatusPill>
                    {!isDone ? (
                      <PrimaryButton onClick={() => completeMutation.mutate(task.id)} disabled={completeMutation.isPending}>
                        Bajar
                      </PrimaryButton>
                    ) : null}
                  </div>
                }
              />
            );
          })}
        </div>
      ) : (
        <EmptyState icon="check" title="Vazifalar yo'q" description="Yangi yumush yarating va oilaga taqsimlang." />
      )}

      <FloatingSheet
        open={showCreate}
        title="Yangi vazifa"
        description="Yumush nomi va kategoriyasini kiriting."
        onClose={() => setShowCreate(false)}
      >
        <div className="sheet-form">
          <label className="form-label">
            Vazifa nomi
            <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Uyni tozalash" />
          </label>
          <label className="form-label">
            Kategoriya
            <select className="input" value={category} onChange={(event) => setCategory(event.target.value as TaskCategory)}>
              {TASK_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <PrimaryButton onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saqlanmoqda...' : 'Yaratish'}
          </PrimaryButton>
        </div>
      </FloatingSheet>
    </AppShell>
  );
}
