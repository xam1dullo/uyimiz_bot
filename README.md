# 🏠 @uyimiz_bot

**Oilaviy boshqaruv Telegram bot + Mini App + Admin Panel + Public Landing**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red)](https://nestjs.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

Telegram orqali oilangizni boshqaring: byudjet, yumushlar, eslatmalar, tug'ilgan kunlar.

🌐 **Tillar:** 🇺🇿 O'zbekcha | 🇷🇺 Русский | 🇬🇧 English

---

## 🏗️ Arxitektura

```
┌─────────────────────────────────────────────────────┐
│                   @uyimiz_bot                        │
├───────────────┬──────────────┬───────────┬──────────┤
│  apps/api     │ apps/miniapp │ apps/web  │ apps/admin│
│  NestJS+Fastify│ Vite+React  │ Astro 5   │ Vite+React│
│  Telegraf     │ TMA SDK      │ Tailwind  │ shadcn/ui │
├───────────────┴──────────────┴───────────┴──────────┤
│               packages/                              │
│  ┌─────────┬──────────┬─────────────────────────┐   │
│  │   db    │  shared  │         config          │   │
│  │ Drizzle │  Types   │    Zod env validation   │   │
│  └─────────┴──────────┴─────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│               Infrastructure                        │
│  PostgreSQL 16 │ Redis │ BullMQ │ Docker │ Caddy    │
└─────────────────────────────────────────────────────┘
```

### DDD Modular Monolith (4-layer)

```
Module (e.g., budget)
├── domain/          (pure entity, repository interface, domain events)
├── application/     (commands, queries, handlers, DTOs)
├── infrastructure/  (Drizzle repository, external adapters)
└── presentation/    (bot handlers, HTTP controllers, wizards)
```

### Modullar

| Module | Status | Description |
|--------|--------|-------------|
| `auth` | ✅ | JWT + Telegram initData HMAC verification |
| `family` | ✅ | Oila yaratish, kod bilan qo'shilish, a'zolar |
| `budget` | ✅ | Daromad/xarajat, kategoriyalar, balans, hisobot |
| `tasks` | ✅ | Yumushlar ro'yxati, status, ballar |
| `reminders` | ✅ | Eslatmalar + BullMQ delayed jobs |
| `birthdays` | ✅ | Tug'ilgan kunlar, avtomatik eslatma |
| `onboarding` | ✅ | Til tanlash, oila yaratish wizard |

### Security

- **Auth:** Telegram Mini App `initData` HMAC-SHA256 tekshiruvi
- **RLS:** PostgreSQL Row-Level Security — barcha family-scoped jadvallarda
- **JWT:** Access + Refresh token (15 min / 7 kun)
- **Throttling:** HTTP-only rate limiting (Telegraf context'larga ta'sir qilmaydi)

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/xam1dullo/uyimiz_bot.git
cd uyimiz_bot

# 2. Install deps
pnpm install

# 3. Setup env
cp packages/config/.env.example packages/config/.env.development
# Edit: BOT_TOKEN, DATABASE_URL, REDIS_URL, JWT_SECRET

# 4. Start infra (Docker)
docker compose up -d postgres redis

# 5. Push DB schema
pnpm --filter @uyimiz/db db:push

# 6. Run
pnpm turbo dev
```

### URL'lar

| App | URL |
|-----|-----|
| **API** | `http://localhost:3001` |
| **Swagger** | `http://localhost:3001/api/docs` |
| **Mini App** | `http://localhost:5173` |
| **Admin** | `http://localhost:5174` |
| **Web** | `http://localhost:4321` |

### Bot

Telegram: [@uyimiz_bot](https://t.me/uyimiz_bot)

Bot komandalari:
- `/start` — Ro'yxatdan o'tish va onboarding
- `/menu` — Asosiy menyu
- `/cancel` — Har qanday amalni bekor qilish

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS 11 + Fastify + Telegraf v4 |
| ORM | Drizzle ORM + PostgreSQL 16 |
| Cache | Redis + cache-manager |
| Queue | BullMQ |
| Mini App | Vite + React 19 + TanStack Router + TanStack Query |
| Admin | Vite + React 19 + shadcn/ui + Tailwind |
| Web | Astro 5 + Tailwind |
| Validation | Zod v3 |
| Monorepo | Turborepo + pnpm |
| Infra | Docker + docker-compose + Caddy |

---

## 📂 Project Structure

```
uyimiz_bot/
├── apps/
│   ├── api/           # NestJS backend + Telegram bot
│   ├── miniapp/       # Telegram Mini App (React)
│   ├── web/           # Public landing (Astro)
│   └── admin/         # Admin panel (React)
├── packages/
│   ├── db/            # Drizzle schema + migrations + client
│   ├── shared/        # Shared types + constants
│   └── config/        # Zod env validation
├── scripts/           # Dev scripts, quality gate
├── docker-compose.yml
└── turbo.json
```

---

## 🔐 RLS (Row-Level Security)

Barcha oila ma'lumotlari PostgreSQL RLS orqali himoyalangan:

```sql
ALTER TABLE budget_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_records FORCE ROW LEVEL SECURITY;

CREATE POLICY budget_records_family_isolation ON budget_records
  USING (family_id = current_setting('app.current_family_id')::uuid);
```

`withFamilyContext()` har bir repository so'rovida RLS kontekstini o'rnatadi.

---

## 🧪 Testing

```bash
pnpm test                    # All tests
pnpm --filter @uyimiz/api test  # Backend tests
pnpm typecheck               # TypeScript checks
bash scripts/quality-gate.sh # Full quality gate
```

---

## 📄 License

MIT © 2024-2026
