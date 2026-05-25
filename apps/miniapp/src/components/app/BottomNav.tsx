// ─── Bottom Navigation ───
import { useRouter } from '@tanstack/react-router';

const TABS = [
  { to: '/', icon: '🏠', label: 'Bosh' },
  { to: '/budget', icon: '💰', label: 'Byudjet' },
  { to: '/tasks', icon: '📋', label: 'Vazifalar' },
  { to: '/birthdays', icon: '🎂', label: 'T.kunlar' },
  { to: '/settings', icon: '⚙️', label: 'Sozlamalar' },
] as const;

export function BottomNav() {
  const router = useRouter();
  const current = router.state.location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur flex justify-around py-2 safe-area-bottom">
      {TABS.map((tab) => (
        <button
          key={tab.to}
          onClick={() => router.navigate({ to: tab.to })}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            (tab.to === '/' ? current === '/' : current.startsWith(tab.to))
              ? 'text-indigo-600'
              : 'text-gray-400'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
