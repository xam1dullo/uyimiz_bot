// ─── Families Page ───
export function FamiliesPage() {
  const families = [
    { id: 'f1', name: 'Karimovlar oilasi', members: 4, budget: 1250000, created: '2026-01-15' },
    { id: 'f2', name: 'Toshkentliklar', members: 3, budget: 890000, created: '2026-02-20' },
    { id: 'f3', name: 'Samarqand oilasi', members: 5, budget: 2100000, created: '2026-03-05' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👨‍👩‍👧‍👦 Oilalar</h1>
        <input placeholder="Qidirish..." className="border rounded-lg px-3 py-1.5 text-sm" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm font-medium">Nomi</th>
              <th className="text-left p-3 text-sm font-medium">A'zolar</th>
              <th className="text-left p-3 text-sm font-medium">Byudjet</th>
              <th className="text-left p-3 text-sm font-medium">Yaratilgan</th>
              <th className="text-left p-3 text-sm font-medium">Harakat</th>
            </tr>
          </thead>
          <tbody>
            {families.map(f => (
              <tr key={f.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 text-sm font-medium">{f.name}</td>
                <td className="p-3 text-sm">{f.members}</td>
                <td className="p-3 text-sm">{f.budget.toLocaleString()} UZS</td>
                <td className="p-3 text-sm text-gray-500">{f.created}</td>
                <td className="p-3 text-sm">
                  <button className="text-indigo-600 hover:underline">Ko'rish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
