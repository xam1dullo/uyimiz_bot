import type { BudgetCategory } from '../types/budget.types';

export const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  // Income
  { id: 'salary', name: { uz: 'Maosh', ru: 'Зарплата', en: 'Salary' }, icon: '💰', type: 'income', sortOrder: 1 },
  { id: 'bonus', name: { uz: 'Bonus', ru: 'Бонус', en: 'Bonus' }, icon: '🎁', type: 'income', sortOrder: 2 },
  { id: 'freelance', name: { uz: 'Freelance', ru: 'Фриланс', en: 'Freelance' }, icon: '💻', type: 'income', sortOrder: 3 },
  { id: 'investment', name: { uz: 'Investitsiya', ru: 'Инвестиция', en: 'Investment' }, icon: '📈', type: 'income', sortOrder: 4 },
  { id: 'other_income', name: { uz: 'Boshqa', ru: 'Другое', en: 'Other' }, icon: '💵', type: 'income', sortOrder: 5 },
  // Expense
  { id: 'food', name: { uz: 'Oziq-ovqat', ru: 'Продукты', en: 'Food' }, icon: '🛒', type: 'expense', sortOrder: 1 },
  { id: 'transport', name: { uz: 'Transport', ru: 'Транспорт', en: 'Transport' }, icon: '🚗', type: 'expense', sortOrder: 2 },
  { id: 'utilities', name: { uz: 'Kommunal', ru: 'Коммунальные', en: 'Utilities' }, icon: '🏠', type: 'expense', sortOrder: 3 },
  { id: 'rent', name: { uz: 'Ijara', ru: 'Аренда', en: 'Rent' }, icon: '🏢', type: 'expense', sortOrder: 4 },
  { id: 'health', name: { uz: "Sog'liq", ru: 'Здоровье', en: 'Health' }, icon: '🏥', type: 'expense', sortOrder: 5 },
  { id: 'education', name: { uz: "Ta'lim", ru: 'Образование', en: 'Education' }, icon: '📚', type: 'expense', sortOrder: 6 },
  { id: 'entertainment', name: { uz: "Ko'ngilochar", ru: 'Развлечения', en: 'Entertainment' }, icon: '🎮', type: 'expense', sortOrder: 7 },
  { id: 'clothing', name: { uz: 'Kiyim', ru: 'Одежда', en: 'Clothing' }, icon: '👕', type: 'expense', sortOrder: 8 },
  { id: 'other_expense', name: { uz: 'Boshqa', ru: 'Другое', en: 'Other' }, icon: '💳', type: 'expense', sortOrder: 9 },
];
