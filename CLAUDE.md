# @uyimiz_bot — Claude Code Instructions

> Read AGENTS.md first — this file EXTENDS it with Claude-specific guidance.

---

## Memory & Context Management

- Always read `AGENTS.md` at root before starting any task
- Always read the relevant `apps/{app}/AGENTS.md` for the current workspace
- When working on DB changes, always read `packages/db/AGENTS.md`
- Use `TodoWrite` to track multi-step tasks — mark done after each step
- After finishing a task, summarize what files were changed

---

## Monorepo Navigation

When asked about a feature, FIRST check:
1. `packages/db/src/schema/index.ts` — is the table already defined?
2. `apps/api/src/modules/` — is the module already scaffolded?
3. `packages/shared/src/types/` — are the types already shared?

Then proceed with implementation.

---

## Parallel Work (Multi-agent)

When implementing a full module (e.g., "budget"), spawn parallel tasks:
- Task 1: Domain layer (entity + repository interface)
- Task 2: Application layer (commands + queries)
- Task 3: Infrastructure (Drizzle repository)
- Task 4: Presentation (bot wizard + HTTP controller)
- Task 5: Tests

These are independent — run them in parallel subagents.

---

## Code Generation Style

- Write complete, production-ready code — no `// TODO` placeholders
- Include proper error handling in every function
- Follow existing patterns exactly (check neighboring files first)
- When creating a new file, look at a similar existing file as template

---

## Database Work

When modifying schema:
1. Edit `packages/db/src/schema/index.ts`
2. Run: `pnpm --filter @uyimiz/db db:generate`
3. Show the generated migration SQL for review
4. If custom SQL needed (RLS, FTS, triggers): create companion `_custom.sql`
5. Only run `db:migrate` after explicit confirmation

---

## Bot Flow Patterns

Multi-step bot flows use Telegraf Wizard scenes:
```typescript
@Scene('BUDGET_ADD_SCENE')
export class BudgetAddWizard {
  @WizardStep(0) askAmount(ctx) { ... }
  @WizardStep(1) askCategory(ctx) { ... }
  @WizardStep(2) askNote(ctx) { ... }
  @WizardStep(3) confirm(ctx) { ... }
}
// Always include cancel handler at every step
@Hears('cancel') async cancel(ctx) { await ctx.scene.leave(); }
```

---

## Error Messages

User-facing error messages in bot:
- Short, friendly, actionable
- In user's language (i18n)
- Always offer a way forward: "Try /cancel and start again"
- Never expose internal errors, stack traces, or IDs

---

## Testing Guidance

- Domain entities: unit test all public methods
- Handlers: integration test with real DB (test container)
- Bot flows: mock Telegraf context
- HTTP controllers: supertest with JWT
- Run after changes: `pnpm --filter @uyimiz/api test:unit`

---

## What NOT to do (Claude-specific)

- Do NOT refactor working code unless explicitly asked
- Do NOT change architectural patterns without discussion
- Do NOT add new dependencies without asking
- Do NOT modify migration files — always create new ones
- Do NOT remove i18n keys — they may be used elsewhere

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
