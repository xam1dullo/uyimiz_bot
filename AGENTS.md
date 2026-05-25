# @uyimiz_bot — AI Agent Instructions (Global)

> This file is read by: OpenAI Codex, GitHub Copilot, Claude Code, Cursor, Windsurf.
> Hierarchy: This root AGENTS.md applies to ALL packages and apps.
> Each app/package has its own AGENTS.md with additional rules.

This project uses **bd** (beads) for issue tracking. Run `bd prime` for full workflow context.

> **Architecture in one line:** Issues live in a local Dolt database
> (`.beads/dolt/`); cross-machine sync uses `bd dolt push/pull` (a
> git-compatible protocol), stored under `refs/dolt/data` on your git
> remote — separate from `refs/heads/*` where your code lives.
> `.beads/issues.jsonl` is a passive export, not the wire protocol.
>
> See [SYNC_CONCEPTS.md](https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md)
> for the one-screen overview and anti-patterns (don't treat JSONL as the
> source of truth; don't `bd import` during normal operation; don't
> reach for third-party Dolt hosting before trying the default).

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work atomically
bd close <id>         # Complete work
bd dolt push          # Push beads data to remote
```

---

## Project Overview

**@uyimiz_bot** — Family management Telegram bot + Mini App + Admin Panel + Public Web.
Multi-language: Uzbek (uz), Russian (ru), English (en).
Target: CIS & Central Asia families, global expansion.

---

## Monorepo Structure

```
uyimiz/                         ← Turborepo + pnpm root
├── apps/
│   ├── api/                    ← NestJS + Fastify + Telegraf (bot + REST)
│   ├── miniapp/                ← Vite + React + TMA (Telegram Mini App)
│   ├── web/                    ← Astro + Tailwind (public landing)
│   └── admin/                  ← Vite + React + shadcn/ui (admin panel)
├── packages/
│   ├── db/                     ← Drizzle ORM schema + migrations + client
│   ├── shared/                 ← Shared TypeScript types + constants
│   └── config/                 ← Zod environment validation schemas
├── AGENTS.md                   ← THIS FILE
├── CLAUDE.md                   ← Claude Code specific instructions
├── turbo.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

---

## Package Manager

- ALWAYS use `pnpm` — NEVER use npm or yarn
- Add to specific app: `pnpm --filter @uyimiz/api add <pkg>`
- Add to specific package: `pnpm --filter @uyimiz/db add <pkg>`
- Install all deps: `pnpm install` (from root)
- Build all: `pnpm turbo build`
- Dev all: `pnpm turbo dev`

---

## Tech Stack (DO NOT deviate)

| Layer | Technology |
|-------|-----------|
| Backend framework | NestJS 11 + Fastify adapter |
| Bot | nestjs-telegraf + Telegraf v4 |
| ORM | Drizzle ORM (NOT TypeORM, NOT Prisma) |
| Database | PostgreSQL 16 |
| Cache | Redis + cache-manager + CacheableMemory (L1+L2) |
| Queue | BullMQ |
| Mini App | Vite + React 19 + TypeScript + @telegram-apps/sdk-react |
| Routing (miniapp) | TanStack Router |
| Data fetching | TanStack Query v5 |
| State | Zustand v4 |
| UI components | Tailwind CSS + shadcn/ui |
| Public web | Astro v5 |
| Validation | Zod v3 |
| Monorepo | Turborepo + pnpm |
| Container | Docker + docker-compose |
| Reverse proxy | Caddy v2 |

---

## Architecture: DDD Modular Monolith

### Module Structure (STRICTLY follow)

Each module in `apps/api/src/modules/{module-name}/` MUST have:

