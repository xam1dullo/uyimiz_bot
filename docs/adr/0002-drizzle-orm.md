# ADR 0002: Drizzle ORM over TypeORM/Prisma

**Status:** Accepted  
**Date:** 2026-05-26

## Context

Need an ORM for PostgreSQL that:
- TypeScript-first with full type inference
- Supports PostgreSQL-specific features (RLS, pg_notify, JSONB)
- Works with NestJS without decorator-heavy entity classes
- AI agents can generate queries predictably (SQL-like syntax)
- Migration management

## Decision

**Drizzle ORM** with `drizzle-orm/postgres-js` driver.

## Consequences

**Positive:**
- SQL-like query builder: `db.select().from(users).where(eq(users.id, id))`
- Full TypeScript inference from schema
- No decorators on domain entities (domain layer stays pure)
- Native PostgreSQL features: RLS via `set_config`, pg_notify triggers
- Generated migrations are readable SQL

**Negative:**
- Smaller ecosystem than Prisma (fewer tutorials, examples)
- No built-in migrations runner (use `drizzle-kit migrate` separately)
- Relation queries need explicit joins (not auto-resolved like Prisma)

## Alternatives Considered

- **TypeORM**: Decorator-heavy, ActiveRecord pattern conflicts with DDD entities, migration quality issues
- **Prisma**: Good DX but separate schema language, generated client is opaque, harder to write raw SQL
- **Knex.js**: No type inference from schema, too low-level for DDD repositories

## Implementation Notes

- Schema defined in `packages/db/src/schema/index.ts`
- Client factory with connection pooling (max 20)
- `withFamilyContext()` helper for RLS-enabled queries
- Migrations in `packages/db/src/migrations/` (numbered SQL files)

## References

- `packages/db/src/schema/index.ts`: 17 tables, enums, indexes, FKs
- `packages/db/src/client.ts`: Connection pool + RLS helper
- `packages/db/drizzle.config.ts`: Migration config
