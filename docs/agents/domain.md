# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — ubiquitous language glossary for @uyimiz_bot DDD terms
- **`docs/adr/`** — architectural decision records (6 ADRs):
  - `0001-ddd-modular-monolith.md` — DDD module pattern
  - `0002-drizzle-orm.md` — ORM choice rationale
  - `0003-custom-i18n.md` — 3-language i18n system
  - `0004-postgres-rls.md` — row-level security design
  - `0005-obsidian-rag-mcp.md` — Obsidian-based RAG system
  - `0006-tenant-rls-and-db-roles.md` — RLS + DB role hardening

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context repo (with monorepo packages):

```
/
├── CONTEXT.md                       ← Ubiquitous language
├── docs/adr/                        ← System-wide decisions
│   ├── 0001-ddd-modular-monolith.md
│   └── ...
├── apps/
│   ├── api/                         ← NestJS backend + bot
│   │   └── AGENTS.md                ← App-specific rules
│   ├── miniapp/                     ← Telegram Mini App
│   │   └── AGENTS.md
│   ├── admin/                       ← Admin panel
│   │   └── AGENTS.md
│   └── web/                         ← Public landing
│       └── AGENTS.md
└── packages/
    ├── db/                          ← Drizzle ORM + schema
    ├── shared/                      ← Shared types
    └── config/                      ← Zod env validation
```

## Domain modules (bounded contexts)

| Module | Context |
|---|---|
| `family` | Oilalar (families) va a'zolar (members) |
| `budget` | Moliyaviy yozuvlar (budget records) |
| `tasks` | Yumushlar (tasks) + gamification |
| `reminders` | Eslatmalar (reminders) + scheduler |
| `birthdays` | Tug'ilgan kunlar (birthdays) |
| `auth` | Auth + Telegram initData |
| `onboarding` | Onboarding flow |

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/grill-with-docs`).

## Vocabulary reference (from CONTEXT.md)

- **Family** (Oila) — aggregate root, identified by `family_code`
- **Member** (A'zo) — user belonging to a family, has `role` (owner/admin/member/child)
- **Task** (Yumush/Vazifa) — assigned work with points for gamification
- **Budget Record** — income/expense entry with category
- **Reminder** (Eslatma) — scheduled notification with snooze support
- **Birthday** (Tug'ilgan kun) — recurring annual reminder

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0001 (DDD modular monolith) — but worth reopening because…_
