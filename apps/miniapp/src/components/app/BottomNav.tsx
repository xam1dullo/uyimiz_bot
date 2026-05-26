import { useRouter } from '@tanstack/react-router';
import { AppIcon, type AppIconName } from './icons';
import { triggerSelection, useTelegramThemeStyle } from './telegram-theme';

const TABS: ReadonlyArray<{ to: string; icon: AppIconName; label: string }> = [
  { to: '/', icon: 'home', label: 'Bosh' },
  { to: '/budget', icon: 'wallet', label: 'Byudjet' },
  { to: '/tasks', icon: 'tasks', label: 'Yumush' },
  { to: '/birthdays', icon: 'gift', label: 'T.kunlar' },
  { to: '/settings', icon: 'settings', label: 'Men' },
];

function isActiveTab(currentPath: string, tabPath: string) {
  return tabPath === '/' ? currentPath === '/' : currentPath.startsWith(tabPath);
}

export function BottomNav() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const themeStyle = useTelegramThemeStyle();

  return (
    <nav className="bottom-nav" style={themeStyle} aria-label="Mini App navigation">
      {TABS.map((tab) => {
        const isActive = isActiveTab(currentPath, tab.to);

        return (
          <button
            key={tab.to}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              triggerSelection();
              router.navigate({ to: tab.to });
            }}
            className={`bottom-nav__item ${isActive ? 'is-active' : ''}`}
          >
            <AppIcon name={tab.icon} />
            <small>{tab.label}</small>
          </button>
        );
      })}
    </nav>
  );
}
