// ─── Premium UI Components — 1:1 from uyimiz-vite-premium-2 ───
import type { ReactNode } from 'react';

export function Card({ icon, title, sub, tone = 'mint', after, href }: {
  icon: string; title: string; sub?: string; tone?: string; after?: ReactNode; href?: string;
}) {
  const content = (
    <div className="list-card">
      <div className={`icon icon-${tone}`}>{icon}</div>
      <div className="meta">
        <strong>{title}</strong>
        {sub && <span>{sub}</span>}
      </div>
      {after}
    </div>
  );
  return href ? <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</a> : <>{content}</>;
}

export function StatCard({ value, label, tone = '' }: { value: string; label: string; tone?: string }) {
  return <div className={`stat-card ${tone}`}><strong>{value}</strong><span>{label}</span></div>;
}

export function Pill({ text, active = false, onClick }: { text: string; active?: boolean; onClick?: () => void }) {
  return <button className={`pill${active ? ' active' : ''}`} onClick={onClick}>{text}</button>;
}

export function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="sheet" role="dialog">
        <div className="sheet__handle" />
        <div className="sheet__head">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose}>×</button>
        </div>
        {children}
      </section>
    </>
  );
}

export function EmptyState({ icon, title, action }: { icon: string; title: string; action?: ReactNode }) {
  return (
    <section className="empty-state">
      <div className="icon icon-mint icon-large">{icon}</div>
      <p style={{ color: 'var(--muted)', fontSize: 16 }}>{title}</p>
      {action}
    </section>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <i />
      <b />
      <span />
    </div>
  );
}

export function Stepper({ pct }: { pct: number }) {
  return <div className="stepper"><span style={{ width: `${pct}%` }} /></div>;
}

export function Keypad({ onPress }: { onPress: (k: string) => void }) {
  return (
    <div className="keypad">
      {[1,2,3,4,5,6,7,8,9,'.',0,'⌫'].map(k => (
        <button key={String(k)} onClick={() => onPress(String(k))}>{k}</button>
      ))}
    </div>
  );
}

export function AmountInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="amount-input">
      <small>UZS</small>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        style={{
          border: 'none', textAlign: 'center', fontSize: 42, fontWeight: 950,
          background: 'transparent', color: 'var(--text)', width: '100%',
          outline: 'none', letterSpacing: '-1.5px',
        }}
      />
    </div>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  return <div className="progress"><i style={{ width: `${pct}%` }} /></div>;
}

export function Badge({ text, tone = 'mint' }: { text: string; tone?: string }) {
  return (
    <span className="badge" style={{
      background: tone === 'red' ? 'var(--red-soft)' : 'var(--mint-soft)',
      color: tone === 'red' ? 'var(--red)' : 'var(--mint)',
    }}>{text}</span>
  );
}

export function Check({ done, onClick }: { done: boolean; onClick: () => void }) {
  return (
    <button className={`check${done ? ' done' : ''}`} onClick={onClick}>
      ✓
    </button>
  );
}

export function Switch({ on }: { on: boolean }) {
  return <span className="switch"><i style={on ? {} : { marginLeft: 0, marginRight: 'auto' }} /></span>;
}
