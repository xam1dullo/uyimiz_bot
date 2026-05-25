# @uyimiz_bot — API Reference

## Authentication
All API endpoints (except health) require JWT Bearer token:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Health
```
GET /api/health
→ { status: "ok", timestamp: "..." }
```

### Auth
```
POST /api/auth/token
Body: { telegramId, familyId?, role? }
→ { accessToken, refreshToken, expiresIn }

POST /api/auth/refresh
Body: { refreshToken }
→ { accessToken, expiresIn }

POST /api/auth/verify
Body: { token }
→ { valid: boolean, user: JwtPayload }
```

### Family
```
GET /api/family/:id
GET /api/family/:id/members
POST /api/family/invite/generate
POST /api/family/invite/validate
Body: { code }
```

### Budget
```
POST /api/budget
Body: { familyId, type, categoryId, amount, createdBy, description?, txDate? }

GET /api/budget?familyId=xxx&type=income&limit=50
GET /api/budget/balance?familyId=xxx
GET /api/budget/summary?familyId=xxx&year=2026&month=5
GET /api/budget/categories?familyId=xxx
```

## Telegram Bot
- Webhook: POST /bot/webhook
- Commands: /start, /help, /menu, /settings, /app, /poll
- Inline: @uyimiz_bot <query>
- Deep link: https://t.me/uyimiz_bot?start=action=join&code=XXX

## WebSocket (Future)
- Real-time updates via pg_notify → WebSocket
