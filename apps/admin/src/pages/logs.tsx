// ─── Logs Page ───
export function LogsPage() {
  const logs = [
    { action: 'family.create', user: 'Zilola K.', timestamp: '2026-05-26 10:32:45', ip: '91.200.12.34' },
    { action: 'budget.add', user: 'Jasur A.', timestamp: '2026-05-26 10:31:12', ip: '185.100.45.67' },
    { action: 'task.complete', user: 'Dildora R.', timestamp: '2026-05-26 10:30:08', ip: '213.85.12.90' },
    { action: 'member.add', user: 'Zilola K.', timestamp: '2026-05-26 09:15:33', ip: '91.200.12.34' },
    { action: 'reminder.create', user: 'Jasur A.', timestamp: '2026-05-26 08:45:01', ip: '185.100.45.67' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📋 Audit Log</h1>
        <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm">CSV Export</button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm font-medium">Amal</th>
              <th className="text-left p-3 text-sm font-medium">Foydalanuvchi</th>
              <th className="text-left p-3 text-sm font-medium">Vaqt</th>
              <th className="text-left p-3 text-sm font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 text-sm font-mono text-indigo-600">{l.action}</td>
                <td className="p-3 text-sm">{l.user}</td>
                <td className="p-3 text-sm text-gray-500">{l.timestamp}</td>
                <td className="p-3 text-sm font-mono text-gray-400">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
