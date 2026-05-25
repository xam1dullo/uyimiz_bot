// ─── Birthdays Page ───
import { useFamilyId } from '@/hooks';

export function BirthdaysPage() {
  const familyId = useFamilyId();
  if (!familyId) return <div className="p-6 text-center text-gray-500">Oilaga ulanmagan</div>;
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🎂 Tug'ilgan kunlar</h1>
      <div className="rounded-xl border p-4">
        <p className="text-center text-gray-400">Tug'ilgan kunlar taqvimi tez orada...</p>
      </div>
    </div>
  );
}