```
{module-name}/
  domain/
    entities/
      {name}.entity.ts            ← Pure class, NO framework decorators
    repositories/
      {name}.repository.interface.ts  ← Interface ONLY
    events/
      {name}-{action}.event.ts    ← Domain events
    value-objects/                ← (optional)
  application/
    commands/
      {action}/
        {action}.command.ts       ← Plain data class
        {action}.handler.ts       ← @Injectable(), uses repo interface
    queries/
      {name}/
        {name}.query.ts
        {name}.handler.ts
    dtos/
      {action}.dto.ts             ← class-validator + Zod
  infrastructure/
    repositories/
      drizzle-{name}.repository.ts  ← Drizzle implementation
  presentation/
    bot/
      {name}.update.ts            ← @Update() Telegraf handlers
      {name}.wizard.ts            ← Wizard scenes (FSM multi-step)
    http/
      {name}.controller.ts        ← REST for Mini App
      {name}.dto.ts               ← HTTP request/response DTOs
  {name}.module.ts                ← NestJS module binding
```

### Bounded Contexts (modules list)

```
family          → Oila va a'zolar boshqaruvi
budget          → Moliyaviy yozuvlar
tasks           → Yumushlar + gamification
reminders       → Eslatmalar + scheduler
birthdays       → Tug'ilgan kun eslatmalari
children        → Farzand profili va tarbiya
health          → Sog'liq kuzatuvi
diet            → Parhez va ovqatlanish
medications     → Dorilar va jadval
first-aid       → Birinchi tibbiy yordam KB
important-tasks → Muhim ishlar ro'yxati
```

---

## TypeScript Rules (MANDATORY)

- `"strict": true` — ALWAYS, no exceptions
- NO `any` type — use `unknown` + type guards
- Named exports ONLY — NO default exports
- Interfaces for shapes, types for unions/aliases
- Use `Result<T, E>` pattern in domain/application layers for error handling
- All async functions: explicit error handling (no unhandled promise rejections)
- Generic types: descriptive names (`TData` not `T` where helpful)

---

## Cross-Package Import Rules

```
✅ apps/api       → imports @uyimiz/db, @uyimiz/shared, @uyimiz/config
✅ apps/miniapp   → imports @uyimiz/shared, @uyimiz/config
✅ apps/web       → imports @uyimiz/shared
✅ apps/admin     → imports @uyimiz/shared, @uyimiz/config
✅ packages/db    → imports @uyimiz/shared (types only)

❌ NEVER import from another app's src/ directly
❌ NEVER import @uyimiz/db in frontend apps
❌ NEVER add circular dependencies between packages
```

---

## Protected Files — ASK before modifying

- `packages/db/src/schema/index.ts` — schema changes break migrations
- `packages/shared/src/types/**` — shared types affect all consumers
- `packages/config/src/env.ts` — env changes need all apps updated
- `turbo.json` — affects build order
- `pnpm-workspace.yaml` — affects all packages
- `docker-compose.yml` — infra changes
- `packages/db/src/migrations/**` — NEVER edit existing migrations, only ADD new

---

## Git Conventions

- Commit format: `feat(api): add budget module`, `fix(miniapp): task list pagination`
- Scopes: `api`, `miniapp`, `web`, `admin`, `db`, `shared`, `config`, `infra`, `ci`
- Branch naming: `feat/budget-module`, `fix/reminder-snooze`, `chore/update-deps`
- Before commit ALWAYS run:
  ```bash
  pnpm lint
  pnpm typecheck
  ```

---

## Environment Variables

- NEVER hardcode secrets, tokens, or passwords
- All env vars validated via `@uyimiz/config` (Zod schema)
- Files: `.env.development`, `.env.test`, `.env.staging`, `.env.production`
- `.env.example` always kept up-to-date

---

## Logging

- Use NestJS `Logger` class — NEVER `console.log` in production code
- Log levels: `error`, `warn`, `log`, `debug`, `verbose`
- NEVER log: passwords, tokens, health data, full request bodies

---

## DO NOT (Global)

- ❌ Do NOT use `console.log` — use NestJS Logger
- ❌ Do NOT hardcode strings visible to users — use i18n keys
- ❌ Do NOT run migrations in test suite
- ❌ Do NOT install packages at repo root unless build tooling
- ❌ Do NOT create default exports
- ❌ Do NOT use `any` type
- ❌ Do NOT skip error handling

