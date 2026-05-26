import type { ReactElement, SVGProps } from 'react';

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

type IconProps = SVGProps<SVGSVGElement>;

const commonProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} satisfies IconProps;

function HomeIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function WalletIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5z" />
      <path d="M18 12h3v4h-3a2 2 0 0 1 0-4Z" />
      <path d="M7 8h10" />
    </svg>
  );
}

function TasksIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M8 6h12" />
      <path d="M8 12h12" />
      <path d="M8 18h12" />
      <path d="m3.5 6 1 1 2-2" />
      <path d="m3.5 12 1 1 2-2" />
      <path d="m3.5 18 1 1 2-2" />
    </svg>
  );
}

function CalendarIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M7 3v3" />
      <path d="M17 3v3" />
      <rect width="16" height="16" x="4" y="5" rx="3" />
      <path d="M4 10h16" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}

function SettingsIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.07A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.07 14H3a2 2 0 1 1 0-4h.07a1.7 1.7 0 0 0 1.56-1A1.7 1.7 0 0 0 4.29 7.1l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 9 4.63 1.7 1.7 0 0 0 10 3.07V3a2 2 0 1 1 4 0v.07a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.88-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.37 9c.26.6.86 1 1.56 1H21a2 2 0 1 1 0 4h-.07a1.7 1.7 0 0 0-1.53 1Z" />
    </svg>
  );
}

function BellIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path d="M10 21h4" />
    </svg>
  );
}

function PlusIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CloseIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function UserIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function ChartIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15v-4" />
      <path d="M12 15V8" />
      <path d="M16 15v-6" />
    </svg>
  );
}

function GiftIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M20 12v8H4v-8" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 22V7" />
      <path d="M12 7H8.5A2.5 2.5 0 1 1 11 4.5c0 1.5 1 2.5 1 2.5Z" />
      <path d="M12 7h3.5A2.5 2.5 0 1 0 13 4.5c0 1.5-1 2.5-1 2.5Z" />
    </svg>
  );
}

function SparkIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" />
      <path d="m19 16 .7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7Z" />
      <path d="m5 3 .7 1.8 1.8.7-1.8.7L5 8l-.7-1.8-1.8-.7 1.8-.7Z" />
    </svg>
  );
}

function ArrowIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function AppIcon({ name, ...props }: IconProps & { name: AppIconName }) {
  const icons: Record<AppIconName, (iconProps: IconProps) => ReactElement> = {
    home: HomeIcon,
    wallet: WalletIcon,
    tasks: TasksIcon,
    calendar: CalendarIcon,
    settings: SettingsIcon,
    bell: BellIcon,
    plus: PlusIcon,
    check: CheckIcon,
    close: CloseIcon,
    user: UserIcon,
    chart: ChartIcon,
    gift: GiftIcon,
    spark: SparkIcon,
    arrow: ArrowIcon,
  };

  const Icon = icons[name];
  return <Icon {...props} />;
}
