// ─── Premium UI Components — 1:1 from uyimiz-vite-premium-2 ───
import type { ReactNode } from 'react';

export function Card({ icon, title, sub, tone = 'mint', after }: {
  icon: string; title: string; sub?: string; tone?: string; after?: ReactNode;
}) {
  return (
    <div className="list-card">
      <div className={`icon icon-${tone}`}>{icon}</div>
      <div className="meta">
        <strong>{title}</strong>
        {sub && <span>{sub}</span>}
      </div>
      {after}
    </div>
  );
}

export function StatCard({ value, label, tone = '' }: { value: string; label: string; tone?: string }) {
  return <div className={`stat-card ${tone}`}><strong>{value}</strong><span>{label}</span></div>;
}

export function Pill({ text, active = false, onClick }: { text: string; active?: boolean; onClick?: () => void }) {
  return <button type="button" className={`pill${active ? ' is-active' : ''}`} onClick={onClick}>{text}</button>;
}

export function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="sheet" role="dialog" aria-modal="true">
        <div className="sheet__handle" />
        <div className="sheet__head">
          <h2>{title}</h2>
          <button type="button" className="icon-button" onClick={onClose}>×</button>
        </div>
        {children}
      </section>
    </>
  );
}

export function EmptyState({ icon, title, action }: { icon: string; title: string; action?: ReactNode }) {
  return (
    <section className="empty-state hero-card">
      <div className="icon icon-mint icon-large">{icon}</div>
      <h1>{title}</h1>
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
        <button type="button" key={String(k)} onClick={() => onPress(String(k))}>{k}</button>
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
      />
    </div>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  return <div className="progress"><i style={{ width: `${pct}%` }} /></div>;
}

export function Badge({ text, tone = 'mint' }: { text: string; tone?: string }) {
  return (
    <span className={`badge badge-${tone}`}>{text}</span>
  );
}

export function Check({ done, onClick }: { done: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`check${done ? ' done' : ''}`} onClick={onClick}>
      ✓
    </button>
  );
}

export function Switch({ on }: { on: boolean }) {
  return <span className={`switch${on ? ' is-on' : ''}`}><i /></span>;
}
