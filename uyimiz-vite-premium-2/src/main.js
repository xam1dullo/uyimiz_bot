import "./styles.css";
import {
  homePage, featuresPage, pricingPage, supportPage, legalPage, openAppPage, joinPage,
  onboardingPage, onboardingChoicePage, onboardingCreatePage, onboardingCodePage,
  onboardingWaitingPage, onboardingSuccessPage, dashboardPage, quickAddPage,
  budgetPage, budgetReportPage, budgetAddStep, tasksPage, taskDetailPage, taskCreatePage,
  tasksFilterPage, remindersPage, reminderCreatePage, reminderSnoozePage, membersPage,
  memberDetailPage, inviteMemberPage, birthdaysPage, birthdayAddPage, profilePage,
  languagePage, familySettingsPage, calendarPage, leaderboardPage, searchPage, statesPage,
  permissionDeniedPage, routeMapPage, notFoundPage
} from "./pages.js";

const app = document.querySelector("#app");

const routes = {
  "": homePage,
  "/": homePage,
  "features": featuresPage,
  "pricing": pricingPage,
  "support": supportPage,
  "privacy": () => legalPage("Privacy"),
  "terms": () => legalPage("Terms"),
  "open-app": openAppPage,
  "join": joinPage,
  "route-map": routeMapPage,

  "onboarding": onboardingPage,
  "onboarding-choice": onboardingChoicePage,
  "onboarding-create": onboardingCreatePage,
  "onboarding-code": onboardingCodePage,
  "onboarding-waiting": onboardingWaitingPage,
  "onboarding-success": onboardingSuccessPage,

  "dashboard": () => dashboardPage("owner"),
  "dashboard-child": () => dashboardPage("child"),
  "quick-add": quickAddPage,

  "budget": budgetPage,
  "budget-report": budgetReportPage,
  "budget-add-type": () => budgetAddStep("type"),
  "budget-add-amount": () => budgetAddStep("amount"),
  "budget-add-category": () => budgetAddStep("category"),
  "budget-add-final": () => budgetAddStep("final"),

  "tasks": tasksPage,
  "task-detail": taskDetailPage,
  "task-create": taskCreatePage,
  "tasks-filter": tasksFilterPage,

  "reminders": remindersPage,
  "reminder-create": reminderCreatePage,
  "reminder-snooze": reminderSnoozePage,

  "members": membersPage,
  "member-detail": memberDetailPage,
  "invite-member": inviteMemberPage,
  "birthdays": birthdaysPage,
  "birthday-add": birthdayAddPage,
  "profile": profilePage,
  "settings-language": languagePage,
  "family-settings": familySettingsPage,

  "calendar": calendarPage,
  "leaderboard": leaderboardPage,
  "search": searchPage,

  "states-loading": () => statesPage("loading"),
  "states-empty": () => statesPage("empty"),
  "states-error": () => statesPage("error"),
  "permission-denied": permissionDeniedPage
};

function currentRoute() {
  return location.hash.replace(/^#\/?/, "").trim();
}

function render() {
  const key = currentRoute();
  const view = routes[key] || notFoundPage;
  app.innerHTML = view();
  window.scrollTo(0, 0);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("uyimiz-theme", theme);
}

function bootTheme() {
  const saved = localStorage.getItem("uyimiz-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved || (prefersDark ? "dark" : "light"));
}

document.addEventListener("click", async (event) => {
  const routeTarget = event.target.closest("[data-href]");
  if (routeTarget && !event.target.closest("button, a, input, textarea, select")) {
    location.hash = routeTarget.dataset.href;
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;

  if (action === "theme") {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    return;
  }

  if (action === "toast") {
    toast(actionTarget.dataset.message || "Done");
    return;
  }

  if (action === "copy") {
    try {
      await navigator.clipboard.writeText("https://uyimiz.app/join/ABC123");
      toast("Invite link copied");
    } catch {
      toast("Copy preview: uyimiz.app/join/ABC123");
    }
    return;
  }

  if (action === "complete") {
    event.preventDefault();
    completeTask(actionTarget);
  }
});


document.addEventListener("keydown", (event) => {
  const routeTarget = event.target.closest?.("[data-href]");
  if (!routeTarget) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    location.hash = routeTarget.dataset.href;
  }
});

function toast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();

  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function completeTask(button) {
  button.classList.add("done");
  button.textContent = "✓";
  button.closest(".list-card")?.classList.add("is-completed");

  const confetti = document.createElement("div");
  confetti.className = "confetti";
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 900);

  toast("🏅 +30 ball oldingiz!");
}

bootTheme();
window.addEventListener("hashchange", render);
render();
