import type { ReactNode } from 'react';
import { AppIcon, type AppIconName } from './icons';
import { triggerImpact, useTelegramThemeStyle } from './telegram-theme';

export type Tone = 'mint' | 'blue' | 'red' | 'yellow' | 'purple' | 'neutral';

export interface AppShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  fab?: ReactNode;
  className?: string;
}

export function AppShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  fab,
  className = '',
}: AppShellProps) {
  const themeStyle = useTelegramThemeStyle();

  return (
    <main className={`mini-shell ${className}`} style={themeStyle}>
      <header className="app-topbar">
        <div className="brand-lockup" aria-label="@uyimiz">
          <span className="logo-mark">u</span>
          <div>
            <strong>Uyimiz</strong>
            <span>Family assistant</span>
          </div>
        </div>
        <div className="avatar-stack" aria-label="Family members">
          <span>ZI</span>
          <span>JA</span>
          <span>SA</span>
        </div>
      </header>

      <section className="screen-title">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="screen-actions">{actions}</div> : null}
      </section>

      {children}
      {fab}
    </main>
  );
}

export interface IconBadgeProps {
  icon: AppIconName;
  tone?: Tone;
  label?: string;
}

export function IconBadge({ icon, tone = 'mint', label }: IconBadgeProps) {
  return (
    <span className={`icon-badge icon-badge--${tone}`} aria-label={label}>
      <AppIcon name={icon} />
    </span>
  );
}

export interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  tone?: Tone;
}

export function PremiumCard({ children, className = '', tone = 'neutral' }: PremiumCardProps) {
  return <section className={`premium-card premium-card--${tone} ${className}`}>{children}</section>;
}

export interface StatCardProps {
  value: string;
  label: string;
  tone?: Tone;
}

export function StatCard({ value, label, tone = 'mint' }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export interface ListCardProps {
  icon: AppIconName;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  tone?: Tone;
  completed?: boolean;
  action?: ReactNode;
  onClick?: () => void;
}

export function ListCard({
  icon,
  title,
  subtitle,
  meta,
  tone = 'mint',
  completed = false,
  action,
  onClick,
}: ListCardProps) {
  const content = (
    <>
      <IconBadge icon={icon} tone={tone} />
      <div className="list-card__body">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
        {meta ? <div className="list-card__meta">{meta}</div> : null}
      </div>
      {action ? <div className="list-card__action">{action}</div> : null}
    </>
  );

  if (!onClick) {
    return <article className={`list-card ${completed ? 'is-completed' : ''}`}>{content}</article>;
  }

  return (
    <button
      type="button"
      className={`list-card list-card--button ${completed ? 'is-completed' : ''}`}
      onClick={() => {
        triggerImpact();
        onClick();
      }}
    >
      {content}
    </button>
  );
}

export interface SegmentOption<TValue extends string> {
  value: TValue;
  label: string;
}

export interface SegmentedControlProps<TValue extends string> {
  options: ReadonlyArray<SegmentOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  label: string;
}

export function SegmentedControl<TValue extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<TValue>) {
  return (
    <div className="pills" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          className={`pill ${value === option.value ? 'is-active' : ''}`}
          aria-checked={value === option.value}
          role="radio"
          onClick={() => {
            triggerImpact();
            onChange(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export interface FloatingActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: AppIconName;
}

export function FloatingActionButton({ label, onClick, icon = 'plus' }: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      className="fab"
      aria-label={label}
      onClick={() => {
        triggerImpact('medium');
        onClick();
      }}
    >
      <AppIcon name={icon} />
    </button>
  );
}

export interface FloatingSheetProps {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function FloatingSheet({ title, description, open, onClose, children }: FloatingSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <button className="sheet-scrim" type="button" aria-label="Close sheet" onClick={onClose} />
      <section className="floating-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className="sheet-handle" />
        <header className="sheet-head">
          <div>
            <h2 id="sheet-title">{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" />
          </button>
        </header>
        {children}
      </section>
    </>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="stack">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <i />
          <b />
          <span />
        </div>
      ))}
    </div>
  );
}

export interface EmptyStateProps {
  icon: AppIconName;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <PremiumCard className="empty-state" tone="mint">
      <IconBadge icon={icon} tone="mint" />
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </PremiumCard>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      className="button button--primary"
      disabled={disabled}
      onClick={() => {
        triggerImpact('medium');
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="button button--secondary"
      disabled={disabled}
      onClick={() => {
        triggerImpact();
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

export function StatusPill({ children, tone = 'mint' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`status-pill status-pill--${tone}`}>{children}</span>;
}
