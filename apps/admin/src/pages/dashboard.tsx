// ─── Dashboard ───
export function DashboardPage() {
  const stats = [
    { label: 'Jami oilalar', value: '127', change: '+12%' },
    { label: 'Faol foydalanuvchilar', value: '1,204', change: '+8%' },
    { label: 'Byudjet yozuvlari', value: '45,892', change: '+23%' },
    { label: 'Eslatmalar', value: '8,120', change: '+15%' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-green-600 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-4">Oxirgi faollik</h2>
          <div className="space-y-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="text-sm flex justify-between py-1 border-b last:border-0">
                <span>Yangi oila yaratildi</span>
                <span className="text-gray-400">{i} soat oldin</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-4">Xatolar</h2>
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="text-sm flex justify-between py-1 border-b last:border-0">
                <span className="text-red-600">Rate limit exceeded</span>
                <span className="text-gray-400">{i * 10} daqiqa oldin</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