---

## i18n Rules

- All user-facing strings in bot/miniapp go through i18n
- Keys format: `module.action.description` → `budget.add.success`
- Files: `apps/api/locales/{uz,ru,en}/messages.json`
- NEVER hardcode Uzbek, Russian or English strings in handler code

---

## When Adding a New Feature — Checklist

- [ ] Create domain entity (pure class)
- [ ] Create repository interface
- [ ] Create command/query + handler
- [ ] Create Drizzle repository implementation
- [ ] Create bot wizard/update (presentation)
- [ ] Create HTTP controller (for Mini App)
- [ ] Register in NestJS module
- [ ] Add i18n keys for all 3 languages
- [ ] Write unit tests for domain entity
- [ ] Update AGENTS.md if new pattern introduced

---

## Non-Interactive Shell Commands

**ALWAYS use non-interactive flags** with file operations to avoid hanging on confirmation prompts.

Shell commands like `cp`, `mv`, and `rm` may be aliased to include `-i` (interactive) mode on some systems.

**Use these forms instead:**
```bash
cp -f source dest           # NOT: cp source dest
mv -f source dest           # NOT: mv source dest
rm -f file                  # NOT: rm file
rm -rf directory            # NOT: rm -r directory
cp -rf source dest          # NOT: cp -r source dest
```

**Other commands that may prompt:**
- `scp` - use `-o BatchMode=yes`
- `ssh` - use `-o BatchMode=yes`
- `apt-get` - use `-y` flag
- `brew` - use `HOMEBREW_NO_AUTO_UPDATE=1` env var

---
## 🔁 AI Workflow Orchestratsiyasi: GSD-2 + beads + AGENTS.md

Bu loyihada BARCHA AI agentlar (Codex, Copilot Agent, Claude Code, Cursor, boshqalar)
quyidagi tartib bo‘yicha harakat qiladi. Hech qachon bu tartibdan chetga chiqma.

### 0. Har doim boshlashdan oldin

1) AGENTS.md (shu fayl) ni o‘qi.
2) Agar mavjud bo‘lsa, quyidagilarni BOR-YO‘QLIGINI tekshir:
   - `.gsd/` papkasi va `ROADMAP.md`
   - `.beads/` papkasi
   - `apps/*/AGENTS.md` (masalan, backend bo‘lsa `apps/api/AGENTS.md`)
3) Loyiha stack va qoidalarini shu fayllardan ol.

### 1. Vazifani qayerdan olish — PRIORITET TARTIBI

Vazifani o‘zing o‘ylab topma — har doim quyidagi tartibda top:

1) **GSD-2 (asosi)**  
   - Agar `.gsd/` mavjud bo‘lsa:  
     - Hozirgi taskni GSD dan ol:
       - Agar CLI orqali ishlayotgan bo‘lsang: `/gsd status` va `/gsd next`  
       - Yoki `STATE.md` va `ROADMAP.md` dan "current task" ni o‘qi.
   - Agar GSD task berib qo‘ygan bo‘lsa — SHUNI bajar, boshqasiga sakrama.

2) **beads (task graph)**  
   - Agar `.beads/` mavjud bo‘lsa:  
     - `bd list --status ready` yoki `bd list --status in-progress` ga mos taskni tanla.  
     - `blocked` tasklarni e’tiborsiz qoldir, avval parent/dep ni hal qil.

3) **Agar GSD ham, beads ham task bermagan bo‘lsa**  
   - Foydalanuvchidan so‘ra:  
     - "Qaysi modul ustida ishlaymiz?"  
     - "Bu task GSD roadmap ga kiritilganmi?"  
   - Keyin olingan ma’lumotga ko‘ra YANGI task ni GSD yoki beads ichida yaratish taklifini ber.

### 2. Har bir TASK uchun STANDART PROSESS

Har qanday kod yozishdan oldin:

