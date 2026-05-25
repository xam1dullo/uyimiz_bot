# @uyimiz/shared — Shared Types Agent Instructions

> ⚠️ Changes here affect ALL apps (api, miniapp, web, admin).
> TYPES ONLY — no framework dependencies allowed.

---

## Purpose
Shared TypeScript types, constants, and utility functions.
Used by ALL apps — keep it minimal and stable.

## Rules
- Types/interfaces ONLY — no classes, no decorators
- No framework imports (no NestJS, no React, no Drizzle)
- No side effects in index.ts
- Breaking changes require version bump + all consumers updated

## Structure
```
packages/shared/src/
  types/
    user.types.ts        → UserRole, UserLang enums
    family.types.ts      → Family, FamilyMember types
    budget.types.ts      → BudgetCategory, TransactionType
    task.types.ts        → TaskStatus, TaskPriority, RepeatType
    reminder.types.ts    → ReminderType
    health.types.ts      → HealthRecordType
  constants/
    categories.ts        → Budget categories list
    languages.ts         → Supported languages
    limits.ts            → Free/premium limits
  utils/
    date.ts              → Date formatting helpers (no external deps)
    currency.ts          → Currency formatting
```

## Adding New Types
- [ ] Add to appropriate file in `src/types/`
- [ ] Export from `src/index.ts`
- [ ] Update all consumers if breaking change
- [ ] Keep types minimal — avoid over-engineering
