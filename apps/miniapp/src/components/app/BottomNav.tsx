import { Link, useRouterState } from '@tanstack/react-router';
import { AppIcon, type AppIconName } from './icons';
import { triggerSelection } from './telegram-theme';

const nav = [
  { to: '/', key: 'dashboard', icon: 'home', label: 'Bosh' },
  { to: '/budget', key: 'budget', icon: 'wallet', label: 'Byudjet' },
  { to: '/tasks', key: 'tasks', icon: 'tasks', label: 'Vazifa' },
  { to: '/reminders', key: 'reminders', icon: 'bell', label: 'Eslatma' },
  { to: '/settings', key: 'profile', icon: 'user', label: 'Men' },
] as const satisfies ReadonlyArray<{ to: string; key: string; icon: AppIconName; label: string }>;

export function BottomNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <nav className="bottom-nav" aria-label="App navigation">
      {nav.map((item) => {
        const isActive = currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to));
        return (
          <Link
            key={item.key}
            to={item.to}
            className={`bottom-nav__item${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              if (!isActive) {
                triggerSelection();
              }
            }}
          >
            <AppIcon name={item.icon} />
            <small>{item.label}</small>
          </Link>
        );
      })}
    </nav>
  );
}
