# @uyimiz_bot — Domain Context / Ubiquitous Language

> Source of truth for domain terms AND architecture vocabulary.  
> Updated by grill-with-docs and improve-codebase-architecture skills.

## Domain Glossary

### Core

| Term | Definition |
|------|-----------|
| **Family (Oila)** | RLS boundary. Group of users sharing budget, tasks, reminders. Has name + unique invite code. |
| **Family Member** | Telegram user in one family. Role: `admin` | `parent` | `child` | `guest`. |
| **Invite Code** | Short code for joining a family. One-time use, time-limited. |
| **Onboarding** | FSM wizard: language → has-family? → enter/create → menu. |

### Budget

| Term | Definition |
|------|-----------|
| **Budget Record** | Entity: one income or expense. Stored in `budget_records`. |
| **Category** | Label: salary, food, rent... Global defaults + per-family custom. |
| **Balance** | `SUM(income) - SUM(expense)` for a family. Cached in Redis. |

### Tasks

| Term | Definition |
|------|-----------|
| **Task (Yumush)** | Chore assignment. Status: `pending → in_progress → completed | cancelled`. |
| **Points** | Gamification: awarded on task completion. Weekly leaderboard. |

### Reminders

| Term | Definition |
|------|-----------|
| **Reminder** | Scheduled notification via Telegram. Type: `one_time | daily | weekly | monthly | yearly`. |
| **Snooze** | Postpone a due reminder. |
| **Job ID** | BullMQ identifier stored in DB. Enables cancel on delete. |

### Birthdays

| Term | Definition |
|------|-----------|
| **Birthday** | Person's birth date. Notify N days before. Family-scoped. |

---

## Architecture Vocabulary

From `improve-codebase-architecture/LANGUAGE.md`. Use these terms exactly — no substitutes.

| Term | Definition | Anti-term |
|------|-----------|-----------|
| **Module** | Anything with interface + implementation (function, class, package). Scale-agnostic. | component, service |
| **Interface** | Everything caller must know: types, invariants, errors, ordering, config. | API, signature |
| **Implementation** | Code inside a module. Distinct from Adapter. | — |
| **Depth** | Behaviour per interface-unit. Deep = lot of behaviour behind small interface. | — |
| **Seam** | Where interface lives. Place behaviour can change without editing in-place. | boundary |
| **Adapter** | Concrete thing satisfying interface at a seam. Role, not substance. | implementation |
| **Leverage** | Caller benefit from depth. One impl → N callers. | — |
| **Locality** | Maintainer benefit. Fix once → fixed everywhere. | cohesion |
| **Deletion test** | Imagine deleting module. Complexity vanishes = pass-through. Complexity reappears = earned keep. | — |

### Principles

- **Interface is the test surface.** Callers and tests cross same seam.
- **One adapter = hypothetical seam. Two adapters = real seam.**
- **Depth is property of interface, not implementation.**
- **Module can have internal seams (private to impl) + external seam (at interface).**

---

## Module Depth (Current)

| Module | Depth | Reason |
|--------|:-----:|--------|
| **Family** | Deep | Create, join, invite, members — 8+ operations behind IFamilyRepository. |
| **Budget** | Deep | Balance calc, monthly summary, category report. Cache-aware. |
| **Reminders** | Deep | Full lifecycle: create→schedule→snooze→deliver. BullMQ worker. |
| **Tasks** | Medium | CRUD + status transitions. Needs wizard deepening. |
| **Birthdays** | Shallow | CRUD only. Interface = implementation. |
| **Onboarding** | Medium | FSM wizard. Session-aware. Hardcoded flow. |
| **Auth** | Medium | JWT + HMAC. InitData verification. Not domain module — cross-cutting. |

---

## Architecture Decisions

| ADR | Topic | Status |
|-----|-------|--------|
| 0001 | DDD Modular Monolith | Accepted |
| 0002 | Drizzle ORM | Accepted |
| 0003 | Custom i18n | Accepted |
| 0004 | PostgreSQL RLS | Accepted |
| 0005 | Result<T,E> error pattern | Accepted |
| 0006 | NestJS lifecycle queue worker | Accepted |

---

## Known Friction (to deepen)

1. **BotUpdate.handleAction** — 60-line string-matching switch. Every new action forces edit. Shallow.
2. **Menu require() imports** — dynamic imports in constructor. Invisible to TypeScript.
3. **Invite controller** — presentation touches Drizzle directly. DDD violation.
4. **any casts** — 29 occurrences erode TypeScript strictness.
5. **Birthday repo interface** — defined in infrastructure, not domain.
