// ─── Admin App ───
import { useState } from 'react';
import { DashboardPage } from './pages/dashboard';
import { FamiliesPage } from './pages/families';
import { UsersPage } from './pages/users';
import { LogsPage } from './pages/logs';
import { SettingsPage } from './pages/settings';

const PAGES = [
  { id: 'dashboard', label: '📊 Dashboard', component: DashboardPage },
  { id: 'families', label: '👨‍👩‍👧‍👦 Oilalar', component: FamiliesPage },
  { id: 'users', label: '👤 Foydalanuvchilar', component: UsersPage },
  { id: 'logs', label: '📋 Audit Log', component: LogsPage },
  { id: 'settings', label: '⚙️ Sozlamalar', component: SettingsPage },
] as const;

export function AdminApp() {
  const [active, setActive] = useState('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={(e) => { e.preventDefault(); if (password) setLoggedIn(true); }}
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-center">🔐 Uyimiz Admin</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Admin paroli" className="w-full border rounded-lg px-3 py-2" />
          <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium">
            Kirish
          </button>
        </form>
      </div>
    );
  }

  const ActiveComponent = PAGES.find(p => p.id === active)?.component ?? DashboardPage;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-2">
        <h2 className="text-lg font-bold mb-6 px-2">Uyimiz Admin</h2>
        {PAGES.map(p => (
          <button key={p.id}
            onClick={() => setActive(p.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              active === p.id ? 'bg-indigo-600' : 'hover:bg-gray-800'
            }`}>
            {p.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-50 p-6">
        <ActiveComponent />
      </main>
    </div>
  );
}
