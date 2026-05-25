# Codebase Map

Generated: 2026-05-25T20:59:33Z | Files: 138 | Described: 0/138
<!-- gsd:codebase-meta {"generatedAt":"2026-05-25T20:59:33Z","fingerprint":"334a5ecb427fd309330a29cf27b40a5667984275","fileCount":138,"truncated":false} -->

### (root)/
- `.eslintrc.json`
- `.gitignore`
- `.prettierrc`
- `AGENTS.md`
- `Caddyfile`
- `CLAUDE.md`
- `docker-compose.prod.yml`
- `docker-compose.yml`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `README.md`
- `tsconfig.json`
- `turbo.json`
- `uyimiz_bot_toliq_texnik_topshiriq_TZ_v2.md`

### .beads/
- `.beads/.gitignore`
- `.beads/config.yaml`
- `.beads/interactions.jsonl`
- `.beads/issues.jsonl`
- `.beads/metadata.json`
- `.beads/README.md`

### .beads/hooks/
- `.beads/hooks/post-checkout`
- `.beads/hooks/post-merge`
- `.beads/hooks/pre-commit`
- `.beads/hooks/pre-push`
- `.beads/hooks/prepare-commit-msg`

### _global_codex/
- `_global_codex/AGENTS.md`

### apps/admin/
- `apps/admin/AGENTS.md`

### apps/api/
- `apps/api/AGENTS.md`
- `apps/api/Dockerfile`
- `apps/api/Dockerfile.dev`
- `apps/api/nest-cli.json`
- `apps/api/package.json`
- `apps/api/tsconfig.build.json`
- `apps/api/tsconfig.json`
- `apps/api/tsconfig.tsbuildinfo`

### apps/api/locales/en/
- `apps/api/locales/en/messages.json`

### apps/api/locales/ru/
- `apps/api/locales/ru/messages.json`

### apps/api/locales/uz/
- `apps/api/locales/uz/messages.json`

### apps/api/src/
- `apps/api/src/app.module.ts`
- `apps/api/src/main.ts`

### apps/api/src/bot/
- `apps/api/src/bot/bot.module.ts`
- `apps/api/src/bot/bot.update.ts`

### apps/api/src/infrastructure/cache/
- `apps/api/src/infrastructure/cache/cache.module.ts`
- `apps/api/src/infrastructure/cache/cache.service.ts`

### apps/api/src/infrastructure/database/
- `apps/api/src/infrastructure/database/database-error.filter.ts`
- `apps/api/src/infrastructure/database/database.module.ts`

### apps/api/src/infrastructure/filters/
- `apps/api/src/infrastructure/filters/all-exceptions.filter.ts`
- `apps/api/src/infrastructure/filters/telegraf-exception.filter.ts`

### apps/api/src/infrastructure/interceptors/
- `apps/api/src/infrastructure/interceptors/logging.interceptor.ts`

### apps/api/src/infrastructure/queues/
- `apps/api/src/infrastructure/queues/queue.constants.ts`
- `apps/api/src/infrastructure/queues/queue.module.ts`

### apps/api/src/modules/auth/
- `apps/api/src/modules/auth/auth.middleware.ts`
- `apps/api/src/modules/auth/auth.module.ts`

### apps/api/src/modules/auth/controllers/
- `apps/api/src/modules/auth/controllers/auth.controller.ts`

### apps/api/src/modules/auth/guards/
- `apps/api/src/modules/auth/guards/jwt-auth.guard.ts`
- `apps/api/src/modules/auth/guards/telegram-auth.guard.ts`
- `apps/api/src/modules/auth/guards/throttler-behind-proxy.guard.ts`
- `apps/api/src/modules/auth/guards/tma-auth.guard.ts`

### apps/api/src/modules/auth/services/
- `apps/api/src/modules/auth/services/jwt.service.ts`

### apps/api/src/modules/budget/
- `apps/api/src/modules/budget/budget.module.ts`

### apps/api/src/modules/budget/application/commands/add-record/
- `apps/api/src/modules/budget/application/commands/add-record/add-record.command.ts`
- `apps/api/src/modules/budget/application/commands/add-record/add-record.handler.ts`

### apps/api/src/modules/budget/application/queries/get-balance/
- `apps/api/src/modules/budget/application/queries/get-balance/get-balance.handler.ts`
- `apps/api/src/modules/budget/application/queries/get-balance/get-balance.query.ts`

### apps/api/src/modules/budget/application/queries/get-category-report/
- `apps/api/src/modules/budget/application/queries/get-category-report/get-category-report.handler.ts`
- `apps/api/src/modules/budget/application/queries/get-category-report/get-category-report.query.ts`

### apps/api/src/modules/budget/application/queries/get-monthly-summary/
- `apps/api/src/modules/budget/application/queries/get-monthly-summary/get-monthly-summary.handler.ts`
- `apps/api/src/modules/budget/application/queries/get-monthly-summary/get-monthly-summary.query.ts`

### apps/api/src/modules/budget/domain/entities/
- `apps/api/src/modules/budget/domain/entities/budget-record.entity.ts`

### apps/api/src/modules/budget/domain/repositories/
- `apps/api/src/modules/budget/domain/repositories/budget.repository.interface.ts`

### apps/api/src/modules/budget/infrastructure/repositories/
- `apps/api/src/modules/budget/infrastructure/repositories/drizzle-budget.repository.ts`

