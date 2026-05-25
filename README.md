# @uyimiz_bot — AI Agent Config Files

Bu papka vibe coding uchun barcha AI agent konfiguratsiya fayllarini o'z ichiga oladi.

## O'rnatish

### 1. Global Codex config (bir marta)
```bash
mkdir -p ~/.codex
cp _global_codex/AGENTS.md ~/.codex/AGENTS.md
```

### 2. Loyiha ichida joylashtirish
Bu papkadagi barcha fayllarni loyihangiz root ga ko'chiring:

```bash
# Loyiha root ga o'ting
cd /path/to/your/uyimiz

# AGENTS.md va CLAUDE.md ni root ga
cp /path/to/this/AGENTS.md ./AGENTS.md
cp /path/to/this/CLAUDE.md ./CLAUDE.md

# .vscode/ papkasini
cp -r /path/to/this/.vscode ./.vscode

# Har app/package uchun
cp /path/to/this/apps/api/AGENTS.md ./apps/api/AGENTS.md
cp /path/to/this/apps/miniapp/AGENTS.md ./apps/miniapp/AGENTS.md
cp /path/to/this/apps/web/AGENTS.md ./apps/web/AGENTS.md
cp /path/to/this/apps/admin/AGENTS.md ./apps/admin/AGENTS.md
cp /path/to/this/packages/db/AGENTS.md ./packages/db/AGENTS.md
cp /path/to/this/packages/shared/AGENTS.md ./packages/shared/AGENTS.md
cp /path/to/this/packages/config/AGENTS.md ./packages/config/AGENTS.md
```

## Fayl xaritasi

```
AGENTS.md                    → Root: Codex + Copilot + barcha AI (global)
CLAUDE.md                    → Claude Code uchun qo'shimcha
_global_codex/AGENTS.md      → ~/.codex/AGENTS.md ga ko'chiring (personal)
.vscode/
  settings.json              → VS Code + Copilot Agent sozlamalari
  mcp.json                   → MCP serverlar (PostgreSQL, filesystem, GitHub)
  extensions.json            → Tavsiya etilgan extensionlar
  tasks.json                 → Terminal tasklar
apps/api/AGENTS.md           → Backend NestJS DDD rules
apps/miniapp/AGENTS.md       → Telegram Mini App rules
apps/web/AGENTS.md           → Astro public site rules
apps/admin/AGENTS.md         → Admin panel rules
packages/db/AGENTS.md        → Drizzle schema + migration rules (CRITICAL)
packages/shared/AGENTS.md    → Shared types rules
packages/config/AGENTS.md    → Zod env config rules
```

## Qaysi AI qaysi faylni o'qiydi

| AI Tool | Fayllar |
|---------|---------|
| OpenAI Codex CLI | ~/.codex/AGENTS.md + project AGENTS.md hierarchy |
| GitHub Copilot Agent | .vscode/settings.json + AGENTS.md (workspace) |
| Claude Code | CLAUDE.md + AGENTS.md hierarchy |
| Cursor | .cursorrules yoki AGENTS.md |
| Windsurf | AGENTS.md |
