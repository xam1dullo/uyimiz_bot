# ADR 0003: Custom i18n over @nestjs/i18n

**Status:** Accepted  
**Date:** 2026-05-26

## Context

Need multi-language support for:
- Telegram bot messages (uz, ru, en)
- Inline keyboard labels
- Wizard step prompts
- Error messages with interpolation

## Decision

**Custom I18nService** (150 lines) instead of `@nestjs/i18n` or `nestjs-i18n`.

```typescript
// Usage:
i18n.t(lang, 'budget.add.success', { amount: '5000' })
// → "✅ 5 000 UZS qo'shildi" (uz)
```

## Consequences

**Positive:**
- Zero external dependencies
- Simple JSON locale files (agents can edit easily)
- Dot-notation key lookup with `{param}` interpolation
- Auto-fallback to Uzbek on missing keys
- Fast: files read at startup, cached in memory

**Negative:**
- No pluralization rules (manually handle with separate keys)
- No ICU message format support
- No hot-reload (manual `.reload()` call)
- No built-in date/number formatting

## Alternatives Considered

- **@nestjs/i18n**: Full-featured but heavy, requires setup config, overkill for 3 languages
- **nestjs-i18n**: Similar to @nestjs/i18n, deprecated
- **i18next**: Client-side library, not designed for server-side NestJS injection

## Implementation

- `apps/api/src/infrastructure/i18n/i18n.service.ts`
- `apps/api/src/infrastructure/i18n/i18n.module.ts` (@Global)
- Locale files: `apps/api/locales/{uz,ru,en}/messages.json`
- Agent integration: `getUserLang(ctx)` determines language from session

## References

- `apps/api/locales/uz/messages.json`: 60+ keys
- `apps/api/src/infrastructure/i18n/i18n.service.ts`: Implementation
