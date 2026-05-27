# Ultra Application Audit Report

**Target:** `uyimiz-vite-premium-2` (vanilla JS prototype) + `apps/miniapp` (React production frontend)  
**Date:** 2026-05-26  
**Auditor:** Pi Agent (virtual audit orchestration)  

---

## 1. Executive Summary

| Metric | Value |
|---|---|
| **Overall health score** | 72 / 100 |
| **Production readiness** | ⚠️ Risky |
| **Biggest risk** | Premium prototype build is broken. React Mini App has zero test coverage. Neither app integrates with Telegram Mini App SDK. |
| **Best part** | Premium CSS design system (1292 lines, 40+ component classes, light+dark tokens, safe-area handling, 3 responsive breakpoints, animation keyframes). Production-grade. |
| **Most urgent fix** | Deprecate premium prototype. Add Telegram SDK integration + test coverage to React Mini App. |

---

## 2. Skills and Instructions Used

| Category | Detail |
|---|---|
| **Local skills found** | `design-an-interface.skill` (1.7 kB), `prototype.skill` (1.7 kB), `ui-ux-pro-max.skill` (215 kB) |
| **Matt Pocock skills applied** | `zoom-out`, `diagnose` (debug-like-expert), `improve-codebase-architecture`, `caveman`, `grill-me`, `grill-with-docs`, `handoff`, `to-issues`, `triage`, `verify-before-complete` |
| **Skill files missing** | `tdd`, `git-guardrails-claude-code` |
| **Workflows simulated** | All — Pi has no Claude Code slash commands. `zoom-out`, `diagnose`, `improve-codebase-architecture` applied by reading SKILL.md and executing workflows manually. |

---

## 3. Repository Map

### Target: `uyimiz-vite-premium-2` (vanilla JS prototype)

| Category | Detail |
|---|---|
| **Stack** | Vite 8 + vanilla JS (ESM), no framework |
| **Package manager** | npm (`package-lock.json`) |
| **Entry points** | `index.html` → `src/main.js` |
| **Routes** | 47 hash routes (`#/dashboard`, `#/budget`, `#/tasks`, etc.) |
| **Shared components** | 7 helpers in `ui.js`: `appShell`, `domainShell`, `card`, `stat`, `pill`, `sheet`, `emptyState` |
| **Styling** | 1292-line CSS (`styles.css`), CSS variables, light/dark via `html[data-theme="dark"]`, no Tailwind |
| **State** | Static data in `data.js` — no real state management |
| **Telegram SDK** | ❌ None — no `@telegram-apps/sdk`, no initData, no viewport |
| **Tests** | ❌ 0 test files |
| **Build** | ❌ **BROKEN** — `vite` package not resolvable (`ERR_MODULE_NOT_FOUND`) |

### React Mini App: `apps/miniapp` (production frontend)

| Category | Detail |
|---|---|
| **Stack** | React 19 + TanStack Router v1 + React Query v5 + Zustand 4.5 + Axios + Vite 8 |
| **Package manager** | pnpm |
| **Routes** | 9: `/`, `/budget`, `/budget/report`, `/tasks`, `/reminders`, `/birthdays`, `/members`, `/leaderboard`, `/settings` |
| **Shared components** | 15 in `premium.tsx` + `app/premium.tsx`, plus `BottomNav`, `Topbar`, `ErrorBoundary`, `Toast` |
| **Styling** | Copied from premium prototype CSS (1285 lines) + additions (19 kB total) |
| **State** | Zustand store: auth, familyId, familyName, members, theme, language |
| **API layer** | `api.ts`: Axios with JWT refresh interceptor, all module endpoints |
| **Tests** | ❌ 0 test files |
| **TypeCheck** | ✅ PASSED |
| **Build** | ✅ PASSED (455 kB JS + 19 kB CSS) |

---

## 4. Checks Run

