# @uyimiz/config — Environment Config Agent Instructions

> Zod environment validation. Used by apps/api only (server-side).

---

## Purpose
Single source of truth for all environment variables.
Validates at startup — app crashes if required env vars missing.

## File: src/env.ts
Contains Zod schema for all env vars.

## Adding New Env Var
1. Add to `envSchema` in `src/env.ts` with appropriate Zod type
2. Add to `.env.example` with placeholder value
3. Add to `.env.development` with dev value
4. Add to GitHub Secrets for production
5. Update docs if it affects deployment

## Current Variables (Quick Reference)
```
DATABASE_URL          → PostgreSQL connection string
REDIS_URL             → Redis connection string
BOT_TOKEN             → Telegram Bot API token (BotFather)
BOT_WEBHOOK_DOMAIN    → Production webhook domain
BOT_WEBHOOK_PATH      → Webhook path (default: /bot/webhook)
OPENAI_API_KEY        → OpenAI (optional, for AI features)
WEATHER_API_KEY       → Weather API (optional)
PORT                  → Server port (default: 3000)
JWT_SECRET            → JWT signing secret (min 32 chars)
MINIAPP_URL           → Mini App URL for bot inline button
NODE_ENV              → development | production | test
```
