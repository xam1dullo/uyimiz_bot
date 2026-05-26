import type { HTMLAttributes, ReactElement } from 'react';

export type AppIconName =
  | 'home'
  | 'wallet'
  | 'tasks'
  | 'calendar'
  | 'settings'
  | 'bell'
  | 'plus'
  | 'check'
  | 'close'
  | 'user'
  | 'chart'
  | 'gift'
  | 'spark'
  | 'arrow';

type IconProps = HTMLAttributes<HTMLSpanElement>;

const ICONS: Record<AppIconName, string> = {
  home: '🏠',
  wallet: '💰',
  tasks: '✅',
  calendar: '📅',
  settings: '⚙️',
  bell: '🔔',
  plus: '+',
  check: '✓',
  close: '×',
  user: '👤',
  chart: '📊',
  gift: '🎁',
  spark: '✨',
  arrow: '→',
};

export function AppIcon({ name, className = '', ...props }: IconProps & { name: AppIconName }): ReactElement {
  return (
    <span className={`app-icon-symbol ${className}`.trim()} aria-hidden="true" {...props}>
      {ICONS[name]}
    </span>
  );
}
