// ─── Premium UI Components — 1:1 from uyimiz-vite-premium-2 ───
import { useId, type ReactNode } from 'react';
import { triggerImpact, triggerSelection } from '../app/telegram-theme';

export function Card({ icon, title, sub, tone = 'mint', after }: {
  icon: string; title: string; sub?: string; tone?: string; after?: ReactNode;
}) {
  return (
    <div className="list-card">
      <div className={`icon icon-${tone}`} aria-hidden="true">{icon}</div>
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

export function Pill({
  text,
  active = false,
  onClick,
  disabled = false,
}: {
  text: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`pill${active ? ' is-active' : ''}`}
      aria-pressed={active}
      disabled={disabled}
      onClick={() => {
        if (!onClick) {
          return;
        }
        triggerSelection();
        onClick();
      }}
    >
      {text}
    </button>
  );
}

export function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const titleId = useId();
  const closeLabel = `Close ${title}`;

  const handleClose = () => {
    triggerImpact();
    onClose();
  };

  return (
    <>
      <button
        className="scrim"
        type="button"
        aria-label={closeLabel}
        tabIndex={-1}
        style={{ border: 0, padding: 0 }}
        onClick={handleClose}
      />
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="sheet__handle" aria-hidden="true" />
        <div className="sheet__head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="icon-button" aria-label={closeLabel} onClick={handleClose}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {children}
      </section>
    </>
  );
}

export function EmptyState({ icon, title, action }: { icon: string; title: string; action?: ReactNode }) {
  return (
    <section className="empty-state hero-card">
      <div className="icon icon-mint icon-large" aria-hidden="true">{icon}</div>
      <h1>{title}</h1>
      {action}
    </section>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <i />
      <b />
      <span />
    </div>
  );
}

export function Stepper({ pct }: { pct: number }) {
  const value = Math.max(0, Math.min(100, pct));

  return (
    <div className="stepper" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

export function Keypad({ onPress }: { onPress: (k: string) => void }) {
  const getKeyLabel = (key: string | number) => {
    if (key === '⌫') return 'Backspace';
    if (key === '.') return 'Decimal point';
    return `Digit ${key}`;
  };

  return (
    <div className="keypad" role="group" aria-label="Numeric keypad">
      {[1,2,3,4,5,6,7,8,9,'.',0,'⌫'].map(k => (
        <button
          type="button"
          key={String(k)}
          aria-label={getKeyLabel(k)}
          onClick={() => {
            triggerSelection();
            onPress(String(k));
          }}
        >
          {k}
        </button>
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
        aria-label="Amount"
        inputMode="decimal"
        placeholder="0"
      />
    </div>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  const value = Math.max(0, Math.min(100, pct));

  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <i style={{ width: `${value}%` }} />
    </div>
  );
}

export function Badge({ text, tone = 'mint' }: { text: string; tone?: string }) {
  return (
    <span className={`badge badge-${tone}`}>{text}</span>
  );
}

export function Check({ done, onClick, label }: { done: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      className={`check${done ? ' done' : ''}`}
      aria-label={label ?? (done ? 'Task completed' : 'Complete task')}
      aria-pressed={done}
      onClick={() => {
        triggerImpact();
        onClick();
      }}
    >
      <span aria-hidden="true">✓</span>
    </button>
  );
}

export function Switch({ on, label }: { on: boolean; label?: string }) {
  return (
    <span
      className={`switch${on ? ' is-on' : ''}`}
      role={label ? 'switch' : undefined}
      aria-label={label}
      aria-checked={label ? on : undefined}
      aria-hidden={label ? undefined : true}
    >
      <i />
    </span>
  );
}
