import { Link } from '@tanstack/react-router';
import { useStore } from '../../stores';

export function AppTopbar() {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

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
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="avatar-stack" aria-label="Family members">
          <span className="avatar">ZI</span>
          <span className="avatar">JA</span>
          <span className="avatar">SA</span>
        </div>
      </div>
    </header>
  );
}
