import { useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addBirthday, getBirthdays, type BirthdayDto, type CreateBirthdayInput } from '@/lib/api';
import { useFamilyId } from '@/hooks';
import {
  AppShell,
  EmptyState,
  FloatingActionButton,
  FloatingSheet,
  IconBadge,
  ListCard,
  PremiumCard,
  PrimaryButton,
  SegmentedControl,
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

const RELATION_OPTIONS = [
  { value: 'ota', label: 'Ota' },
  { value: 'ona', label: 'Ona' },
  { value: 'aka-opa', label: 'Aka/opa' },
  { value: 'dost', label: "Do'st" },
] as const;

const NOTIFY_OPTIONS = [7, 3, 1] as const;

type RelationOption = (typeof RELATION_OPTIONS)[number]['value'];

interface BirthdayDateParts {
  day?: number;
  month: number;
  year?: number;
}

function parseDateParts(value?: string): BirthdayDateParts | null {
  if (!value) {
    return null;
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (isoMatch) {
    return {
      year: Number.parseInt(isoMatch[1] ?? '', 10),
      month: Number.parseInt(isoMatch[2] ?? '', 10),
      day: Number.parseInt(isoMatch[3] ?? '', 10),
    };
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? null
    : { year: parsed.getFullYear(), month: parsed.getMonth() + 1, day: parsed.getDate() };
}

function getBirthdayParts(birthday: BirthdayDto): BirthdayDateParts {
  if (typeof birthday.day === 'number' && typeof birthday.month === 'number') {
    return { day: birthday.day, month: birthday.month };
  }

  return parseDateParts(birthday.birthDate ?? birthday.date) ?? { month: 1 };
}

function getBirthdayMonth(birthday: BirthdayDto) {
  return getBirthdayParts(birthday).month;
}

function monthName(month: number) {
  return MONTHS[month - 1] ?? MONTHS[0];
}

function getDaysUntilBirthday(birthday: BirthdayDto) {
  const { day, month } = getBirthdayParts(birthday);

  if (!day) {
    return null;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextBirthday = new Date(now.getFullYear(), month - 1, day);

  if (nextBirthday < today) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  return Math.ceil((nextBirthday.getTime() - today.getTime()) / 86_400_000);
}

function formatDaysLeft(days: number | null) {
  if (days === null) {
    return 'Yaqinda';
  }

  if (days === 0) {
    return 'Bugun';
  }

  if (days === 1) {
    return 'Ertaga';
  }

  return `${days} kun qoldi`;
}

function formatBirthdayDate(birthday: BirthdayDto) {
  const { day, month } = getBirthdayParts(birthday);
  return `${day ?? '—'}-${monthName(month).toLowerCase()}`;
}

function formatBirthdayAge(birthday: BirthdayDto) {
  const { day, month, year } = getBirthdayParts(birthday);

  if (!day || !year) {
    return birthday.relation ?? 'Oila';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextBirthday = new Date(now.getFullYear(), month - 1, day);
  const nextBirthdayYear = nextBirthday < today ? now.getFullYear() + 1 : now.getFullYear();

  return `${nextBirthdayYear - year} yosh bo'ladi`;
}

function buildBirthDate(day: number, month: number, year: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function BirthdaysPage() {
  const familyId = useFamilyId();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('');
  const [relation, setRelation] = useState<RelationOption>('ota');
  const [notifyDays, setNotifyDays] = useState<number[]>([7, 3, 1]);

  const { data, isLoading } = useQuery({
    queryKey: ['birthdays', familyId],
    queryFn: () => getBirthdays(familyId!),
    enabled: !!familyId,
  });

  const addMutation = useMutation({
    mutationFn: (payload: CreateBirthdayInput) => addBirthday(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdays', familyId] });
      setShowAdd(false);
      setName('');
      setDay('');
      setMonth('1');
      setYear('');
      setRelation('ota');
      setNotifyDays([7, 3, 1]);
      triggerNotification('success');
    },
    onError: () => triggerNotification('error'),
  });

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedDay = Number.parseInt(day, 10);
    const parsedMonth = Number.parseInt(month, 10);
    const parsedYear = Number.parseInt(year, 10);

    if (!familyId || !name.trim() || !parsedDay || !parsedMonth || !parsedYear) {
      return;
    }

    addMutation.mutate({
      familyId,
      name: name.trim(),
      birthDate: buildBirthDate(parsedDay, parsedMonth, parsedYear),
      notifyDaysBefore: notifyDays.length ? notifyDays : [1],
    });
  };

  const toggleNotifyDay = (value: number) => {
    setNotifyDays((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value].sort((first, second) => second - first),
    );
  };

  const birthdays = data?.data ?? [];
  const sortedBirthdays = useMemo(
    () =>
      [...birthdays].sort((first, second) => {
        const firstDays = getDaysUntilBirthday(first) ?? Number.POSITIVE_INFINITY;
        const secondDays = getDaysUntilBirthday(second) ?? Number.POSITIVE_INFINITY;
        return firstDays - secondDays;
      }),
    [birthdays],
  );
  const grouped = useMemo(() => {
    return sortedBirthdays.reduce<Record<number, BirthdayDto[]>>((acc, birthday) => {
      const birthdayMonth = getBirthdayMonth(birthday);
      acc[birthdayMonth] = [...(acc[birthdayMonth] ?? []), birthday];
      return acc;
    }, {});
  }, [sortedBirthdays]);

  if (!familyId) {
    return (
      <AppShell eyebrow="Sanalar" title="Oilaga ulanmagan" description="Tug'ilgan kunlar family context bilan ishlaydi.">
        <EmptyState icon="gift" title="Family context yo'q" description="Bot orqali oilaga qo'shiling yoki yangi oila yarating." />
      </AppShell>
    );
  }

  const nextBirthday = sortedBirthdays[0];

  return (
    <AppShell
      title="Tug'ilgan kunlar"
      fab={<FloatingActionButton label="Tug'ilgan kun qo'shish" onClick={() => setShowAdd(true)} />}
    >
      {nextBirthday ? (
        <PremiumCard className="hero-card" tone="yellow">
          <div className="row">
            <IconBadge icon="gift" tone="yellow" />
            <div className="list-card__body">
              <strong>{formatDaysLeft(getDaysUntilBirthday(nextBirthday))}</strong>
              <span>
                {nextBirthday.name} · {formatBirthdayDate(nextBirthday)} · {formatBirthdayAge(nextBirthday)}
              </span>
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
                  <h2>{monthName(Number.parseInt(monthNumber, 10)).toUpperCase()}</h2>
                </div>
                <div className="stack">
                  {items.map((birthday, index) => (
                    <ListCard
                      key={birthday.id ?? `${birthday.name}-${index}`}
                      icon="gift"
                      title={birthday.name}
                      subtitle={`${formatBirthdayDate(birthday)} · ${birthday.relation ?? 'Oila'} · ${formatBirthdayAge(birthday)}`}
                      tone="yellow"
                      action={<strong>{formatDaysLeft(getDaysUntilBirthday(birthday))}</strong>}
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
        title="Tug'ilgan kun qo'shish"
        onClose={() => setShowAdd(false)}
      >
        <form className="sheet-form" onSubmit={handleAdd}>
          <label className="form-label" htmlFor="birthday-name">
            Ism
            <input
              id="birthday-name"
              name="name"
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jasur Karimov"
              autoComplete="name"
              required
            />
          </label>
          <div className="form-label">
            Kim?
            <SegmentedControl label="Munosabat" value={relation} onChange={setRelation} options={RELATION_OPTIONS} />
          </div>
          <div className="form-grid three-grid">
            <label className="form-label" htmlFor="birthday-day">
              Kun
              <input
                id="birthday-day"
                name="day"
                className="input"
                inputMode="numeric"
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={(event) => setDay(event.target.value)}
                placeholder="12"
                required
              />
            </label>
            <label className="form-label" htmlFor="birthday-month">
              Oy
              <select id="birthday-month" name="month" className="input" value={month} onChange={(event) => setMonth(event.target.value)}>
                {MONTHS.map((item, index) => (
                  <option key={item} value={index + 1}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-label" htmlFor="birthday-year">
              Yil
              <input
                id="birthday-year"
                name="year"
                className="input"
                inputMode="numeric"
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="1988"
                required
              />
            </label>
          </div>
          <div className="form-label">
            Eslatish
            <div className="pills" role="group" aria-label="Eslatish kunlari">
              {NOTIFY_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`pill ${notifyDays.includes(item) ? 'is-active' : ''}`}
                  aria-pressed={notifyDays.includes(item)}
                  onClick={() => toggleNotifyDay(item)}
                >
                  {item} kun
                </button>
              ))}
            </div>
          </div>
          <PrimaryButton type="submit" disabled={addMutation.isPending}>
            {addMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
          </PrimaryButton>
        </form>
      </FloatingSheet>
    </AppShell>
  );
}
