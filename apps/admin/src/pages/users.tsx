// ─── Users Page ───
export function UsersPage() {
  const users = [
    { id: 'u1', name: 'Zilola K.', telegramId: '540152508', family: 'Karimovlar', role: 'owner', status: 'active' },
    { id: 'u2', name: 'Jasur A.', telegramId: '123456789', family: 'Toshkentliklar', role: 'owner', status: 'active' },
    { id: 'u3', name: 'Dildora R.', telegramId: '987654321', family: 'Samarqand oilasi', role: 'owner', status: 'blocked' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👤 Foydalanuvchilar</h1>
        <input placeholder="Qidirish..." className="border rounded-lg px-3 py-1.5 text-sm" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm font-medium">Ism</th>
              <th className="text-left p-3 text-sm font-medium">Telegram ID</th>
              <th className="text-left p-3 text-sm font-medium">Oila</th>
              <th className="text-left p-3 text-sm font-medium">Rol</th>
              <th className="text-left p-3 text-sm font-medium">Holat</th>
              <th className="text-left p-3 text-sm font-medium">Harakat</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 text-sm font-medium">{u.name}</td>
                <td className="p-3 text-sm font-mono text-gray-500">{u.telegramId}</td>
                <td className="p-3 text-sm">{u.family}</td>
                <td className="p-3 text-sm">{u.role}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>{u.status}</span>
                </td>
                <td className="p-3 text-sm space-x-2">
                  <button className="text-indigo-600 hover:underline">Tahrir</button>
                  {u.status === 'active' ? (
                    <button className="text-red-600 hover:underline">Bloklash</button>
                  ) : (
                    <button className="text-green-600 hover:underline">Aktivlashtirish</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
