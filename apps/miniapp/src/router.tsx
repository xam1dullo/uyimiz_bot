// ─── Router (TanStack Router) ───
import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import DashboardPage from './routes/index';
import BudgetPage from './routes/budget/index';
import TasksPage from './routes/tasks/index';
import RemindersPage from './routes/reminders/index';
import BirthdaysPage from './routes/birthdays/index';
import SettingsPage from './routes/settings/index';
import BottomNav from './components/app/BottomNav';

const rootRoute = createRootRoute({ component: () => <><Outlet /><BottomNav /></> });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: DashboardPage });
const budgetRoute = createRoute({ getParentRoute: () => rootRoute, path: '/budget', component: BudgetPage });
const tasksRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tasks', component: TasksPage });
const remindersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/reminders', component: RemindersPage });
const birthdaysRoute = createRoute({ getParentRoute: () => rootRoute, path: '/birthdays', component: BirthdaysPage });
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: SettingsPage });

const routeTree = rootRoute.addChildren([
  indexRoute, budgetRoute, tasksRoute, remindersRoute, birthdaysRoute, settingsRoute,
]);

export const router = createRouter({ routeTree });
declare module '@tanstack/react-router' { interface Register { router: typeof router; } }
