// ─── Seed script: default budget categories ───
// Run: npx tsx apps/api/src/scripts/seed.ts
import { createClient, categories, families } from '@uyimiz/db';
import { v4 as uuid } from 'uuid';

const DEFAULT_FAMILY_ID = uuid();
const DEFAULT_USER_ID = uuid();

async function seed() {
  const db = createClient();

  // Create default family
  await db.insert(families).values({
    id: DEFAULT_FAMILY_ID,
    name: 'Default Family',
    code: 'DEMO0000',
  }).onConflictDoNothing();

  // Default income categories
  const incomeCategories = [
    { name: 'Maosh', icon: '💰', color: '#22c55e' },
    { name: 'Bonus', icon: '🎁', color: '#16a34a' },
    { name: 'Freelance', icon: '💻', color: '#15803d' },
    { name: 'Investitsiya', icon: '📈', color: '#166534' },
    { name: 'Boshqa daromad', icon: '💵', color: '#14532d' },
  ];

  // Default expense categories
  const expenseCategories = [
    { name: 'Oziq-ovqat', icon: '🛒', color: '#ef4444' },
    { name: 'Transport', icon: '🚗', color: '#dc2626' },
    { name: 'Kommunal', icon: '🏠', color: '#b91c1c' },
    { name: 'Ijara', icon: '🏢', color: '#991b1b' },
    { name: "Sog'liq", icon: '🏥', color: '#7f1d1d' },
    { name: "Ta'lim", icon: '📚', color: '#450a0a' },
    { name: "Ko'ngilochar", icon: '🎮', color: '#f97316' },
    { name: 'Kiyim', icon: '👕', color: '#ea580c' },
    { name: 'Boshqa chiqim', icon: '💳', color: '#9a3412' },
  ];

  for (const cat of incomeCategories) {
    await db.insert(categories).values({
      id: uuid(), familyId: DEFAULT_FAMILY_ID,
      name: cat.name, icon: cat.icon, color: cat.color,
      type: 'income', isDefault: true,
    }).onConflictDoNothing();
  }

  for (const cat of expenseCategories) {
    await db.insert(categories).values({
      id: uuid(), familyId: DEFAULT_FAMILY_ID,
      name: cat.name, icon: cat.icon, color: cat.color,
      type: 'expense', isDefault: true,
    }).onConflictDoNothing();
  }

  console.log('✅ Seed complete: 1 family, 14 default categories');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
