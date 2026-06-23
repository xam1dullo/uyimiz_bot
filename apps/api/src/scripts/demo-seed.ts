// Demo data seeder for development
import { createClient, families, users, categories, budgetRecords, tasks } from '@uyimiz/db';
import { v4 as uuid } from 'uuid';

async function seed() {
  const db = createClient();
  
  const familyId = '00000000-0000-0000-0000-000000000001';
  const userId = '00000000-0000-0000-0000-000000000002';

  // Family
  await db.insert(families).values({ id: familyId, name: 'Demo Family', code: 'DEMO2024' }).onConflictDoNothing();
  
  // User
  await db.insert(users).values({ id: userId, telegramId: 'demo_user', familyId, name: 'Demo User', role: 'OWNER', lang: 'uz' }).onConflictDoNothing();

  // Categories
  const cats = [
    { n: 'Maosh', i: '💰', t: 'income' as const }, { n: 'Oziq-ovqat', i: '🛒', t: 'expense' as const },
    { n: 'Transport', i: '🚗', t: 'expense' as const }, { n: 'Bonus', i: '🎁', t: 'income' as const },
  ];
  for (const c of cats) {
    await db.insert(categories).values({ id: uuid(), familyId, name: c.n, icon: c.i, type: c.t, isDefault: true }).onConflictDoNothing();
  }

  // Sample transactions
  for (let i = 0; i < 10; i++) {
    await db.insert(budgetRecords).values({
      id: uuid(), familyId, type: i % 3 === 0 ? 'income' : 'expense',
      categoryId: cats[0]!.t === 'income' ? 'cat-1' : 'cat-2',
      amount: Math.floor(Math.random() * 50000) + 5000,
      txDate: new Date(2026, 4, i + 1), createdBy: userId,
    });
  }

  // Sample tasks
  const taskTitles = ['Xona tozalash', 'Dars qilish', 'Sport', 'Kitob o\'qish', 'Ovqat tayyorlash'];
  for (const title of taskTitles) {
    await db.insert(tasks).values({
      id: uuid(), familyId, title, status: 'pending', priority: 'medium',
      points: Math.floor(Math.random() * 20) + 5, createdBy: userId,
    });
  }

  console.log('✅ Demo data seeded: 1 family, 1 user, 4 categories, 10 transactions, 5 tasks');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
