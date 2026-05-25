# ADR 0001: DDD Modular Monolith Architecture

**Status:** Accepted  
**Date:** 2026-05-26

## Context

Need a backend architecture that:
- Supports 11+ bounded contexts (family, budget, tasks, reminders, birthdays, children, health, diet, medications, first-aid, important-tasks)
- Each context has independent lifecycle but shares infrastructure (DB, cache, queue)
- AI agents must navigate and modify code predictably
- Single deployment unit (one Docker container)

## Decision

**Domain-Driven Design modular monolith** with strict layer separation:

```
{module}/
  domain/          ← Pure classes, no framework decorators
    entities/      ← Business objects with behavior
    repositories/  ← Interfaces only
    events/        ← Domain events
  application/     ← Use cases
    commands/      ← CQRS command + handler
    queries/       ← CQRS query + handler
  infrastructure/  ← Technical implementations
    repositories/  ← Drizzle ORM implementations
  presentation/    ← External interfaces
    bot/           ← Telegraf handlers + wizards
    http/          ← NestJS controllers
```

## Consequences

**Positive:**
- Clear module boundaries (AI agents can modify one module without breaking others)
- High cohesion within modules, loose coupling between
- Easy to extract to microservices later if needed
- Testable at domain layer without infrastructure

**Negative:**
- File count increases (4 layers × 11 modules = many files)
- Boilerplate for simple CRUD modules (mitigated by template pattern)
- Must enforce layer discipline (reviews catch violations)

## Alternatives Considered

- **Microservices**: Too complex for current stage, adds network latency, deployment overhead
- **Flat NestJS modules**: Loses domain encapsulation, harder for AI agents to navigate
- **Clean Architecture**: Overkill, ports/adapters add ceremony without proportional benefit

## References

- AGENTS.md (root): Architecture section
- `packages/db/src/schema/index.ts`: Database schema
- `apps/api/src/modules/family/`: Reference implementation
