# ADR 0004: PostgreSQL RLS for Family Isolation

**Status:** Accepted  
**Date:** 2026-05-26

## Context

Multi-family system where each family's data must be completely isolated:
- User A in Family 1 must not see Family 2's budget records
- AI agents querying DB must automatically scope to current family
- Must work even if application bug sends wrong family_id

## Decision

**PostgreSQL Row-Level Security** with `app.current_family_id` runtime parameter.

```sql
ALTER TABLE budget_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY budget_records_family_isolation ON budget_records
  USING (family_id = current_setting('app.current_family_id', true)::uuid);
```

Application layer helper:
```typescript
await withFamilyContext(familyId, async (tx) => {
  // All queries in this callback are auto-scoped
  return tx.select().from(budgetRecords);
});
```

## Consequences

**Positive:**
- Defense in depth: DB enforces isolation even if app layer fails
- No `WHERE family_id = ?` in every query (RLS adds it automatically)
- Easy to audit: every family-scoped table has RLS policy

**Negative:**
- RLS doesn't work for tables without `family_id` (e.g., `families` table itself)
- `current_setting` per-transaction overhead
- Migration order matters (RLS after table creation)
- Some tables need subquery RLS (child_activities → children → family_id)

## Implementation

- 15 tables with RLS policies (`0001_rls.sql`)
- `withFamilyContext()` in `packages/db/src/client.ts`
- Every repository uses `withFamilyContext()` for writes
- RLS migration must run AFTER schema migration

## References

- `packages/db/src/migrations/0001_rls.sql`
- `packages/db/src/client.ts`: `withFamilyContext()` implementation