| Command | Result | Notes |
|---|---|---|
| `pnpm --filter @uyimiz/miniapp typecheck` | ✅ PASSED | No errors |
| `pnpm --filter @uyimiz/miniapp build` | ✅ PASSED | 455 kB JS, 19 kB CSS |
| `npm run build` (premium prototype) | ❌ FAILED | `vite` module not found in node_modules |
| `pnpm typecheck` (monorepo root) | ✅ PASSED | 7/7 packages |
| `pnpm test` (monorepo root) | ✅ PASSED | 98/98 passing (API-side only) |
| `pnpm lint` | ⚠️ NOT RUN | |
| Mini App dev server (port 5173) | ✅ 200 | React Mini App, not premium prototype |
| API dev server (port 3001) | ✅ running | Bot auth returns 201 |
| Admin panel (port 5174) | ✅ 200 | |
| Public web (port 4321) | ✅ 200 | |

---

## 5. Critical Findings

### CRITICAL-001: Premium prototype build is broken

- **Severity:** Critical
- **Confidence:** 1.00
- **Evidence:** `npm run build` → `ERR_MODULE_NOT_FOUND: Cannot find package 'vite/index.js'`. Vite exists in `package.json` as devDependency (`^8.0.14`), `node_modules/` exists but the package is corrupted/incomplete.
- **File(s):** `uyimiz-vite-premium-2/package.json`, `uyimiz-vite-premium-2/node_modules/`
- **Impact:** Cannot build for production, cannot run `vite preview`, cannot deploy. Any prototype changes cannot be verified via build.
- **Recommended fix:** Run `rm -rf node_modules package-lock.json && npm install`, then rebuild. Alternatively, **deprecate the vanilla prototype entirely** since the React Mini App has absorbed its CSS and component patterns.
- **Verification:** `npm run build` succeeds with no errors.

---

### CRITICAL-002: No Telegram Mini App SDK integration

- **Severity:** Critical
- **Confidence:** 1.00
- **Evidence:** Neither `uyimiz-vite-premium-2` nor `apps/miniapp` import or configure `@telegram-apps/sdk-react`. The premium prototype has zero Telegram integration. The React Mini App lists `@telegram-apps/sdk-react` as a dependency but `useTelegramThemeStyle` in `router.tsx` may be a stub.
- **File(s):** `uyimiz-vite-premium-2/src/main.js`, `apps/miniapp/src/router.tsx`, `apps/miniapp/src/components/app/telegram-theme.ts`
- **Impact:** App cannot function as a Telegram Mini App: no back button handling, no viewport expansion, no theme synchronization with Telegram client, no `initData` validation on client side. When loaded inside Telegram, UI will break (viewport not managed, safe-area wrong, theme not synced).
- **Recommended fix:** Verify `@telegram-apps/sdk-react` is properly configured. Add:
  - `useSignal(initData)` for auth
  - `useSignal(viewport)` for safe-area and expand
  - `useSignal(themeParams)` for theme sync
  - `useSignal(backButton)` for navigation
  - Call `WebApp.ready()` and `WebApp.expand()` on mount
- **Verification:** Load Mini App inside Telegram. Confirm: theme matches, viewport expands, back button works.

---

### CRITICAL-003: Zero test coverage in both frontend apps

