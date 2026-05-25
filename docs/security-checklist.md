# Security Checklist

## Database
- [x] RLS on 16 family-scoped tables
- [x] withFamilyContext() in all repositories
- [x] Database error sanitization (no raw error leaks)
- [x] Connection pooling (max 20)

## API
- [x] JWT HS256 signing (min 32-char secret)
- [x] Refresh token rotation (7-day expiry)
- [x] Rate limiting (30 req/min)
- [x] CORS: Telegram + MiniApp origins only
- [x] Security headers (nosniff, X-Frame-Options, XSS)
- [x] Body limit: 1MB

## Bot
- [x] BOT_TOKEN validation at startup
- [x] Error messages sanitized (no user data in logs)
- [x] Rate limiting per user
- [x] Callback query < 0.5s answer
- [x] Webhook HTTPS only (production)

## Environment
- [x] All secrets in .env (never committed)
- [x] Zod validation at startup
- [x] Production: Redis auth, PostgreSQL password

## CI/CD
- [x] TypeCheck gate
- [x] Build gate
- [x] Test gate (43 tests)
- [x] DB schema check