### apps/api/src/modules/budget/presentation/bot/
- `apps/api/src/modules/budget/presentation/bot/budget.update.ts`
- `apps/api/src/modules/budget/presentation/bot/budget.wizard.ts`
- `apps/api/src/modules/budget/presentation/bot/category.system.ts`

### apps/api/src/modules/budget/presentation/http/
- `apps/api/src/modules/budget/presentation/http/budget-categories.controller.ts`
- `apps/api/src/modules/budget/presentation/http/budget.controller.ts`

### apps/api/src/modules/family/
- `apps/api/src/modules/family/family.module.ts`

### apps/api/src/modules/family/application/commands/create-family/
- `apps/api/src/modules/family/application/commands/create-family/create-family.command.ts`
- `apps/api/src/modules/family/application/commands/create-family/create-family.handler.ts`

### apps/api/src/modules/family/application/commands/join-family/
- `apps/api/src/modules/family/application/commands/join-family/join-family.command.ts`
- `apps/api/src/modules/family/application/commands/join-family/join-family.handler.ts`

### apps/api/src/modules/family/application/queries/get-family/
- `apps/api/src/modules/family/application/queries/get-family/get-family.handler.ts`
- `apps/api/src/modules/family/application/queries/get-family/get-family.query.ts`

### apps/api/src/modules/family/domain/entities/
- `apps/api/src/modules/family/domain/entities/family.entity.ts`
- `apps/api/src/modules/family/domain/entities/member.entity.ts`

### apps/api/src/modules/family/domain/repositories/
- `apps/api/src/modules/family/domain/repositories/family.repository.interface.ts`

### apps/api/src/modules/family/infrastructure/repositories/
- `apps/api/src/modules/family/infrastructure/repositories/drizzle-family.repository.ts`

### apps/api/src/modules/family/presentation/bot/
- `apps/api/src/modules/family/presentation/bot/family.update.ts`
- `apps/api/src/modules/family/presentation/bot/invite.system.ts`

### apps/api/src/modules/family/presentation/http/
- `apps/api/src/modules/family/presentation/http/family-members.controller.ts`
- `apps/api/src/modules/family/presentation/http/family.controller.ts`
- `apps/api/src/modules/family/presentation/http/invite.controller.ts`

### apps/api/src/modules/health/
- `apps/api/src/modules/health/health.controller.ts`
- `apps/api/src/modules/health/health.module.ts`

### apps/api/src/modules/onboarding/
- `apps/api/src/modules/onboarding/onboarding.module.ts`
- `apps/api/src/modules/onboarding/onboarding.wizard.ts`

### apps/api/src/modules/reminders/
- `apps/api/src/modules/reminders/reminders.module.ts`

### apps/api/src/modules/reminders/application/commands/create-reminder/
- `apps/api/src/modules/reminders/application/commands/create-reminder/create-reminder.command.ts`
- `apps/api/src/modules/reminders/application/commands/create-reminder/create-reminder.handler.ts`

### apps/api/src/modules/reminders/application/commands/snooze-reminder/
- `apps/api/src/modules/reminders/application/commands/snooze-reminder/snooze-reminder.command.ts`
- `apps/api/src/modules/reminders/application/commands/snooze-reminder/snooze-reminder.handler.ts`

### apps/api/src/modules/reminders/domain/entities/
- `apps/api/src/modules/reminders/domain/entities/reminder.entity.ts`

### apps/api/src/modules/reminders/domain/repositories/
- `apps/api/src/modules/reminders/domain/repositories/reminder.repository.interface.ts`

### apps/api/src/modules/reminders/infrastructure/repositories/
- `apps/api/src/modules/reminders/infrastructure/repositories/drizzle-reminder.repository.ts`

### apps/api/src/modules/reminders/presentation/bot/
- `apps/api/src/modules/reminders/presentation/bot/reminder.update.ts`

### apps/miniapp/
- `apps/miniapp/AGENTS.md`

### apps/web/
- `apps/web/AGENTS.md`

### packages/config/
- `packages/config/.env.example`
- `packages/config/AGENTS.md`
- `packages/config/package.json`
- `packages/config/tsconfig.json`

### packages/config/src/
- `packages/config/src/env.ts`
- `packages/config/src/index.ts`

### packages/db/
- `packages/db/AGENTS.md`
- `packages/db/drizzle.config.ts`
- `packages/db/package.json`
- `packages/db/tsconfig.json`

### packages/db/src/
- `packages/db/src/client.ts`
- `packages/db/src/index.ts`

### packages/db/src/migrations/
- `packages/db/src/migrations/0001_rls.sql`
- `packages/db/src/migrations/0002_triggers.sql`

### packages/db/src/schema/
- `packages/db/src/schema/index.ts`

### packages/shared/
- `packages/shared/AGENTS.md`
- `packages/shared/package.json`
- `packages/shared/tsconfig.json`

### packages/shared/src/
- `packages/shared/src/index.ts`

### packages/shared/src/constants/
- `packages/shared/src/constants/categories.ts`
- `packages/shared/src/constants/languages.ts`
- `packages/shared/src/constants/limits.ts`

### packages/shared/src/types/
- `packages/shared/src/types/budget.types.ts`
- `packages/shared/src/types/family.types.ts`
- `packages/shared/src/types/health.types.ts`
- `packages/shared/src/types/reminder.types.ts`
- `packages/shared/src/types/task.types.ts`
- `packages/shared/src/types/user.types.ts`

### packages/shared/src/utils/
- `packages/shared/src/utils/currency.ts`
- `packages/shared/src/utils/date.ts`
