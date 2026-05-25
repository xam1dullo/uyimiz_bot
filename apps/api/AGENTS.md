# @uyimiz/api — Backend Agent Instructions

> Extends root AGENTS.md. Read root AGENTS.md first.

---

## App Overview

NestJS 11 + Fastify adapter.
Handles: Telegram Bot webhook, REST API for Mini App, BullMQ workers, scheduled jobs.

Entry point: `src/main.ts`
Config: `src/app.module.ts`

---

## Module Location

All feature modules: `src/modules/{module-name}/`
Infrastructure: `src/infrastructure/` (database, redis, queues, pg-notify)

---

## Database Access Rules

- ALWAYS import from `@uyimiz/db`: tables, operators, `withFamilyContext`, `sql`
- ALWAYS use `withFamilyContext(familyId, async (tx) => {...})` for family-scoped queries
  ```typescript
  // ✅ Correct
  return withFamilyContext(familyId, async (tx) => {
    return tx.select().from(budgetRecords).where(eq(budgetRecords.familyId, familyId));
  });

  // ❌ Wrong — bypasses RLS
  return this.db.select().from(budgetRecords).where(eq(budgetRecords.familyId, familyId));
  ```
- Connection pool max: 20 (configured in `packages/db/src/client.ts`)
- NEVER write raw SQL strings — use Drizzle query builder or tagged `sql` template

---

## Dependency Injection Tokens

```typescript
// DB token
export const DB_TOKEN = 'DRIZZLE_DB';
@Inject(DB_TOKEN) private readonly db: DB

// Repository tokens (each module defines its own)
export const BUDGET_REPO = Symbol('IBudgetRepository');
@Inject(BUDGET_REPO) private readonly repo: IBudgetRepository
```

---

## BullMQ Queues

Queue names defined in `src/infrastructure/queues/queue.constants.ts`:
```
REMINDERS     → delayed: eslatma yuborish
NOTIFICATIONS → immediate: bildirishnoma
BIRTHDAY      → scheduled: tug'ilgan kun
REPORTS       → heavy: PDF hisobot
CLEANUP       → cron: DB tozalash
```

Rules:
- ALWAYS save `jobId` to DB when creating delayed/scheduled jobs
- Job options: `{ attempts: 3, backoff: { type: 'exponential', delay: 2000 } }`
- `removeOnComplete: { count: 100 }`, `removeOnFail: { count: 50 }`
- When deleting a reminder: also call `queue.remove(jobId)` to cancel job

---

## Bot Handler Patterns

### Simple command:
```typescript
@Command('balance')
async balance(@Ctx() ctx: Context) {
  const user = await this.userService.fromCtx(ctx);
  const result = await this.getBudgetBalance.execute(user.familyId);
  await ctx.reply(ctx.i18n.t('budget.balance.message', { balance: result.balance }));
}
```

### Multi-step Wizard:
```typescript
@Scene('REMINDER_ADD')
export class ReminderAddWizard {
  @WizardStep(0) async step1(@Ctx() ctx: WizardContext) {
    await ctx.reply(ctx.i18n.t('reminder.wizard.step1'));
    ctx.wizard.next();
  }
  @WizardStep(1) async step2(@Ctx() ctx: WizardContext) { ... }

  @Hears(/^(❌|\/cancel)$/i)
  async cancel(@Ctx() ctx: WizardContext) {
    await ctx.scene.leave();
    await ctx.reply(ctx.i18n.t('common.cancelled'));
  }
}
```

### Inline keyboard callback:
```typescript
@Action(/^task_done:(.+)$/)
async taskDone(@Ctx() ctx: Context) {
  const taskId = ctx.match[1];
  // ... handle
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup(undefined); // remove buttons
}
```

---

## Error Handling Pattern

```typescript
// Domain layer — throw
throw new DomainError('BUDGET_AMOUNT_INVALID', 'Amount must be positive');

// Application layer — catch and convert
try {
  return await this.repo.save(data);
} catch (e) {
  if (e instanceof DomainError) return Result.fail(e);
  throw e; // re-throw unexpected errors
}

// Bot presentation layer — user-friendly
try {
  await this.handler.execute(cmd);
  await ctx.reply(ctx.i18n.t('budget.add.success'));
} catch (e) {
  this.logger.error('Budget add failed', e);
  await ctx.reply(ctx.i18n.t('common.error.tryAgain'));
}
```

---

## Security Rules

- NEVER expose `telegramId` in HTTP REST responses
- ALWAYS validate that `familyId` belongs to the authenticated user
- Rate limiting: `@Throttle({ default: { limit: 30, ttl: 60000 } })` on all controllers
- Bot: validate `ctx.from.id` exists before processing
- HTTP: `initData` HMAC validation via `TelegramAuthGuard` on all `/api/*` routes

---

## i18n Usage

```typescript
// In bot handler:
ctx.i18n.t('budget.add.success', { amount: 150000, category: 'food' })

// Key format: {module}.{action}.{type}
// budget.add.success = "✅ {amount} UZS — {category} qo'shildi"
// budget.add.error   = "❌ Xatolik yuz berdi. Qayta urining."
// common.cancelled   = "❌ Bekor qilindi"
// common.error.tryAgain = "Xatolik yuz berdi. /cancel bosib qayta urining."
```

---

## Testing

```bash
# Unit tests (domain entities + handlers, no DB)
pnpm --filter @uyimiz/api test:unit

# Integration tests (real test DB)
pnpm --filter @uyimiz/api test:integration

# All tests
pnpm --filter @uyimiz/api test

# Watch mode
pnpm --filter @uyimiz/api test:watch
```

Test DB: uses `.env.test` with separate PostgreSQL instance.
Seed: `src/test/fixtures/` — factory functions for test data.

---

## Common Mistakes to Avoid

- ❌ Querying family tables without `withFamilyContext`
- ❌ Hardcoding text strings (use i18n)
- ❌ Forgetting `await ctx.answerCbQuery()` on inline button handlers
- ❌ Not saving BullMQ `jobId` to DB (can't cancel later)
- ❌ Using `@InjectRepository` — we use custom DI tokens
- ❌ Importing Drizzle schema directly in domain entities
