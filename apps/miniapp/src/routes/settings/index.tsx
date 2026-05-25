// ─── Settings Page ───
import { useFamilyId, useTelegramUser } from '@/hooks';

export function SettingsPage() {
  const familyId = useFamilyId();
  const user = useTelegramUser();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">⚙️ Sozlamalar</h1>

      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Profil</h2>
        <p className="text-sm">Ism: {user?.first_name ?? '—'}</p>
        <p className="text-sm text-gray-400">Family ID: {familyId ?? '—'}</p>
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Til</h2>
        <select className="border rounded px-2 py-1 w-full text-sm">
          <option>O'zbekcha</option>
          <option>Русский</option>
          <option>English</option>
        </select>
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Bildirishnomalar</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked /> Bot orqali bildirishnoma olish
        </label>
      </div>
    </div>
  );
}
