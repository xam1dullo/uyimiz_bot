# 🏠 @uyimiz_bot

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/Drizzle-ORM-0F0?logo=drizzle&logoColor=white" alt="Drizzle"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Docker-🐳-2496ED?logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Telegram-Bot-26A5E4?logo=telegram&logoColor=white" alt="Telegram"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
</p>

<p align="center"><strong>Oilaviy boshqaruv platformasi — Telegram bot, Mini App, Admin Panel, Public Landing</strong></p>

<p align="center">🇺🇿 O'zbekcha &nbsp;|&nbsp; 🇷🇺 Русский &nbsp;|&nbsp; 🇬🇧 English</p>

---

## 📐 Arxitektura

```mermaid
graph TB
    subgraph "Frontend"
        MA["📱 Mini App<br/>Vite + React 19<br/>TMA SDK<br/>TanStack Router/Query"]
        AD["🛠️ Admin Panel<br/>Vite + React 19<br/>shadcn/ui + Tailwind"]
        PW["🌐 Public Web<br/>Astro 5 + Tailwind<br/>uz / ru / en"]
    end

    subgraph "Backend — NestJS + Fastify"
        BOT["🤖 Telegram Bot<br/>Telegraf v4 + nestjs-telegraf<br/>Scenes · Wizards · Menus<br/>Streaming Service"]
        API["🔌 REST API<br/>Fastify + Swagger<br/>JWT Auth + Guards<br/>BullMQ + WebSocket"]
    
        subgraph "DDD Modules"
            direction LR
            FM["👨‍👩‍👧‍👦 Family"]
            BG["💰 Budget"]
            TK["📋 Tasks"]
            RM["🔔 Reminders"]
            BD["🎂 Birthdays"]
            ON["🚀 Onboarding"]
        end

        subgraph "Infrastructure"
            CA["⚡ Cache<br/>Redis L1+L2"]
            QU["📬 Queue<br/>BullMQ"]
            WS["🔌 WebSocket<br/>pg_notify"]
            I18N["🌍 i18n<br/>uz/ru/en"]
            DB["🗄️ Database<br/>Drizzle ORM<br/>PostgreSQL 16"]
        end
    end

    MA --> API
    AD --> API
    PW --> API
    BOT --> DB
    API --> FM & BG & TK & RM & BD & ON
    FM & BG & TK & RM & BD --> DB
    DB --> CA & WS
    RM --> QU
```

### DDD 4-Layer Architecture

```mermaid
graph LR
    subgraph "Presentation"
        P1["Bot Handlers"]
        P2["HTTP Controllers"]
        P3["Wizards / Scenes"]
    end
    
    subgraph "Application"
        A1["Commands"]
        A2["Queries"]
        A3["Handlers"]
    end
    
    subgraph "Domain"
        D1["Entities"]
        D2["Repository Interfaces"]
        D3["Domain Events"]
    end
    
    subgraph "Infrastructure"
        I1["Drizzle Repositories"]
        I2["Drizzle ORM"]
        I3["PostgreSQL + RLS"]
    end

    P1 & P2 & P3 --> A1 & A2 & A3
    A1 & A2 & A3 --> D2
    I1 -.-> D2
    I1 --> I2 --> I3
```

### Request Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant TG as 📱 Telegram
    participant BOT as 🤖 Bot (Telegraf)
    participant H as 🔧 Handler
    participant APP as 📦 Application
    participant DB as 🗄️ PostgreSQL
    
    U->>TG: /start
    TG->>BOT: Update (message)
    BOT->>H: @Start()
    H->>H: StreamingService.stream()
    H-->>U: 👋 Welcome message (progressive)
    U->>TG: "Yangi oila yaratish"
    TG->>BOT: OnboardingWizard
    BOT->>APP: CreateFamilyCommand
    APP->>DB: withFamilyContext(RC tx)
    DB-->>APP: Family + Invite Code
    APP-->>BOT: FamilyEntity
    BOT-->>U: ✅ Oila yaratildi! Kod: ABCD
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/xam1dullo/uyimiz_bot.git
cd uyimiz_bot

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp packages/config/.env.example packages/config/.env.development
# Edit: BOT_TOKEN (from @BotFather), DATABASE_URL, REDIS_URL, JWT_SECRET

# 4. Start infrastructure
docker compose up -d postgres redis

# 5. Push database schema
pnpm --filter @uyimiz/db db:push

