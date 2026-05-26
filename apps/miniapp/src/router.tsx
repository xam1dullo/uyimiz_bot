// ─── Router (TanStack Router) ───
import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import DashboardPage from './routes/index';
import BudgetPage from './routes/budget/index';
import BudgetReportPage from './routes/budget/report';
import TasksPage from './routes/tasks/index';
import RemindersPage from './routes/reminders/index';
import BirthdaysPage from './routes/birthdays/index';
import MembersPage from './routes/members/index';
import LeaderboardPage from './routes/leaderboard/index';
import SettingsPage from './routes/settings/index';
import BottomNav from './components/app/BottomNav';
import AppTopbar from './components/app/Topbar';
import { ErrorBoundary } from './components/app/ErrorBoundary';

function RootLayout() {
  return (
    <main className="mobile-shell has-nav">
      <AppTopbar />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </main>
  );
}

const rootRoute = createRootRoute({ component: () => <><RootLayout /><BottomNav /></> });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: DashboardPage });
const budgetRoute = createRoute({ getParentRoute: () => rootRoute, path: '/budget', component: BudgetPage });
const budgetReportRoute = createRoute({ getParentRoute: () => rootRoute, path: '/budget/report', component: BudgetReportPage });
const tasksRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tasks', component: TasksPage });
const remindersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/reminders', component: RemindersPage });
const birthdaysRoute = createRoute({ getParentRoute: () => rootRoute, path: '/birthdays', component: BirthdaysPage });
const membersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/members', component: MembersPage });
const leaderboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/leaderboard', component: LeaderboardPage });
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: SettingsPage });

const routeTree = rootRoute.addChildren([
  indexRoute, budgetRoute, budgetReportRoute, tasksRoute, remindersRoute,
  birthdaysRoute, membersRoute, leaderboardRoute, settingsRoute,
]);

export const router = createRouter({ routeTree });
declare module '@tanstack/react-router' { interface Register { router: typeof router; } }
