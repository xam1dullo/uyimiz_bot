import { Link } from '@tanstack/react-router';
import { useStore } from '../../stores';
import { AvatarStack } from './premium';
import { triggerSelection } from './telegram-theme';

export function AppTopbar() {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const nextThemeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <header className="topbar app-topbar">
      <Link className="brand compact" to="/" aria-label="@uyimiz dashboard">
        <span className="logo-mark">u</span>
        <span>Uyimiz</span>
      </Link>
      <div className="topbar-actions">
        <button
          className="theme-toggle"
          type="button"
          aria-label={nextThemeLabel}
          aria-pressed={theme === 'dark'}
          onClick={() => {
            triggerSelection();
            toggleTheme();
          }}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
        <AvatarStack />
      </div>
    </header>
  );
}
