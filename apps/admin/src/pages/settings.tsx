// ─── Settings Page ───
export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">⚙️ Platform Sozlamalari</h1>

      <div className="bg-white rounded-xl border p-4 space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Maksimal oila a'zolari</label>
          <input type="number" defaultValue={5} className="border rounded-lg px-3 py-1.5 w-full text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rate limit (so'rov/daqiqa)</label>
          <input type="number" defaultValue={30} className="border rounded-lg px-3 py-1.5 w-full text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Eslatma takrorlash chegarasi</label>
          <input type="number" defaultValue={5} className="border rounded-lg px-3 py-1.5 w-full text-sm" />
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium">Saqlash</button>
      </div>
    </div>
  );
}
