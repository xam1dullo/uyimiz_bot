import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBalance, addBudgetRecord, getBudgetCategories } from '../../lib/api';

export default function BudgetPage() {
  const familyId = localStorage.getItem('familyId') ?? 'unknown';
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCat, setSelectedCat] = useState<{ id: string; type: string } | null>(null);

  const { data: balance } = useQuery({
    queryKey: ['balance', familyId],
    queryFn: () => getBalance(familyId), enabled: !!familyId,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getBudgetCategories(),
  });

  const addMutation = useMutation({
    mutationFn: (payload: any) => addBudgetRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', familyId] });
      setShowAdd(false); setAmount(''); setNote(''); setSelectedCat(null);
    },
  });

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="screen-title">
        <div className="eyebrow">moliyaviy</div>
        <h1>Byudjet</h1>
      </div>

      {/* ─── Balance Hero ─── */}
      <div className="hero-card" style={{ marginBottom: 18 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="eyebrow">jami balans</div>
          <strong style={{ fontSize: 42, fontWeight: 950, color: 'var(--mint)', letterSpacing: '-1.5px' }}>
            {(balance ?? 0).toLocaleString()} UZS
          </strong>
        </div>
        <div className="stats-grid" style={{ marginTop: 18 }}>
          <div className="stat-card"><strong>+1.2M</strong><span>Bu oy kirim</span></div>
          <div className="stat-card" style={{ '--mint': 'var(--red)' } as any}><strong>-800K</strong><span>Bu oy chiqim</span></div>
          <div className="stat-card"><strong>3</strong><span>Kategoriya</span></div>
        </div>
      </div>

      {/* ─── Pills: Income/Expense ─── */}
      <div className="pills" style={{ marginBottom: 14 }}>
        <button onClick={() => { setShowAdd(true); setSelectedCat(null); }} className="btn-primary" style={{ minHeight: 40, padding: '9px 12px', fontSize: 13, borderRadius: 15 }}>
          + Yangi yozuv
        </button>
      </div>

      {/* ─── Categories Grid ─── */}
      <div className="section-head">
        <h3>Kategoriyalar</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 11 }}>
        {categories?.slice(0, 9).map((c: any) => (
          <div
            key={c.id}
            className="card"
            style={{ minHeight: 112, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 16, borderRadius: 28, cursor: 'pointer' }}
            onClick={() => { setSelectedCat(c); setShowAdd(true); }}
          >
            <span style={{ fontSize: 28 }}>{c.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--muted)', marginTop: 6 }}>{c.name}</span>
          </div>
        ))}
      </div>

      {/* ─── Add Sheet ─── */}
      {showAdd && (
        <>
          <div className="scrim" onClick={() => setShowAdd(false)} />
          <div className="sheet" style={{ animation: 'slideUp .35s ease' }}>
            <div className="sheet__handle" />
            <div className="sheet__head">
              <h3>Yangi yozuv</h3>
              <button onClick={() => setShowAdd(false)} className="btn-secondary" style={{ minHeight: 40, padding: '9px 12px', borderRadius: 15, fontSize: 13 }}>
                ✕
              </button>
            </div>

            <div className="amount-input">
              <small>UZS</small>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                style={{
                  border: 'none', textAlign: 'center', fontSize: 42, fontWeight: 950,
                  background: 'transparent', color: 'var(--text)', width: '100%',
                  outline: 'none', letterSpacing: '-1.5px',
                }}
              />
            </div>

            <div className="keypad">
              {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k) => (
                <button key={k} onClick={() => {
                  if (k === '⌫') setAmount(a => a.slice(0, -1));
                  else if (k !== '') setAmount(a => a + k);
                }}>
                  {k}
                </button>
              ))}
            </div>

            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Izoh (ixtiyoriy)"
              className="input"
              style={{ marginBottom: 12 }}
            />

            <button
              className="btn-primary full"
              onClick={() => {
                if (!amount || !selectedCat) return;
                addMutation.mutate({
                  familyId,
                  type: selectedCat.type || 'expense',
                  categoryId: selectedCat.id,
                  amount: Number(amount),
                  description: note || undefined,
                });
              }}
            >
              💾 Saqlash
            </button>
          </div>
        </>
      )}
    </div>
  );
}
