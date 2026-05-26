import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBalance, addBudgetRecord, getBudgetCategories } from '../../lib/api';
import { Card, StatCard, Sheet, Stepper, Pill, AmountInput, Keypad } from '../../components/ui/premium';

export default function BudgetPage() {
  const familyId = localStorage.getItem('familyId') ?? 'unknown';
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState<'type' | 'amount' | 'category' | 'final'>('type');
  const [addType, setAddType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('');

  const { data: balance } = useQuery({ queryKey: ['balance', familyId], queryFn: () => getBalance(familyId), enabled: !!familyId });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => getBudgetCategories() });

  const addMutation = useMutation({
    mutationFn: (p: any) => addBudgetRecord(p),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['balance', familyId] }); closeSheet(); },
  });

  const closeSheet = () => { setShowAdd(false); setStep('type'); setAmount(''); setNote(''); setSelectedCat(''); };

  const handleKeypad = (k: string) => {
    if (k === '⌫') setAmount(a => a.slice(0, -1));
    else if (k === '.') setAmount(a => a.includes('.') ? a : a + '.');
    else setAmount(a => a + k);
  };

  const cats = (categories as any[]) ?? [];
  const transactions = [
    { icon: '🛒', title: 'Oziq-ovqat', sub: 'Bugun, 12:30', amount: '-285 000', type: 'expense' },
    { icon: '💼', title: 'Maosh', sub: 'Bugun, 09:00', amount: '+3 500 000', type: 'income' },
    { icon: '🏠', title: 'Kommunal', sub: 'Kecha, 18:20', amount: '-540 000', type: 'expense' },
  ];

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <section className="screen-title">
        <p className="eyebrow">moliyaviy</p>
        <h1>Byudjet</h1>
        <div className="pills" style={{ marginTop: 12 }}>
          <Pill text="Hammasi" active />
          <Pill text="💚 Daromad" />
          <Pill text="🔴 Xarajat" />
        </div>
      </section>

      <section className="hero-card balance-card" style={{ marginBottom: 18 }}>
        <div className="stats-grid">
          <StatCard value={(balance ?? 0).toLocaleString()} label="Balans" />
          <StatCard value="+4.2M" label="Daromad" />
          <StatCard value="-2.8M" label="Xarajat" tone="danger" />
        </div>
      </section>

      <section className="section-head"><h2>Yozuvlar</h2></section>
      <div className="stack">
        {transactions.map((tx, i) => (
          <Card key={i} icon={tx.icon} title={tx.title} sub={tx.sub} tone={tx.type === 'expense' ? 'red' : 'mint'}
            after={<strong className={`amount ${tx.type === 'expense' ? 'minus' : 'plus'}`}>{tx.amount}</strong>} />
        ))}
      </div>

      <button className="fab" onClick={() => setShowAdd(true)}>+</button>

      {showAdd && (
        <Sheet title={step === 'type' ? "Nima qo'shmoqchisiz?" : step === 'amount' ? "Miqdor" : step === 'category' ? "Kategoriya" : "Yakunlash"} onClose={closeSheet}>
          <Stepper pct={step === 'type' ? 25 : step === 'amount' ? 50 : step === 'category' ? 75 : 100} />

          {step === 'type' && (
            <div className="two-grid">
              <button className="choice-card" onClick={() => { setAddType('expense'); setStep('amount'); }}>
                <div className="icon-box icon-red" style={{ width: 76, height: 76, borderRadius: 28, fontSize: 30 }}>💸</div>
                <h3>Xarajat</h3>
              </button>
              <button className="choice-card" onClick={() => { setAddType('income'); setStep('amount'); }}>
                <div className="icon-box icon-mint" style={{ width: 76, height: 76, borderRadius: 28, fontSize: 30 }}>💚</div>
                <h3>Daromad</h3>
              </button>
            </div>
          )}

          {step === 'amount' && (
            <>
              <AmountInput value={amount} onChange={setAmount} />
              <Keypad onPress={handleKeypad} />
              <button className="button primary full" onClick={() => setStep('category')}>Davom etish</button>
            </>
          )}

          {step === 'category' && (
            <>
              <div className="category-grid">
                {cats.slice(0, 6).map((c: any) => (
                  <button key={c.id} className="category-card" onClick={() => { setSelectedCat(c.id); setStep('final'); }}>
                    <span>{c.icon}</span>
                    <strong>{c.name}</strong>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'final' && (
            <>
              <label style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
                Izoh
                <textarea className="input" rows={3} value={note} onChange={e => setNote(e.target.value)} />
              </label>
              <button className="button primary full"
                onClick={() => addMutation.mutate({ familyId, type: addType, categoryId: selectedCat, amount: Number(amount), description: note || undefined })}>
                ✅ Saqlash
              </button>
            </>
          )}
        </Sheet>
      )}
    </div>
  );
}
