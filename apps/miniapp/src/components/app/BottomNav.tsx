import { Link, useRouterState } from '@tanstack/react-router';

const nav = [
  { to: '/', key: 'dashboard', icon: '🏠', label: 'Bosh' },
  { to: '/budget', key: 'budget', icon: '💰', label: 'Byudjet' },
  { to: '/tasks', key: 'tasks', icon: '✅', label: 'Vazifa' },
  { to: '/reminders', key: 'reminders', icon: '🔔', label: 'Eslatma' },
  { to: '/settings', key: 'profile', icon: '👤', label: 'Men' },
] as const;

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
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </Link>
        );
      })}
    </nav>
  );
}
