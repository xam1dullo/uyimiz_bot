import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, getBirthdays, type BirthdayDto } from '@/lib/api';
import { useFamilyId } from '@/hooks';
import {
  AppShell,
  EmptyState,
  FloatingActionButton,
  FloatingSheet,
  ListCard,
  PremiumCard,
  PrimaryButton,
  SkeletonList,
  StatusPill,
} from '@/components/app/premium';
import { triggerNotification } from '@/components/app/telegram-theme';

const MONTHS = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
] as const;

interface AddBirthdayPayload {
  familyId: string;
  name: string;
  date: {
    day: number;
    month: number;
  };
  relation: string;
}

function getBirthdayMonth(birthday: BirthdayDto) {
  if (typeof birthday.month === 'number') {
    return birthday.month;
  }

  if (birthday.date) {
    const parsed = new Date(birthday.date);
    return Number.isNaN(parsed.getTime()) ? 1 : parsed.getMonth() + 1;
  }

  return 1;
}

function getBirthdayDay(birthday: BirthdayDto) {
  if (typeof birthday.day === 'number') {
    return birthday.day;
  }

  if (birthday.date) {
    const parsed = new Date(birthday.date);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.getDate();
  }

  return undefined;
}

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
    queryFn: () => getBirthdays(familyId!),
    enabled: !!familyId,
  });

  const addMutation = useMutation({
    mutationFn: (payload: AddBirthdayPayload) => apiClient.post('/birthdays', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdays', familyId] });
      setShowAdd(false);
      setName('');
      setDay('');
      setRelation('');
      triggerNotification('success');
    },
    onError: () => triggerNotification('error'),
  });

  const handleAdd = () => {
    const parsedDay = Number.parseInt(day, 10);
    const parsedMonth = Number.parseInt(month, 10);

    if (!familyId || !name.trim() || !parsedDay) {
      return;
    }

    addMutation.mutate({
      familyId,
      name: name.trim(),
      date: { day: parsedDay, month: parsedMonth },
      relation,
    });
  };

  const birthdays = data?.data ?? [];
  const grouped = useMemo(() => {
    return birthdays.reduce<Record<number, BirthdayDto[]>>((acc, birthday) => {
      const birthdayMonth = getBirthdayMonth(birthday);
      acc[birthdayMonth] = [...(acc[birthdayMonth] ?? []), birthday];
      return acc;
    }, {});
  }, [birthdays]);

  if (!familyId) {
    return (
      <AppShell eyebrow="Sanalar" title="Oilaga ulanmagan" description="Tug'ilgan kunlar family context bilan ishlaydi.">
        <EmptyState icon="gift" title="Family context yo'q" description="Bot orqali oilaga qo'shiling yoki yangi oila yarating." />
      </AppShell>
    );
  }

  const nextBirthday = birthdays[0];

  return (
    <AppShell
      eyebrow="Oilaviy sanalar"
      title="Tug'ilgan kunlar"
      description="Yaqin tug'ilgan kunlar va munosabatlar."
      fab={<FloatingActionButton label="Tug'ilgan kun qo'shish" onClick={() => setShowAdd(true)} icon="gift" />}
    >
      {nextBirthday ? (
        <PremiumCard tone="yellow">
          <div className="row">
            <div>
              <p className="eyebrow">Yaqin sana</p>
              <h2>{nextBirthday.name}</h2>
              <p>
                {getBirthdayDay(nextBirthday) ?? '—'}-{MONTHS[getBirthdayMonth(nextBirthday) - 1]} ·{' '}
                {nextBirthday.relation ?? 'Oila'}
              </p>
            </div>
            <StatusPill tone="yellow">Soon</StatusPill>
          </div>
        </PremiumCard>
      ) : null}

      {isLoading ? (
        <SkeletonList count={3} />
      ) : birthdays.length ? (
        <div className="stack">
          {Object.entries(grouped)
            .sort(([a], [b]) => Number.parseInt(a, 10) - Number.parseInt(b, 10))
            .map(([monthNumber, items]) => (
              <section key={monthNumber}>
                <div className="section-head">
                  <h2>{MONTHS[Number.parseInt(monthNumber, 10) - 1]}</h2>
                  <StatusPill tone="purple">{items.length}</StatusPill>
                </div>
                <div className="stack">
                  {items.map((birthday, index) => (
                    <ListCard
                      key={birthday.id ?? `${birthday.name}-${index}`}
                      icon="gift"
                      title={birthday.name}
                      subtitle={birthday.relation ?? 'Oila'}
                      tone="yellow"
                      action={<StatusPill tone="yellow">{getBirthdayDay(birthday) ?? '—'}</StatusPill>}
                    />
                  ))}
                </div>
              </section>
            ))}
        </div>
      ) : (
        <EmptyState icon="gift" title="Sanalar yo'q" description="Birinchi tug'ilgan kunni qo'shing." />
      )}

      <FloatingSheet
        open={showAdd}
        title="Tug'ilgan kun"
        description="Ism, sana va munosabatni kiriting."
        onClose={() => setShowAdd(false)}
      >
        <div className="sheet-form">
          <label className="form-label">
            Ism
            <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Jasur Karimov" />
          </label>
          <div className="form-grid">
            <label className="form-label">
              Kun
              <input
                className="input"
                inputMode="numeric"
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={(event) => setDay(event.target.value)}
                placeholder="12"
              />
            </label>
            <label className="form-label">
              Oy
              <select className="input" value={month} onChange={(event) => setMonth(event.target.value)}>
                {MONTHS.map((item, index) => (
                  <option key={item} value={index + 1}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="form-label">
            Munosabat
            <input className="input" value={relation} onChange={(event) => setRelation(event.target.value)} placeholder="Ota, ona, do'st..." />
          </label>
          <PrimaryButton onClick={handleAdd} disabled={addMutation.isPending}>
            {addMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
          </PrimaryButton>
        </div>
      </FloatingSheet>
    </AppShell>
  );
}