# 6. Apply custom migrations (RLS, triggers, indexes)
docker exec -i $(docker ps -qf name=postgres) psql -U postgres -d uyimiz_dev \
  < packages/db/src/migrations/0001_rls.sql
docker exec -i $(docker ps -qf name=postgres) psql -U postgres -d uyimiz_dev \
  < packages/db/src/migrations/0002_triggers.sql
docker exec -i $(docker ps -qf name=postgres) psql -U postgres -d uyimiz_dev \
  < packages/db/src/migrations/0003_rls_hardening.sql
docker exec -i $(docker ps -qf name=postgres) psql -U postgres -d uyimiz_dev \
  < packages/db/src/migrations/0004_performance_indexes.sql

# 7. Run all apps
pnpm turbo dev
```

### URL'lar

| App | Local | Production |
|-----|-------|------------|
| **API** | `http://localhost:3001` | `https://api.uyimiz.uz` |
| **Swagger Docs** | `http://localhost:3001/api/docs` | `https://api.uyimiz.uz/api/docs` |
| **Mini App** | `http://localhost:5173` | `https://t.me/uyimiz_bot/app` |
| **Admin Panel** | `http://localhost:5174` | `https://admin.uyimiz.uz` |
| **Public Web** | `http://localhost:4321` | `https://uyimiz.uz` |
| **Telegram Bot** | [@uyimiz_bot](https://t.me/uyimiz_bot) | [@uyimiz_bot](https://t.me/uyimiz_bot) |

---

## 🧱 Tech Stack

<table>
<tr>
<td width="50%">

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 + Fastify adapter |
| Bot | Telegraf v4 + nestjs-telegraf |
| ORM | Drizzle ORM |
| Database | PostgreSQL 16 |
| Cache | Redis + cache-manager (L1+L2) |
| Queue | BullMQ |
| Auth | JWT + Telegram initData HMAC |
| Validation | Zod v3 + class-validator |
| Docs | Swagger (OpenAPI) |
| WebSocket | Socket.io + pg_notify |
| API | REST (Fastify) |

</td>
<td width="50%">

### Frontend
| Layer | Technology |
|-------|-----------|
| Mini App | Vite + React 19 + TMA SDK |
| Admin | Vite + React 19 + shadcn/ui |
| Web | Astro 5 + Tailwind CSS |
| Routing | TanStack Router |
| Data | TanStack Query v5 |
| State | Zustand v4 |
| Charts | Recharts |
| Styling | Tailwind CSS |

### DevOps
| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm |
| Container | Docker + docker-compose |
| Proxy | Caddy v2 |
| CI | GitHub Actions |

</td>
</tr>
</table>

---

## 📂 Project Structure

```
uyimiz_bot/
├── apps/
│   ├── api/                          # NestJS backend + Telegram bot
│   │   └── src/
│   │       ├── bot/                  #   Bot handlers, menus, wizards, core
│   │       ├── modules/              #   DDD bounded contexts
│   │       │   ├── auth/             #   JWT + Telegram initData auth
│   │       │   ├── family/           #   Oila boshqaruvi
│   │       │   ├── budget/           #   Byudjet (daromad/xarajat)
│   │       │   ├── tasks/            #   Yumushlar + gamification
│   │       │   ├── reminders/        #   Eslatmalar + scheduler
│   │       │   ├── birthdays/        #   Tug'ilgan kunlar
│   │       │   └── onboarding/       #   Ro'yxatdan o'tish wizard
│   │       └── infrastructure/       #   Cache, Queue, i18n, WebSocket, DB
│   ├── miniapp/                      # Telegram Mini App
│   ├── web/                          # Public landing (uz/ru/en)
│   └── admin/                        # Admin panel
├── packages/
│   ├── db/                           # Drizzle schema + migrations + RLS
│   ├── shared/                       # Shared types + constants + i18n keys
│   └── config/                       # Zod environment validation
├── scripts/                          # start-dev.sh, quality-gate.sh
├── docker-compose.yml                # Dev infra
├── docker-compose.prod.yml           # Production
└── turbo.json                        # Turborepo pipeline
```

---

## 🔐 Security

### Auth Flow

```mermaid
sequenceDiagram
    participant MA as 📱 Mini App
    participant API as 🔌 API
    participant TG as 📡 Telegram
    
    MA->>TG: WebApp.initData
    TG-->>MA: initData (signed)
    MA->>API: POST /auth/token { initData }
    API->>API: HMAC-SHA256 verify
    API-->>MA: JWT access + refresh
    MA->>API: Bearer <token>
    API->>API: JWT verify + guard
    API-->>MA: Data
```

### RLS (Row-Level Security)

```sql
-- All family-scoped tables have RLS enforced
ALTER TABLE budget_records FORCE ROW LEVEL SECURITY;
ALTER TABLE tasks FORCE ROW LEVEL SECURITY;
ALTER TABLE reminders FORCE ROW LEVEL SECURITY;

-- Each family can only see their own data
CREATE POLICY family_isolation ON budget_records
  USING (family_id = current_setting('app.current_family_id')::uuid);
```

**4 migrations:** schema → RLS → triggers → performance indexes

---

## 🏗️ Module Detail: Budget (DDD Example)

```mermaid
graph TB
    subgraph "budget module"
        subgraph "domain/"
            E["BudgetRecord Entity<br/>+ create() factory<br/>+ amount validation"]
            RI["IBudgetRepository<br/>Interface"]
        end
        
        subgraph "application/"
            CMD["AddRecordCommand<br/>+ AddRecordHandler"]
            QRY["GetBalanceQuery<br/>+ GetBalanceHandler"]
        end
        
        subgraph "infrastructure/"
            DR["DrizzleBudgetRepository<br/>implements IBudgetRepository<br/>+ withFamilyContext(RC)"]
        end
        
        subgraph "presentation/"
            BW["BudgetAddWizard<br/>@Wizard('BUDGET_ADD')"]
            BC["BudgetController<br/>@Controller('api/budget')"]
        end
    end

    BW --> CMD
    BC --> CMD & QRY
    CMD & QRY --> RI
    DR -.-> RI
```

---

## 📊 Features & Status

| Feature | Bot | Mini App | Admin | API |
|---------|:---:|:--------:|:-----:|:---:|
| **Ro'yxatdan o'tish** | ✅ Wizard | — | — | ✅ |
| **Oila yaratish** | ✅ | ✅ | ✅ | ✅ |
| **Byudjet** | ✅ Wizard | ✅ | — | ✅ |
| **Yumushlar** | ✅ | ✅ | — | ✅ |
| **Eslatmalar** | ✅ | ✅ | — | ✅ |
| **Tug'ilgan kunlar** | ✅ | ✅ | — | ✅ |
| **Sozlamalar** | ✅ Menu | ✅ | — | — |
| **Admin Dashboard** | — | — | ✅ KPI | — |
| **Audit Logs** | — | — | ✅ | — |
| **Leaderboard** | 🚧 | 🚧 | — | — |
| **Health / Diet** | 📅 V1 | 📅 V1 | — | 📅 |

---

## 🧪 Quality

```bash
pnpm typecheck          # All packages: ✅
pnpm test               # 98 tests: ✅
bash scripts/quality-gate.sh  # typecheck + lint + build + db-schema
```

### Quality Gate

| Check | Status |
|-------|--------|
| TypeScript (`strict: true`) | ✅ |
| TypeCheck (5 packages) | ✅ |
| Build (4 apps) | ✅ |
| Tests (98 passing) | ✅ |
| ESLint | 🚧 v9 config |

---

## 🤖 Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Ro'yxatdan o'tish va onboarding wizard |
| `/menu` | Asosiy menyu |
| `/cancel` | Har qanday amalni bekor qilish |
| `/balance` | Balansni ko'rish |

### Onboarding Flow

```mermaid
stateDiagram-v2
    [*] --> Language: /start
    Language --> FamilyChoice: Til tanlandi
    FamilyChoice --> CreateFamily: Yangi oila
    FamilyChoice --> EnterCode: Kod bilan qo'shilish
    CreateFamily --> MainMenu: ✅ Yaratildi
    EnterCode --> MainMenu: ✅ Qo'shildi
    MainMenu --> Budget: 💰 Byudjet
    MainMenu --> Tasks: 📋 Yumushlar
    MainMenu --> Reminders: 🔔 Eslatmalar
    MainMenu --> Settings: ⚙️ Sozlamalar
```

---

## 📦 Scripts

```bash
pnpm turbo dev          # Barcha app'lar
pnpm turbo build        # Production build
pnpm test               # Barcha testlar
pnpm typecheck          # TypeScript tekshiruvi
bash scripts/start-dev.sh   # API ni ishga tushirish
```

---

## 📄 License

MIT © 2024-2026
