# @uyimiz/admin — Admin Panel Agent Instructions

> Vite + React + shadcn/ui. Internal tool for platform management.
> Access: super_admin role only. IP whitelist + 2FA.

---

## Stack
- Vite + React 19 + TypeScript
- shadcn/ui + Tailwind CSS
- TanStack Table (data tables)
- TanStack Query (data fetching)
- Recharts (charts)

## Pages
- /dashboard → KPIs: DAU/MAU, families, revenue
- /families  → Oilalar ro'yxati, boshqaruv
- /users     → Foydalanuvchilar
- /logs      → Audit logs, error logs
- /queues    → BullMQ Bull Board embed
- /settings  → Platform settings

## Auth
- JWT (separate from Mini App JWT)
- super_admin role required for all routes
- Refresh token: 30 days
- 2FA: TOTP (Google Authenticator)

## Rules
- Table pagination: server-side (NOT client-side for large datasets)
- Export: CSV download for all tables
- Confirmation dialogs for destructive actions
- All actions logged to audit_logs

## DO NOT
- ❌ No public access — admin only
- ❌ No deletion without confirmation modal
- ❌ No bulk operations without explicit count shown
