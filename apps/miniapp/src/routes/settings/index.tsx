// ─── Settings Page ───
import { useState } from 'react';
import { useFamilyId, useTelegramUser } from '@/hooks';

const LANGS: Record<string, string> = { uz: "O'zbekcha", ru: 'Русский', en: 'English' };

export function SettingsPage() {
  const familyId = useFamilyId();
  const user = useTelegramUser();
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'uz');
  const [notifications, setNotifications] = useState(true);
  const [dndFrom, setDndFrom] = useState('22:00');
  const [dndTo, setDndTo] = useState('08:00');

  const handleLangChange = (l: string) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify({ notifications, dndFrom, dndTo, lang }));
    alert('✅ Sozlamalar saqlandi');
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-2xl font-bold">⚙️ Sozlamalar</h1>

      {/* Profile */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">👤 Profil</h2>
        <p className="text-sm">{user?.first_name ?? 'Foydalanuvchi'} {user?.last_name ?? ''}</p>
        <p className="text-xs text-gray-400">Oilangiz: {familyId?.slice(0, 8) ?? '—'}...</p>
      </div>

      {/* Language */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">🌐 Til</h2>
        <div className="flex gap-2">
          {Object.entries(LANGS).map(([code, name]) => (
            <button key={code} onClick={() => handleLangChange(code)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                lang === code ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">🔔 Bildirishnomalar</h2>
        <label className="flex items-center justify-between py-1">
          <span className="text-sm">Bot orqali xabar olish</span>
          <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)}
            className="w-5 h-5 accent-indigo-600" />
        </label>
        {notifications && (
          <div className="mt-3 pt-3 border-t space-y-2">
            <p className="text-xs text-gray-500">Bildirishnoma olmaslik vaqti (DND):</p>
            <div className="flex gap-2 items-center">
              <input type="time" value={dndFrom} onChange={e => setDndFrom(e.target.value)}
                className="border rounded-lg px-2 py-1 text-sm flex-1" />
              <span className="text-gray-400">—</span>
              <input type="time" value={dndTo} onChange={e => setDndTo(e.target.value)}
                className="border rounded-lg px-2 py-1 text-sm flex-1" />
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">ℹ️ Dastur haqida</h2>
        <p className="text-sm text-gray-500">Uyimiz v0.1.0</p>
        <p className="text-xs text-gray-400 mt-1">Telegram Mini App · Oila boshqaruv platformasi</p>
      </div>

      <button onClick={handleSave}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium">
        💾 Saqlash
      </button>
    </div>
  );
}