- **Severity:** Critical
- **Confidence:** 1.00
- **Evidence:** `find apps/miniapp -name "*.test.*" -o -name "*.spec.*"` returns empty. `find uyimiz-vite-premium-2 -name "*.test.*" -o -name "*.spec.*"` returns empty.
- **File(s):** N/A (files don't exist)
- **Impact:** Complete regression risk. Any UI change, route change, or API integration change cannot be verified automatically. Core flows (task completion, budget add, auth) have no automated protection.
- **Recommended fix:** Add at minimum:
  1. `vitest` + `@testing-library/react` for component tests
  2. Route-level smoke tests for all 9 routes
  3. API client mock tests for JWT refresh flow
- **Verification:** `pnpm --filter @uyimiz/miniapp test` runs with ≥5 passing tests.

---

## 6. High Findings

### HIGH-001: innerHTML rendering = XSS vulnerability (premium prototype)

- **Severity:** High
- **Confidence:** 0.95
- **Evidence:** `main.js` sets `app.innerHTML = view()` directly. `pages.js` interpolates user-like data (`family.name`, `task.title`, `transaction.amount`) into HTML template literals with **zero sanitization**. `data.js` contains static data now, but the pattern is dangerous with real API data.
- **File(s):** `uyimiz-vite-premium-2/src/main.js` (`app.innerHTML = view()`), `uyimiz-vite-premium-2/src/pages.js` (all template literal functions)
- **Impact:** If real user data ever flows through this pattern, any field containing `<script>`, `<img onerror>`, or HTML entities would execute in the DOM. DOM-based XSS vector.
- **Recommended fix:** If keeping prototype: use `textContent` for text nodes and `createElement` for structure. React Mini App: JSX already escapes by default — ✅ safe.
- **Verification:** Inject `<img src=x onerror=alert(1)>` into `data.js` task title — in React Mini App, alert should NOT fire. In prototype, it WILL.

---

### HIGH-002: No form validation anywhere

- **Severity:** High
- **Confidence:** 0.95
- **Evidence:** All forms in both apps use raw inputs with no validation. Budget amount input accepts any string. Task creation accepts empty titles. Invite codes have no length/format check. No `required`, `pattern`, `min`, `max` attributes. No client-side validation functions.
- **File(s):** `uyimiz-vite-premium-2/src/pages.js` (budgetAddStep, taskCreatePage, reminderCreatePage), `apps/miniapp/src/routes/tasks/index.tsx` (handleCreate)
- **Impact:** Users can submit empty tasks, negative budgets, invalid invite codes. API errors will be the only feedback — bad UX, wasted server resources.
- **Recommended fix:** Add Zod validation schemas for all form payloads. Add inline validation errors in UI. Validate BEFORE calling mutation.
- **Verification:** Try submitting empty task title — should show inline error, not send to API.

---

### HIGH-003: No error state handling in React Mini App

- **Severity:** High
- **Confidence:** 0.85
- **Evidence:** Pages import `SkeletonList`, `EmptyState` from premium components — but don't use error states. `useQuery` returns `isError` but it's never rendered. Members and leaderboard handle loading but not errors. Reminders has partial handling.
- **File(s):** `apps/miniapp/src/routes/leaderboard/index.tsx` (no error state), `apps/miniapp/src/routes/members/index.tsx`, `apps/miniapp/src/routes/budget/report.tsx`
- **Impact:** Users see blank screens or stale data when API fails. Network failures, auth expiration, or backend errors produce silent failures.
- **Recommended fix:** Every page with `useQuery` must handle: `isLoading` → `<SkeletonList />`, `isError` → `<EmptyState icon="📵" title="Xatolik" action={retry} />`, success → actual content.
- **Verification:** Disconnect API, navigate to each page — all should show error state, not blank.

---

### HIGH-004: No i18n integration in Mini App (hardcoded Uzbek)

- **Severity:** High
- **Confidence:** 1.00
- **Evidence:** All visible strings in route files are hardcoded Uzbek. Zustand store has `language` field but it's never used for string selection. The premium prototype also hardcodes Uzbek strings.
- **File(s):** All files in `apps/miniapp/src/routes/`, `uyimiz-vite-premium-2/src/pages.js`
- **Impact:** Cannot launch in Russian or English markets. TZ specifies trilingual (uz/ru/en). The API has i18n keys in `apps/api/locales/{uz,ru,en}/messages.json` but frontend doesn't use them.
- **Recommended fix:** Load i18n keys from API on app start, or create `lib/i18n.ts` with key-value maps and a `useTranslation` hook. Minimum: extract all strings to constants.
- **Verification:** Switch language in settings, all UI text should change.

---

### HIGH-005: API client error handling is incomplete

- **Severity:** High
- **Confidence:** 0.80
- **Evidence:** `apps/miniapp/src/lib/api.ts` has JWT refresh interceptor but error handling inconsistent. Some endpoints throw raw Axios errors. `toTaskList()` and `toTransactions()` helpers silently swallow malformed data (return `[]` on parse failure).
- **File(s):** `apps/miniapp/src/lib/api.ts`, `apps/miniapp/src/routes/tasks/index.tsx` (toTaskList), `apps/miniapp/src/routes/budget/index.tsx` (toTransactions)
- **Impact:** Malformed API responses produce empty lists with no error. Users think "no data" when API actually failed. JWT refresh failures may loop silently.
- **Recommended fix:** Standardize API response type `{ data: T } | { error: string }`. Add error boundary in RootLayout for API errors with retry UI.
- **Verification:** Mock API to return 500 — UI should show error state, not empty list.

---

## 7. Medium Findings

### MEDIUM-001: Premium prototype pages.js is monolithic

- **Severity:** Medium
- **Confidence:** 1.00
- **Evidence:** `pages.js` contains 40+ exported functions, all route pages, plus helper `taskCard()` in a single 500-line file. No module separation by domain.
- **File(s):** `uyimiz-vite-premium-2/src/pages.js`
- **Impact:** Hard to navigate, maintain, tree-shake. Merge conflict magnet.
- **Recommended fix:** Split by domain (`pages/budget.js`, `pages/tasks.js`) or deprecate the vanilla prototype.

---

### MEDIUM-002: Duplicated parser logic across Mini App pages

- **Severity:** Medium
- **Confidence:** 1.00
- **Evidence:** `isRecord()`, `readString()`, `readNumber()` functions duplicated across `tasks`, `budget`, `members`, `leaderboard`, `index` pages. Same `asNumber()`, `formatCompactAmount()` patterns repeat.
- **File(s):** `apps/miniapp/src/routes/tasks/index.tsx`, `apps/miniapp/src/routes/budget/index.tsx`, `apps/miniapp/src/routes/members/index.tsx`, `apps/miniapp/src/routes/leaderboard/index.tsx`, `apps/miniapp/src/routes/index.tsx`
- **Impact:** Bug in parsing logic must be fixed in 5 places. Inconsistency risk.
- **Recommended fix:** Extract to `apps/miniapp/src/lib/parsers.ts` with shared `parseApiResponse<T>` utility.

---

### MEDIUM-003: ToastProvider wired but never used

- **Severity:** Medium
- **Confidence:** 1.00
- **Evidence:** `ToastProvider` wraps app in `main.tsx`. `useToast()` hook available. Zero pages call `toast()` for any action.
- **File(s):** `apps/miniapp/src/components/app/Toast.tsx`, all route files
- **Impact:** Task completion, budget saves complete silently. No confirmation feedback.
- **Recommended fix:** Call `toast('✅ Vazifa bajarildi!')` in completeMutation.onSuccess. Call `toast('💰 Yozuv saqlandi')` in budget add onSuccess.

---

### MEDIUM-004: No keyboard accessibility for route changes

- **Severity:** Medium
- **Confidence:** 0.90
- **Evidence:** Premium prototype has `data-href` click delegation + Enter key handler ✅. But no focus management after route changes. No `aria-live` region.
- **File(s):** `uyimiz-vite-premium-2/src/main.js`
- **Impact:** Keyboard-only and screen reader users cannot navigate. WCAG 2.1 failures.
- **Recommended fix:** Add `aria-live="polite"` container. Set focus to `<h1>` after route change.

---

### MEDIUM-005: Missing `rel="noopener"` on external links

- **Severity:** Medium
- **Confidence:** 0.90
- **Evidence:** All `<a>` tags with `target="_blank"` or external domains lack `rel="noopener noreferrer"`.
- **File(s):** Template literal functions in `uyimiz-vite-premium-2/src/pages.js`
- **Impact:** Minor tab-napping security risk.

---

### MEDIUM-006: `page-fade` wrapper adds unnecessary nesting

- **Severity:** Medium
- **Confidence:** 0.70
- **Evidence:** Every route page wraps content in `<div className="page-fade">`. Content is already inside `<main className="mobile-shell">` via RootLayout. Double-wrapping wastes DOM nodes.
- **File(s):** All files in `apps/miniapp/src/routes/`
- **Impact:** 9 unnecessary wrapper divs. Fade animation doesn't trigger per-route since the wrapper is static per-page.
- **Recommended fix:** Remove `page-fade` wrapper. Apply fade to `<main>` or `<Outlet>` via CSS transition on route change.

---

## 8. Low Findings

### LOW-001: `toastIn` keyframes referenced but not defined

- **Severity:** Low
- **Confidence:** 1.00
- **Evidence:** CSS has `animation: toastIn .35s ease;` in both `.toast` and `.toast-stack .toast`. But `@keyframes toastIn` is not defined (only `confetti`, `fadeIn`, `shimmer` exist).
- **File(s):** `uyimiz-vite-premium-2/src/styles.css`, `apps/miniapp/src/index.css`
- **Impact:** Toast appears instantly without slide-up animation.
- **Recommended fix:** Add `@keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`.

---

### LOW-002: Hardcoded member initials in Topbar

- **Severity:** Low
- **Confidence:** 1.00
- **Evidence:** `Topbar.tsx` renders hardcoded `<span className="avatar">ZI</span><span>JA</span><span>SA</span>`. Not from store or API.
- **File(s):** `apps/miniapp/src/components/app/Topbar.tsx`
- **Impact:** Avatar initials don't update when family members change.

---

### LOW-003: Conflicting package managers

- **Severity:** Low
- **Confidence:** 1.00
- **Evidence:** `uyimiz-vite-premium-2/package-lock.json` (npm), monorepo uses `pnpm-lock.yaml`.
- **Impact:** Separate `node_modules`, different lockfile format. Dev workflow inconsistency.

---

### LOW-004: `viewport-fit=cover` may be missing from Mini App index.html

- **Severity:** Low
- **Confidence:** 0.70
- **Evidence:** Premium prototype has `<meta name="viewport" content="..., viewport-fit=cover" />`. React Mini App should also have this for notched phone safe-area handling.
- **File(s):** `uyimiz-vite-premium-2/index.html`, `apps/miniapp/index.html`
- **Impact:** Safe-area inset may not be respected on iOS Safari inside Telegram Mini App. Telegram WebView typically manages this — low risk.

---

## 9. Needs Verification

| ID | Description | Confidence | Verification |
|---|---|---|---|
| NV-001 | Does `useTelegramThemeStyle()` actually apply Telegram theme? | 0.45 | Load in Telegram, verify theme colors match Telegram client. |
| NV-002 | Does JWT refresh interceptor work across all pages? | 0.50 | Set short JWT expiry, navigate between pages, verify no 401. |
| NV-003 | Do sticky elements properly account for Telegram viewport changes? | 0.40 | Load in Telegram, scroll, expand/minimize Mini App. |
| NV-004 | Are TanStack Router transitions smooth? | 0.55 | Click through all 9 routes rapidly, verify no flicker. |
| NV-005 | Does confetti animation perform on low-end phones? | 0.40 | Test on Android Go or throttled CPU in Chrome DevTools. |

---

## 10. UI/UX Premium Review

### What feels generic:
- Task cards look identical across statuses (only `is-overdue` border changes)
- Budget report has hardcoded categories (3 items) — not dynamic
- Empty states all use identical template layout

### What blocks premium feeling:
- **No chart animations** — donut chart static, progress bars appear instantly
- **No number counter animation** — balance numbers appear instantly
- **No pull-to-refresh** — all updates require navigation or mutation invalidation
- **Sheet transition lacks spring physics** — appears instantly
- **Missing haptic feedback** — no `navigator.vibrate` or `HapticFeedback` on task complete/save

### Screen-by-screen issues:

| Screen | Issue | Severity |
|---|---|---|
| Dashboard | Missing recent activity timeline | Medium |
| Budget | Category grid icons inconsistent (emoji only) | Low |
| Budget Report | Donut chart data hardcoded | Medium |
| Tasks | No swipe actions (complete/delete) | Medium |
| Reminders | Snooze page is separate route — should be inline | Low |
| Birthdays | Month section hardcoded to "IYUN" | Medium |
| Members | Avatar size inconsistent list vs detail | Low |
| Leaderboard | No weekly/monthly filter | Medium |
| Settings | No account-level settings edit | Medium |

### Dark mode issues:
- ✅ Button `box-shadow` adjusted in dark mode
- ⚠️ `.fab`, `.bottom-nav`, `.brand .logo-mark` shadows should also adjust
- ⚠️ `.hero-card::after` (green radial gradient) may look too bright in dark mode
- ✅ Skeleton shimmer animation colors work correctly

### Mobile issues:
- ✅ Small-screen breakpoint (430px) reduces `stats-grid` to 2 columns
- ✅ Fab positioning uses `max()` for proper safe-area awareness
- ✅ No horizontal scroll detected

---

## 11. Architecture Review

### Strong parts:
1. **CSS design token system** — 3-layer tokens (primitive → semantic → component). Clean, consistent.
2. **Component helper pattern** — `card()`, `stat()`, `pill()`, `sheet()`, `emptyState()` are pure functions. Single-responsibility, composable.
3. **Domain + App shell separation** — `domainShell` for public landing vs `appShell` for Mini App.
4. **Route map page** — embedded QA navigation for all 47 routes. Excellent DX.

### Weak boundaries:
1. **`data.js` is the only data source** — no API abstraction layer
2. **`pages.js` imports directly from `ui.js` and `data.js`** — no DI, no mocking
3. **React Mini App duplicates data parsing** across 5 pages — shared `parsers.ts` missing

### Refactor candidates:
1. Extract `parsers.ts` from React Mini App page files
2. Split `pages.js` by domain if keeping vanilla prototype
3. Create `lib/i18n.ts` with all user-facing strings

### Deepening opportunities:
React Mini App pages are shallow — each self-contained with inline types, parsers, formatters, UI. Adding `lib/adapter.ts` that transforms API DTOs → view models would deepen the architecture and eliminate duplication.

---

## 12. Bug Risk Review

### Likely runtime bugs:
1. **Currency formatting uses `'ru-RU'` locale** — produces ruble-formatted numbers. Uzbek locale would be `'uz-UZ'`.
2. **`initialsFromName()` splits by space** — "Sarvar" produces "S". Fallback `'?'` may render as `?` icon.
3. **JWT refresh loop** — if refresh returns 401, interceptor may loop infinitely. No circuit breaker.

### Edge cases:
- ✅ Empty family — `EmptyState` handles it
- ✅ Long task titles — truncated by `.meta span { text-overflow: ellipsis }`
- ⚠️ Negative balance — `displayIncome` uses `Math.max(balance, 0)` to hide negatives
- ⚠️ Rapid route changes — no debouncing on hash change, potential race conditions

---

## 13. Security & Production Risk Review

### Client trust risks:
- **innerHTML XSS** — premium prototype vulnerable (HIGH-001). React Mini App safe. ✅
- **Hardcoded invite code** (`ABC123`) — no actual generation/validation

### Auth/role risks:
- Child view (`dashboard-child`) is un-gated. Anyone can access via URL.
- Permission denied page exists but is not enforced on any route.

### Environment risks:
- No `.env` file in premium prototype. All URLs hardcoded.
- No CSP header configuration.
- `vite.config.js` has `server.host: "0.0.0.0"` — exposes dev server to network.

### Telegram Mini App risks:
- No `initData` validation on client side
- No `WebApp.ready()` call — Telegram doesn't know Mini App loaded
- No `WebApp.expand()` — Mini App may open in compact mode

---

## 14. Test Coverage Review

### Existing coverage:
| Package | Tests |
|---|---|
| `apps/api` | 98 passing (domain entities, handlers, repositories) |
| `apps/miniapp` | 0 |
| `uyimiz-vite-premium-2` | 0 |
| `apps/admin` | 0 |
| `apps/web` | 0 |

### Missing critical tests:
1. Auth flow: JWT storage, refresh, expiry, redirect on 401
2. Task completion: check → API call → optimistic update → confetti + toast
3. Budget add: 4-step wizard state, keypad input, category selection, submission
4. Theme toggle: dark/light, localStorage persistence, CSS variable verification
5. Route navigation: all 9 routes render, 404 fallback works

### Recommended first 5 tests:

```typescript
// 1. Route smoke tests
test.each(['/', '/budget', '/tasks', '/reminders', '/birthdays',
  '/members', '/leaderboard', '/settings'])('%s renders', async (path) => {
  render(<RouterProvider router={router} />);
  await router.navigate({ to: path });
  expect(screen.getByRole('main')).toBeInTheDocument();
});

// 2. Theme toggle persistence
test('toggleTheme switches dark/light and persists', () => { ... });

// 3. Task complete with confetti
test('clicking check completes task and shows confetti', () => { ... });

// 4. Budget keypad input
test('keypad adds digits and backspace removes them', () => { ... });

// 5. API error fallback
test('shows empty state when API returns 500', () => { ... });
```

---

## 15. Priority Fix Roadmap

| Priority | Issue | Why first | Skill | Owner |
|---|---|---|---|---|
| **P0** | Fix/deprecate premium prototype build | Can't verify any prototype changes | diagnose | Frontend |
| **P0** | Add Telegram SDK integration | App won't work inside Telegram | design-an-interface | Frontend |
| **P1** | Add form validation (Zod) | Users can submit garbage data | — | Frontend |
| **P1** | Add error states to all pages | Blank screens on API failure | — | Frontend |
| **P1** | Wire ToastProvider to actions | No user feedback for saves | — | Frontend |
| **P2** | Extract shared parsers | 5x duplicated logic, bug risk | improve-codebase-architecture | Frontend |
| **P2** | Add i18n support | Can't launch non-Uzbek markets | — | Frontend |
| **P2** | Add vitest + 5 regression tests | Zero test coverage | tdd | Frontend |
| **P3** | Fix `toastIn` keyframes | Minor animation polish | ui-ux-pro-max | Frontend |
| **P3** | Add chart transitions | Elevated premium feel | ui-ux-pro-max | Frontend |
| **P4** | Handle JWT refresh loop edge case | Rare but critical failure | diagnose | Frontend |

---

## 16. Suggested Fix-Phase Virtual Agents

| Agent | Scope | Files | Success criteria |
|---|---|---|---|
| **Telegram SDK Integration** | `@telegram-apps/sdk-react` setup: viewport, theme, back button, initData | `router.tsx`, `main.tsx`, `telegram-theme.ts` | App loads in Telegram, theme matches, viewport expands, back button works |
| **Error/Loading State** | Add `isError` handling to all 9 `useQuery` pages | All files in `routes/` | Every page shows error UI when API fails |
| **Toast & Feedback** | Wire `useToast()` to task complete, budget save, reminder create | `routes/tasks/index.tsx`, `routes/budget/index.tsx`, `routes/reminders/index.tsx` | All mutations show toast on success/failure |
| **Test Foundation** | Add vitest, testing-library, 5 regression tests | New: `apps/miniapp/src/__tests__/` | `pnpm test` passes with ≥5 tests |
| **Parser Extraction** | Extract shared `parseApiResponse` to `lib/parsers.ts` | New: `lib/parsers.ts`. Edit: 5 route files | No duplicated parsers across pages |

---

## 17. Final Verdict

### Can this app be safely polished now?
**Partially.** CSS and component library are production-grade. Pages render and build passes. But the app cannot function as a Telegram Mini App without SDK integration (P0), and has zero test coverage (P0). Design polish should wait until SDK and tests are in place.

### What must be fixed before design polish?
1. **Telegram SDK integration** — Mini App literally won't work inside Telegram without it
2. **Form validation** — prevents garbage data reaching API
3. **Error states on all pages** — prevents blank screens on API failure
4. **At least 5 regression tests** — protects against regression during polish

### What can be fixed later?
- i18n string extraction (launch Uzbek-only first)
- Chart animations (nice-to-have)
- Toast integration (already built, just wire it)
- `toastIn` keyframes (trivial)

### What should not be touched?
- **The CSS design system** — strongest asset. Don't rewrite.
- **The `appShell`/`card`/`stat`/`pill`/`sheet`/`emptyState` pattern** — clean and proven.
- **The API backend DDD module structure** — already audited, 98 tests passing.
- **The premium prototype should be deprecated** — its CSS is absorbed by React Mini App. Maintaining two parallel frontends is wasteful.

---

*Audit completed 2026-05-26. Use `bd add` to create issue tracking entries for Critical and High findings.*
