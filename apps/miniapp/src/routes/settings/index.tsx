export default function SettingsPage() {
  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="screen-title">
        <div className="eyebrow">sozlash</div>
        <h1>Sozlamalar</h1>
      </div>

      <div className="stack" style={{ marginTop: 18 }}>
        {[
          { icon: '🌐', title: 'Til', subtitle: 'O\'zbekcha', action: 'til' },
          { icon: '🔔', title: 'Bildirishnomalar', subtitle: 'Yoqilgan', action: 'notif' },
          { icon: '🌙', title: 'Dark mode', subtitle: 'Avtomatik', action: 'theme' },
          { icon: '👨‍👩‍👧‍👦', title: 'Oila sozlamalari', subtitle: '3 a\'zo', action: 'family' },
        ].map((item) => (
          <div key={item.action} className="list-card" style={{ cursor: 'pointer' }}>
            <div className="icon icon-mint">{item.icon}</div>
            <div className="meta">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
            <span style={{ color: 'var(--muted)', fontWeight: 900 }}>→</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button className="btn-secondary" style={{ minHeight: 52, width: '100%', color: 'var(--red)', border: '1px solid var(--red-soft)' }}>
          Chiqish
        </button>
      </div>
    </div>
  );
}
