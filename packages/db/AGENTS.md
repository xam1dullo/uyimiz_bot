# @uyimiz/db — Database Agent Instructions

> ⚠️ HIGH IMPACT PACKAGE — Changes here affect ALL apps.
> Read root AGENTS.md first. Always confirm before modifying schema.

---

## Package Purpose

- Drizzle ORM schema (single source of truth for all tables)
- Database client with connection pooling
- `withFamilyContext` — RLS context setter
- Migration files (SQL)

---

## File Map

```
packages/db/src/
  schema/
    index.ts          ← ALL table definitions (the critical file)
  migrations/
    0001_init.sql     ← Base schema
    0002_rls.sql      ← RLS policies (custom, not drizzle-generated)
    0003_fts.sql      ← FTS tsvector columns + GIN indexes
    0004_triggers.sql ← pg_notify triggers
    0005_cron.sql     ← pg_cron jobs
    {N}_*.sql         ← New migrations (always increasing number)
  client.ts           ← postgres.js pool + drizzle instance + withFamilyContext
  index.ts            ← Re-exports everything
drizzle.config.ts     ← Drizzle Kit config
```

---

## Schema Rules (CRITICAL)

### Primary Keys
```typescript
id: uuid('id').primaryKey().defaultRandom()
```

### Timestamps — always with timezone
```typescript
createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
```

### Family-scoped tables — MUST have familyId
```typescript
familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' })
```

### Indexes — always add for common query patterns
```typescript
(t) => ({
  familyIdx: index('budget_family_date_idx').on(t.familyId, t.txDate),
  statusIdx: index('tasks_status_idx').on(t.status),
})
```

---

## RLS (Row Level Security) — Every Family Table

After creating a family-scoped table, ALWAYS add RLS in custom SQL migration:
```sql
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

CREATE POLICY family_isolation ON {table_name}
  USING (family_id = current_setting('app.current_family_id', true)::uuid);
```

The `withFamilyContext` function sets this config variable before queries.

---

## withFamilyContext — ALWAYS Use for Family Data

```typescript
// ✅ Always wrap family-scoped queries
const result = await withFamilyContext(familyId, async (tx) => {
  return tx.select().from(budgetRecords)
    .where(eq(budgetRecords.familyId, familyId));
});

// ❌ Never query family tables directly
const result = await db.select().from(budgetRecords)
  .where(eq(budgetRecords.familyId, familyId));
// ^ This bypasses RLS — security vulnerability
```

---

## FTS (Full-Text Search) Pattern

For searchable tables (medications, first_aid_items, tasks):
```sql
-- Add GENERATED tsvector column (in custom SQL migration)
ALTER TABLE {table}
  ADD COLUMN fts_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) STORED;

CREATE INDEX {table}_fts_idx ON {table} USING GIN(fts_vector);
```

Query in Drizzle:
```typescript
.where(sql`fts_vector @@ plainto_tsquery('simple', ${searchTerm})`)
```

---

## Migration Workflow (MUST FOLLOW)

```bash
# Step 1: Edit schema
vim packages/db/src/schema/index.ts

# Step 2: Generate Drizzle migration
pnpm --filter @uyimiz/db db:generate
# → Creates packages/db/src/migrations/XXXX_auto.sql

# Step 3: Review generated SQL (IMPORTANT — check before applying)
cat packages/db/src/migrations/XXXX_auto.sql

# Step 4: If custom SQL needed (RLS, FTS, triggers)
# Create: packages/db/src/migrations/XXXX_custom.sql
# Add your custom SQL there

# Step 5: Apply migration
pnpm --filter @uyimiz/db db:migrate

# Step 6: Verify
pnpm --filter @uyimiz/db db:studio  # opens Drizzle Studio
```

---

## Adding a New Table — Checklist

- [ ] Add enum (if needed): `export const myEnum = pgEnum('my_enum', [...])`
- [ ] Add table with all columns, FKs, indexes
- [ ] Export from `src/schema/index.ts` (already exported via `export *`)
- [ ] Add to `src/index.ts` if new helper needed
- [ ] Run `db:generate` and review SQL
- [ ] Create `_custom.sql` for: RLS policies, FTS columns, triggers
- [ ] Run `db:migrate`
- [ ] Verify with `db:studio`
- [ ] Update relevant `apps/api/src/modules/{module}` repository

---

## Existing Tables (Quick Reference)

```
families            → oila profili
users               → foydalanuvchilar (telegramId, familyId, role)
budget_records      → daromad/xarajat yozuvlari
tasks               → yumushlar (status, priority, repeat, points)
reminders           → eslatmalar (scheduledAt, jobId, snooze)
birthdays           → tug'ilgan kunlar (notifyDaysBefore array)
children            → bola profillari
child_activities    → bola faoliyat yozuvlari (baholar, emlash)
health_records      → sog'liq ko'rsatkichlari (JSONB value)
medications         → dorilar (schedule JSONB, FTS)
diet_plans          → ovqat rejalari (mealType, foodItems JSONB)
important_tasks     → muhim ishlar (progress, priority)
first_aid_items     → birinchi yordam KB (FTS uz/ru/en)
user_points         → gamification ball (haftalik)
audit_logs          → audit tarixchasi (partitioned by month)
```

---

## DO NOT

- ❌ NEVER edit existing migration SQL files (only add new)
- ❌ NEVER drop columns in production (deprecate first, remove in next release)
- ❌ NEVER use `db:push` in production (use `db:migrate` only)
- ❌ NEVER add application logic in schema file
- ❌ NEVER bypass `withFamilyContext` for family-scoped tables
