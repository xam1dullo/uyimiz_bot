import { Link, useRouterState } from '@tanstack/react-router';

const items = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/budget', icon: '💰', label: 'Byudjet' },
  { to: '/tasks', icon: '📋', label: 'Vazifalar' },
  { to: '/reminders', icon: '🔔', label: 'Eslatma' },
  { to: '/settings', icon: '⚙️', label: 'Sozlamalar' },
];

export default function BottomNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const isActive = currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to));
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-item${isActive ? ' active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <span className="icon">{item.icon}</span>
            <small>{item.label}</small>
          </Link>
        );
      })}
    </nav>
  );
}
