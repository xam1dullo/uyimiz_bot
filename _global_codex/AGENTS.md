# Global Codex Rules — @uyimiz_bot Personal Config
# 
# O'RNATISH: Bu faylni ~/.codex/AGENTS.md ga ko'chiring:
#   cp _global_codex/AGENTS.md ~/.codex/AGENTS.md
#
# Bu fayl barcha loyihalaringiz uchun ishlaydi.

## Identity
You are working on @uyimiz_bot — a family management Telegram bot.
Always check the project's own AGENTS.md before starting any task.

## Language
- Code: English (variables, functions, comments)
- Commit messages: English only
- User-facing strings: NEVER hardcode — use i18n keys
- When explaining to me: Uzbek language preferred

## Package Manager
ALWAYS pnpm. Replace any npm/yarn commands automatically:
- npm install pkg     → pnpm add pkg
- npm run dev         → pnpm dev
- npx something       → pnpm dlx something
- yarn add pkg        → pnpm add pkg

## My Stack (Quick Reference)
- Backend: NestJS + Fastify + nestjs-telegraf + Drizzle ORM + PostgreSQL + Redis + BullMQ
- Frontend: Vite + React + TanStack (Router + Query) + Zustand + Tailwind + shadcn/ui
- Mini App: @telegram-apps/sdk-react
- Public: Astro
- Monorepo: Turborepo + pnpm workspaces

## Architecture: DDD Modular Monolith
- Each module: domain → application → infrastructure → presentation
- Reference module: apps/api/src/modules/budget/ (use as template)
- Repository pattern: interface in domain, Drizzle impl in infrastructure
- Always use withFamilyContext() for family-scoped DB queries (RLS)

## Before Finishing Any Task
1. `pnpm lint` (if available in package)
2. `pnpm typecheck` (if available in package)
3. Remove debug `console.log` statements
4. Check no secrets/tokens hardcoded

## Working Agreements
- Ask before adding new production npm dependencies
- Ask before modifying packages/db/src/schema/index.ts
- Ask before changing packages/shared/src/types/ (breaking)
- Always write unit tests for new domain entities
- Never edit existing migration SQL files — create new ones

## Typical Task Commands

### Scaffold new module:
```
Create module {name} in apps/api/src/modules/{name}/
following DDD pattern. Use budget module as template.
```

### Add DB table:
```
Add {table} to packages/db/src/schema/index.ts
Generate migration. Show SQL before applying.
If family-scoped: add RLS policy.
```

### Add bot command:
```
Add @Command('{cmd}') to apps/api/src/modules/{module}/presentation/bot/
Use i18n. Include /cancel support.
```

### Add Mini App page:
```
Create route in apps/miniapp/src/routes/{page}/
Use TanStack Query for data. Zustand for UI state only.
Use Telegram theme colors via useThemeParams().
```

## Common File Paths
```
Root AGENTS.md:           ./AGENTS.md
Backend module:           apps/api/src/modules/{name}/
DB schema:                packages/db/src/schema/index.ts
DB migrations:            packages/db/src/migrations/
Shared types:             packages/shared/src/types/
Mini App routes:          apps/miniapp/src/routes/
Mini App components:      apps/miniapp/src/components/app/
i18n UZ:                  apps/api/locales/uz/messages.json
i18n RU:                  apps/api/locales/ru/messages.json
i18n EN:                  apps/api/locales/en/messages.json
Docker:                   docker-compose.yml
Caddy:                    Caddyfile
```
