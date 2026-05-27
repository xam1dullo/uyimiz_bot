import { useId, type ReactNode } from 'react';
import { useStore, type FamilyMember } from '../../stores';
import { AppIcon, type AppIconName } from './icons';
import { triggerImpact, triggerSelection, useTelegramThemeStyle } from './telegram-theme';

export type Tone = 'mint' | 'blue' | 'red' | 'yellow' | 'purple' | 'neutral';

const FALLBACK_AVATAR_INITIALS = ['ZI', 'JA', 'SA'] as const;

function initialsFromMember(member: FamilyMember): string {
  const explicitInitials = member.initials.trim();
  if (explicitInitials) {
    return explicitInitials.slice(0, 2).toUpperCase();
  }

  const nameParts = member.name.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length >= 2) {
    return `${nameParts[0]?.[0] ?? ''}${nameParts[1]?.[0] ?? ''}`.toUpperCase();
  }

  return (nameParts[0]?.slice(0, 2) || '?').toUpperCase();
}

function labelFromMember(member: FamilyMember): string {
  return member.name.trim() || initialsFromMember(member);
}

export function AvatarStack() {
  const members = useStore((state) => state.members);
  const visibleMembers = members.slice(0, FALLBACK_AVATAR_INITIALS.length);
  const avatarInitials = visibleMembers.length
    ? visibleMembers.map((member) => initialsFromMember(member))
    : [...FALLBACK_AVATAR_INITIALS];
  const label = visibleMembers.length
    ? `Family members: ${visibleMembers.map((member) => labelFromMember(member)).join(', ')}`
    : 'Family members';

  return (
    <div className="avatar-stack" role="group" aria-label={label}>
      {avatarInitials.map((initials, index) => (
        <span className="avatar" key={`${initials}-${index}`} aria-hidden="true">
          {initials}
        </span>
      ))}
    </div>
  );
}

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
    <main className={`mobile-shell mini-shell has-nav ${className}`} style={themeStyle}>
      <header className="topbar app-topbar">
        <div className="brand compact" aria-label="@uyimiz">
          <span className="logo-mark">u</span>
          <span>Uyimiz</span>
        </div>
        <div className="topbar-actions">
          <AvatarStack />
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
    <span
      className={`icon icon-badge icon-${tone} icon-badge--${tone}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
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
  return <section className={`hero-card premium-card premium-card--${tone} ${className}`}>{children}</section>;
}

export interface StatCardProps {
  value: string;
  label: string;
  tone?: Tone;
}

export function StatCard({ value, label, tone = 'mint' }: StatCardProps) {
  return (
    <div className={`stat-card ${tone === 'red' ? 'danger' : ''} stat-card--${tone}`}>
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
            triggerSelection();
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
  const titleId = useId();
  const descriptionId = useId();
  const closeLabel = `Close ${title}`;

  if (!open) {
    return null;
  }

  const handleClose = () => {
    triggerImpact();
    onClose();
  };

  return (
    <>
      <button
        className="scrim sheet-scrim"
        type="button"
        aria-label={closeLabel}
        tabIndex={-1}
        style={{ border: 0, padding: 0 }}
        onClick={handleClose}
      />
      <section
        className="sheet floating-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="sheet__handle sheet-handle" aria-hidden="true" />
        <header className="sheet__head sheet-head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <button type="button" className="icon-button" aria-label={closeLabel} onClick={handleClose}>
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
      <h1>{title}</h1>
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
      className="button primary button--primary full"
      disabled={disabled}
      aria-disabled={disabled}
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
      className="button secondary button--secondary full"
      disabled={disabled}
      aria-disabled={disabled}
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
  return (
    <span className={`score-badge badge status-pill badge--${tone} status-pill--${tone}`}>
      {children}
    </span>
  );
}

export function ScoreBadge({ children, tone = 'mint' }: { children: ReactNode; tone?: Tone }) {
  return <StatusPill tone={tone}>{children}</StatusPill>;
}

export function CheckControl({
  done = false,
  label,
  onClick,
}: {
  done?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`check ${done ? 'done' : ''}`}
      aria-label={label}
      aria-pressed={done}
      onClick={() => {
        if (!onClick) {
          return;
        }
        triggerImpact();
        onClick();
      }}
    >
      <AppIcon name="check" />
    </button>
  );
}
