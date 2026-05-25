# @uyimiz/miniapp — Telegram Mini App Agent Instructions

> Extends root AGENTS.md. This is the Telegram Mini App (TMA).
> Runs inside Telegram — NOT a regular website.

---

## App Overview

Vite + React 19 + TypeScript.
Opened from bot via inline button "🌐 Mini App".
Provides rich UI for: budget charts, task management, health tracking.

---

## File Structure

```
apps/miniapp/src/
  routes/
    index.tsx           ← Dashboard (home)
    budget/
      index.tsx         ← Budget list + chart
      add.tsx           ← Add income/expense form
    tasks/
      index.tsx         ← Task list (filter: mine/all/done)
      create.tsx        ← Create task form
    reminders/
      index.tsx         ← Reminders list
    birthdays/
      index.tsx         ← Birthday calendar
    settings/
      index.tsx         ← User + family settings
  components/
    ui/                 ← shadcn/ui (DO NOT modify source)
    app/
      BottomNav.tsx     ← Bottom navigation (5 tabs)
      TaskCard.tsx      ← Reusable task card
      BudgetChart.tsx   ← Recharts donut chart
      ...
  stores/
    ui.store.ts         ← UI state: active modal, active tab
    family.store.ts     ← Current family context
  hooks/
    useTelegramUser.ts  ← Get current Telegram user from initData
    useFamilyId.ts      ← Get familyId from auth context
  lib/
    api.ts              ← Axios instance + TanStack Query setup
    auth.ts             ← initData → JWT token exchange
  main.tsx
  router.tsx            ← TanStack Router definition
```

---

## Telegram SDK Rules (CRITICAL)

```typescript
// 1. ALWAYS use theme colors from Telegram — no hardcoded colors
import { useThemeParams } from '@telegram-apps/sdk-react';
const { bg_color, text_color, button_color } = useThemeParams();

// 2. Native Telegram UI elements
import { MainButton, BackButton, HapticFeedback } from '@telegram-apps/sdk-react';

// MainButton (bottom action button)
<MainButton text="✅ Saqlash" onClick={handleSave} />

// BackButton (top left arrow)
<BackButton onClick={() => router.navigate({ to: '..' })} />

// Haptic feedback on important actions
HapticFeedback.impactOccurred('medium'); // on button press
HapticFeedback.notificationOccurred('success'); // on save
HapticFeedback.notificationOccurred('error'); // on error

// 3. initData validation — send to backend on every request
const { initData } = useLaunchParams();
// → send as Authorization header
```

---

## Data Fetching (TanStack Query)

```typescript
// ✅ Always use TanStack Query for server data
const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks', familyId, { status: 'active' }],
  queryFn: () => api.getTasks({ familyId, status: 'active' }),
  staleTime: 2 * 60 * 1000, // 2 minutes
});

// ✅ Optimistic updates for mutations
const mutation = useMutation({
  mutationFn: (taskId: string) => api.completeTask(taskId),
  onMutate: async (taskId) => {
    await queryClient.cancelQueries({ queryKey: ['tasks', familyId] });
    const previous = queryClient.getQueryData(['tasks', familyId]);
    queryClient.setQueryData(['tasks', familyId], (old) =>
      old.map(t => t.id === taskId ? { ...t, status: 'done' } : t)
    );
    return { previous };
  },
  onError: (err, taskId, context) => {
    queryClient.setQueryData(['tasks', familyId], context.previous);
  },
});

// ❌ Never use useState + useEffect + fetch directly for server data
```

---

## State Management (Zustand)

```typescript
// ✅ Zustand only for UI state
const useUIStore = create<UIState>((set) => ({
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));

// ❌ Never store server data in Zustand — use TanStack Query
```

---

## Query Key Convention

```typescript
// Consistent query keys:
['budget', familyId]                    → budget list
['budget', familyId, 'report', 'month'] → monthly report
['tasks', familyId]                     → all tasks
['tasks', familyId, { status: 'new' }]  → filtered tasks
['reminders', familyId]                 → reminders
['birthdays', familyId]                 → birthdays
['leaderboard', familyId, 'weekly']     → gamification
```

---

## Styling Rules

- Tailwind CSS — utility classes only
- shadcn/ui components — customize via Tailwind `className`, NEVER edit component source
- Mobile-first: minimum viewport 375px
- Dark/light mode: use CSS variables from `useThemeParams()`, not Tailwind dark:
  ```typescript
  style={{ backgroundColor: themeParams.bg_color }}
  ```
- Bottom navigation: fixed, 5 tabs max
- Cards: rounded-xl, shadow-sm, p-4
- Loading: always show skeleton (not spinner) for list items

---

## API Client

```typescript
// lib/api.ts pattern
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Add initData to every request
apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## DO NOT

- ❌ NEVER hardcode colors — use Telegram theme params
- ❌ NEVER use `window.location` — use TanStack Router navigation
- ❌ NEVER use `console.log` in production
- ❌ NEVER import from `@uyimiz/db`
- ❌ NEVER use `useState` + `useEffect` + `fetch` for server data
- ❌ NEVER install heavy chart libraries (use Recharts — already in stack)
- ❌ NEVER ignore Telegram native UI patterns (MainButton, BackButton)
