#!/usr/bin/env bash
# ─── Handoff — compact context for next session ───
# Matt Pocock: handoff skill
# Usage: ./scripts/handoff.sh "what will the next session do?"
set -euo pipefail
cd "$(dirname "$0")/.."

NEXT="${1:-continue development}"
OUT="/tmp/uyimiz_bot_handoff_$(date +%Y%m%d_%H%M).md"

cat > "$OUT" << HANDSOFF
# uyimiz_bot — Agent Handoff

**Generated:** $(date '+%Y-%m-%d %H:%M')
**Next session:** ${NEXT}

## Current State

- Git branch: $(git branch --show-current)
- Last commit: $(git log -1 --oneline)
- Last typecheck: $(pnpm typecheck > /dev/null 2>&1 && echo "✅ pass" || echo "❌ fail")

## Suggested Skills

- /grill-with-docs — review plans against CONTEXT.md
- /tdd — implement features test-first
- /verify-before-complete — quality gate before claiming done
- /improve-codebase-architecture — find deepening opportunities

## Project Structure

- Monorepo: Turborepo + pnpm (apps/api, apps/miniapp, apps/web, apps/admin)
- Backend: NestJS 11 + Fastify + Telegraf
- ORM: Drizzle (packages/db/src/schema/index.ts)
- i18n: Custom service (apps/api/src/infrastructure/i18n/)
- RLS: PostgreSQL withFamilyContext() (packages/db/src/client.ts)
- RAG: MCP server at /Users/admin/Developer/Projects/my-mcp/

## Key Files

| File | Purpose |
|------|---------|
| CONTEXT.md | Domain glossary + module depth |
| docs/adr/ | 5 architectural decisions |
| .gsd/STATE.md | Current sprint status |
| .beads/issues.jsonl | Task tracker |
| AGENTS.md | Global agent instructions |

## Active Modules (DDD)

| Module | Status | Depth |
|--------|:---:|:---:|
| Family | ✅ Production | Deep |
| Budget | ✅ Production | Deep |
| Reminders | ✅ Production | Deep |
| Tasks | ✅ Ready | Medium |
| Birthdays | ✅ Ready | Shallow |
| Children | ✅ Ready | Shallow |
| HealthRecords | ✅ Ready | Shallow |
| Diet | ✅ Ready | Shallow |
| FirstAid | ✅ Ready | Medium |
| Medications | ✅ Ready | Medium |

## Quality Gate

Run before claiming complete:
\`\`\`bash
./scripts/quality-gate.sh
\`\`\`

## RAG

Search Obsidian before coding:
\`\`\`
@obsidian-rag search_notes "your query"
@obsidian-rag rag_query "context you need"
\`\`\`

## Sub-Agents

\`\`\`bash
./ai.sh "task"        # OpenCode (default)
./ai.sh -f "task"     # DeepSeek FREE
./ai.sh -p "task"     # GitHub Copilot
\`\`\`
HANDSOFF

echo "Handoff written: $OUT"
echo "---"
cat "$OUT"
