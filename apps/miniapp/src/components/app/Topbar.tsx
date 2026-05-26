export default function AppTopbar() {
  return (
    <header className="topbar app-topbar">
      <a className="brand compact" href="/" style={{ textDecoration: 'none' }}>
        <span className="logo-mark">u</span>
        <span>Oilam</span>
      </a>
      <div className="topbar-actions">
        <div className="avatar-stack">
          <span className="avatar">ZI</span>
          <span className="avatar">JA</span>
          <span className="avatar">SA</span>
        </div>
        <button className="theme-toggle" onClick={() => {
          document.documentElement.setAttribute('data-theme',
            document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        }}>🌙</button>
      </div>
    </header>
  );
}