1) **Kontext to‘plash:**
   - AGENTS.md (root) + tegishli `apps/.../AGENTS.md` ni yana bir marta tez ko‘zdan kechir.
   - Tegishli modulning papkasini top (masalan: `apps/api/src/modules/budget/`).
   - `ROADMAP.md` va `CONTEXT.md` dan shu modulga tegishli qismni o‘qi.
   - Agar beads ishlatilayotgan bo‘lsa: `bd show {task-id}` bilan task tafsilotlarini o‘qi.

2) **Reja yozish (GSD style):**
   - Kichik, aniq plan yoz:
     - qaysi fayllar o‘zgaradi
     - qaysi endpoint/handler/modulega touch qilasan
     - DB o‘zgaradimi yoki yo‘q

3) **Keyin**gina kod o‘zgartirishni boshlash.

### 3. Kod yozilgandan keyin — CHECKLIST

Har bitta task yakunida:

1) AGENTS.md qoidalariga mosligini tekshir:
   - pnpm ishlatilganmi?
   - DDD structure buzilmaganmi?
   - withFamilyContext() ishlatilganmi? (agar family-scoped DB bo‘lsa)
   - i18n ishlatilganmi? (user-facing matn bo‘lsa)

2) Test & lint:
   - Imkon bo‘lsa: `pnpm lint`, `pnpm typecheck`, `pnpm test` (tegishli package uchun).

3) **beads status update**:
   - Agar task beads ichida bo‘lsa:  
     - Qay holatga keldi: `bd done`, yoki `bd block` (agar hal bo‘lmagan muammo bo‘lsa).
   - Agar **yangi sub-tasklar chiqsa**, ularga mos `bd add` qilishni taklif qil.

4) **GSD-2 bilan sinxronizatsiya**:
   - Task ustida ishlash GSD roadmapdagi slice bilan bog‘liq bo‘lsa:
     - GSD kontekst fayllariga (CONTEXT.md / KNOWLEDGE.md / DECISIONS.md) zarur bo‘lsa qisqa yozuv qo‘shishni taklif qil.

### 4. Qarorlar zanjiri (Decision hierarchy)

Agar ziddiyat bo‘lsa:

1) **Security va RLS qoidalari** (RLS, withFamilyContext, token handling) — doimo birinchi.
2) Keyin: **AGENTS.md qoidalari** (arxitektura, stack, patterns).
3) Shundan keyin: **GSD-2 roadmap** (qaysi modul birinchi).
4) Keyin: **beads tasklar** (qaysi konkret ish).
5) Foydalanuvchi so‘ragan "quick change" — faqat yuqoridagilarga zid bo‘lmasa.

### 5. Agentlar o‘rtasida bo‘linish

- **Codex CLI**:
  - Terminalga bog‘liq ishlar: commandlar, skriptlar, scaffolding
  - Ko‘p faylli refactorlarni boshlash

- **GitHub Copilot Agent (VS Code)**:
  - VS Code ichida konkret fayl/funksiyani yozish yoki o‘zgartirish
  - Test yozish, kichik refactorlar

- **Claude Code**:
  - Katta arxitekturaviy o‘zgarishlar
  - DDD modulni noldan to‘liq chiqish (domain → app → infra → presentation)
  - Beads + GSD kontekstini o‘qib, reja tuzish

Hammasi bir xil qoidalarga bo‘ysunadi va AGENTS.md + GSD + beads ni kontekst sifatida ishlatadi.

---

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:7510c1e2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Rules
- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

### Session Completion
**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

1. File issues for remaining work
2. Run quality gates (tests, linters, builds)
3. Update issue status — close finished, update in-progress
4. **PUSH TO REMOTE** (MANDATORY):
   ```bash
   git pull --rebase && git push && git status
   ```
5. Clean up — clear stashes, prune remote branches
6. Verify — all changes committed AND pushed
7. Hand off — provide context for next session

**CRITICAL:** Work is NOT complete until `git push` succeeds. NEVER leave work stranded locally.
<!-- END BEADS INTEGRATION -->
