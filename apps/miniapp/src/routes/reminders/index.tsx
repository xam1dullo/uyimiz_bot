// ─── Reminders Page ───
import { useFamilyId } from '@/hooks';

export function RemindersPage() {
  const familyId = useFamilyId();
  if (!familyId) return <div className="p-6 text-center text-gray-500">Oilaga ulanmagan</div>;
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🔔 Eslatmalar</h1>
      <div className="rounded-xl border p-6 text-center">
        <p className="text-gray-400">Eslatmalar bot orqali boshqariladi</p>
        <p className="text-sm text-gray-300 mt-1">Yangi eslatma qo'shish uchun botdan foydalaning</p>
      </div>
    </div>
  );
}
