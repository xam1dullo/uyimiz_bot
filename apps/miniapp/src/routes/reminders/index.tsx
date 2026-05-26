import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, getReminders } from '@/lib/api';
import { useFamilyId } from '@/hooks';
import {
  AppShell,
  EmptyState,
  FloatingActionButton,
  FloatingSheet,
  ListCard,
  PrimaryButton,
  SkeletonList,
  StatusPill,
} from '@/components/app/premium';
import { triggerNotification } from '@/components/app/telegram-theme';

interface CreateReminderPayload {
  familyId: string;
  title: string;
  text: string;
  remindAt: string;
}

function formatReminderDate(value?: string) {
  if (!value) {
    return 'Vaqt belgilanmagan';
  }

  return new Date(value).toLocaleString('uz-UZ', { dateStyle: 'medium', timeStyle: 'short' });
}

export function RemindersPage() {
  const familyId = useFamilyId();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [remindAt, setRemindAt] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reminders', familyId],
    queryFn: () => getReminders(familyId!),
    enabled: !!familyId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateReminderPayload) => apiClient.post('/reminders', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', familyId] });
      setShowCreate(false);
      setTitle('');
      setText('');
      setRemindAt('');
      triggerNotification('success');
    },
    onError: () => triggerNotification('error'),
  });

  const handleCreate = () => {
    if (!familyId || !title.trim() || !remindAt) {
      return;
    }

    createMutation.mutate({ familyId, title: title.trim(), text: text.trim(), remindAt });
  };

  if (!familyId) {
    return (
      <AppShell eyebrow="Eslatmalar" title="Oilaga ulanmagan" description="Eslatmalar family context bilan ishlaydi.">
        <EmptyState icon="bell" title="Family context yo'q" description="Bot orqali oilaga qo'shiling yoki yangi oila yarating." />
      </AppShell>
    );
  }

  const reminders = data?.data ?? [];

  return (
    <AppShell
      eyebrow="Scheduler"
      title="Eslatmalar"
      description="Telegram ichida vaqtli xabarlar va muhim ishlar."
      fab={<FloatingActionButton label="Yangi eslatma yaratish" onClick={() => setShowCreate(true)} icon="bell" />}
    >
      {isLoading ? (
        <SkeletonList count={3} />
      ) : reminders.length ? (
        <div className="stack">
          {reminders.map((reminder, index) => {
            const scheduledAt = reminder.remindAt ?? reminder.scheduledAt;

            return (
              <ListCard
                key={reminder.id}
                icon="bell"
                title={reminder.title}
                subtitle={reminder.text ?? reminder.description ?? formatReminderDate(scheduledAt)}
                tone={index === 0 ? 'yellow' : 'blue'}
                meta={reminder.text || reminder.description ? formatReminderDate(scheduledAt) : undefined}
                action={
                  <StatusPill tone={reminder.confirmedAt ? 'mint' : 'yellow'}>
                    {reminder.confirmedAt ? 'Qabul qilingan' : 'Kutilmoqda'}
                  </StatusPill>
                }
              />
            );
          })}
        </div>
      ) : (
        <EmptyState icon="bell" title="Eslatmalar yo'q" description="Muhim ishlar uchun birinchi eslatmani yarating." />
      )}

      <FloatingSheet
        open={showCreate}
        title="Eslatma qo'shish"
        description="Sarlavha, matn va vaqtni belgilang."
        onClose={() => setShowCreate(false)}
      >
        <div className="sheet-form">
          <label className="form-label">
            Sarlavha
            <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Bank to'lovi" />
          </label>
          <label className="form-label">
            Matn
            <textarea className="input" rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="Kartani to'ldirish kerak" />
          </label>
          <label className="form-label">
            Vaqt
            <input className="input" type="datetime-local" value={remindAt} onChange={(event) => setRemindAt(event.target.value)} />
          </label>
          <PrimaryButton onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saqlanmoqda...' : 'Yaratish'}
          </PrimaryButton>
        </div>
      </FloatingSheet>
    </AppShell>
  );
}
