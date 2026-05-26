import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiClient, getBalance, getBudgets, type BudgetRecordDto } from '@/lib/api';
import { useFamilyId } from '@/hooks';
import {
  AppShell,
  EmptyState,
  FloatingActionButton,
  FloatingSheet,
  ListCard,
  PremiumCard,
  PrimaryButton,
  SecondaryButton,
  SegmentedControl,
  SkeletonList,
  StatCard,
  StatusPill,
} from '@/components/app/premium';
import { triggerNotification } from '@/components/app/telegram-theme';

const CATEGORIES = [
  'Oziq-ovqat',
  'Uy-joy',
  'Transport',
  "Sog'liq",
  "Ta'lim",
  "Ko'ngilochar",
  'Kiyim',
  'Boshqa',
] as const;

type BudgetType = 'expense' | 'income';

interface AddBudgetPayload {
  familyId: string;
  amount: number;
  category: string;
  note: string;
  type: BudgetType;
}

function formatMoney(value?: number) {
  return `${(value ?? 0).toLocaleString('uz-UZ')} UZS`;
}

function recordTitle(record: BudgetRecordDto) {
  return record.category ?? record.categoryId ?? 'Byudjet yozuvi';
}

function recordSubtitle(record: BudgetRecordDto) {
  return record.note ?? record.description ?? record.txDate?.slice(0, 10) ?? record.createdAt?.slice(0, 10) ?? 'Bugun';
}

export function BudgetPage() {
  const familyId = useFamilyId();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [type, setType] = useState<BudgetType>('expense');

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
    mutationFn: (payload: AddBudgetPayload) => apiClient.post('/budget/records', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', familyId] });
      queryClient.invalidateQueries({ queryKey: ['budget', familyId, 'balance'] });
      setShowAdd(false);
      setAmount('');
      setNote('');
      triggerNotification('success');
    },
    onError: () => triggerNotification('error'),
  });

  const handleAdd = () => {
    const parsedAmount = Number.parseInt(amount, 10);
    if (!familyId || !parsedAmount || parsedAmount <= 0) {
      return;
    }

    addMutation.mutate({ familyId, amount: parsedAmount, category, note, type });
  };

  const records = data?.data ?? [];
  const chartData = useMemo(
    () =>
      report?.categories?.map((item) => ({
        name: item.name ?? item.category ?? 'Boshqa',
        amount: item.amount ?? 0,
      })) ?? [],
    [report?.categories],
  );

  if (!familyId) {
    return (
      <AppShell eyebrow="Byudjet" title="Oilaga ulanmagan" description="Byudjet oilaviy kontekst ochilgandan keyin ishlaydi.">
        <EmptyState icon="wallet" title="Family context yo'q" description="Bot orqali oilaga qo'shiling yoki yangi oila yarating." />
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Moliyaviy yozuvlar"
      title="Byudjet"
      description="Daromad, xarajat va kategoriya hisobotlari."
      actions={<SecondaryButton onClick={() => setShowAdd(true)}>Qo'shish</SecondaryButton>}
      fab={<FloatingActionButton label="Byudjet yozuvi qo'shish" onClick={() => setShowAdd(true)} />}
    >
      <PremiumCard tone="mint">
        <div className="stats-grid">
          <StatCard value={formatMoney(report?.income)} label="Daromad" tone="mint" />
          <StatCard value={formatMoney(report?.expense)} label="Xarajat" tone="red" />
          <StatCard value={formatMoney(report?.balance)} label="Balans" tone="blue" />
        </div>
      </PremiumCard>

      {chartData.length ? (
        <PremiumCard>
          <section className="section-head mt-0">
            <h2>Bu oy xarajatlari</h2>
          </section>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-line)" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="amount" fill="var(--app-primary)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>
      ) : null}

      <section className="section-head">
        <h2>Yozuvlar</h2>
        <StatusPill tone="blue">{records.length}</StatusPill>
      </section>

      {isLoading ? (
        <SkeletonList count={3} />
      ) : records.length ? (
        <div className="stack">
          {records.slice(0, 20).map((record) => {
            const isExpense = record.type === 'expense';

            return (
              <ListCard
                key={record.id}
                icon="wallet"
                title={recordTitle(record)}
                subtitle={recordSubtitle(record)}
                tone={isExpense ? 'red' : 'mint'}
                action={
                  <span className={`amount ${isExpense ? 'amount--expense' : ''}`}>
                    {isExpense ? '-' : '+'}
                    {formatMoney(record.amount)}
                  </span>
                }
              />
            );
          })}
        </div>
      ) : (
        <EmptyState icon="wallet" title="Yozuvlar yo'q" description="Birinchi xarajat yoki daromad yozuvini qo'shing." />
      )}

      <FloatingSheet
        open={showAdd}
        title="Byudjet yozuvi"
        description="Miqdor, tur va kategoriya kiriting."
        onClose={() => setShowAdd(false)}
      >
        <div className="sheet-form">
          <SegmentedControl
            label="Yozuv turi"
            value={type}
            onChange={setType}
            options={[
              { value: 'expense', label: 'Xarajat' },
              { value: 'income', label: 'Daromad' },
            ]}
          />
          <label className="form-label">
            Miqdor
            <input
              className="input"
              inputMode="numeric"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="285000"
            />
          </label>
          <label className="form-label">
            Kategoriya
            <select className="input" value={category} onChange={(event) => setCategory(event.target.value as (typeof CATEGORIES)[number])}>
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Izoh
            <input className="input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ixtiyoriy" />
          </label>
          <PrimaryButton onClick={handleAdd} disabled={addMutation.isPending}>
            {addMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
          </PrimaryButton>
          {addMutation.isError ? <StatusPill tone="red">Xatolik yuz berdi</StatusPill> : null}
        </div>
      </FloatingSheet>
    </AppShell>
  );
}
