import { family } from "../data.js";

export const iconClass = (tone = "mint") => `icon icon-${tone}`;

export function avatarStack(items = family.members.slice(0, 3)) {
  return `<div class="avatar-stack">${items.map(m => `<span class="avatar">${m.initials}</span>`).join("")}</div>`;
}

export function appTopbar(extra = "") {
  return `
    <header class="topbar app-topbar">
      <a class="brand compact" href="#/dashboard" aria-label="@uyimiz dashboard">
        <span class="logo-mark">u</span>
        <span>${family.name}</span>
      </a>
      <div class="topbar-actions">
        ${avatarStack()}
        ${extra}
      </div>
    </header>
  `;
}

export function domainTopbar() {
  return `
    <header class="topbar domain-topbar">
      <a class="brand" href="#/" aria-label="@uyimiz home">
        <span class="logo-mark">u</span>
        <span>@uyimiz</span>
      </a>
      <nav class="desktop-links" aria-label="Domain navigation">
        <a href="#/features">Features</a>
        <a href="#/pricing">Pricing</a>
        <a href="#/support">Support</a>
        <a class="nav-cta" href="#/open-app">Open app</a>
      </nav>
      <button class="theme-toggle" data-action="theme" aria-label="Toggle theme">🌙</button>
    </header>
  `;
}

const nav = [
  ["dashboard", "🏠", "Bosh", "#/dashboard"],
  ["budget", "💰", "Byudjet", "#/budget"],
  ["tasks", "✅", "Vazifa", "#/tasks"],
  ["reminders", "🔔", "Eslatma", "#/reminders"],
  ["profile", "👤", "Men", "#/profile"]
];

export function bottomNav(active = "dashboard") {
  return `
    <nav class="bottom-nav" aria-label="App navigation">
      ${nav.map(([key, icon, label, href]) => `
        <a class="bottom-nav__item ${active === key ? "is-active" : ""}" href="${href}">
          <span>${icon}</span><small>${label}</small>
        </a>`).join("")}
    </nav>
  `;
}

export function appShell({ active = "dashboard", title = "", body = "", fab = "", showNav = true }) {
  return `
    <main class="mobile-shell ${showNav ? "has-nav" : "no-nav"}">
      ${appTopbar(`<button class="theme-toggle" data-action="theme" aria-label="Toggle theme">🌙</button>`)}
      ${title ? `<section class="screen-title">${title}</section>` : ""}
      ${body}
      ${fab}
    </main>
    ${showNav ? bottomNav(active) : ""}
  `;
}

export function domainShell(body) {
  return `
    <main class="domain-shell">
      ${domainTopbar()}
      ${body}
    </main>
  `;
}

export function card({ icon = "", title = "", sub = "", tone = "mint", href = "", after = "" }) {
  const inner = `
    <div class="${iconClass(tone)}">${icon}</div>
    <div class="meta">
      <strong>${title}</strong>
      ${sub ? `<span>${sub}</span>` : ""}
    </div>
    ${after || ""}
  `;
  return href ? `<a class="list-card" href="${href}">${inner}</a>` : `<div class="list-card">${inner}</div>`;
}

export function stat(value, label, tone = "") {
  return `<div class="stat-card ${tone}"><strong>${value}</strong><span>${label}</span></div>`;
}

export function pill(text, active = false, href = "") {
  const cls = `pill ${active ? "is-active" : ""}`;
  return href ? `<a class="${cls}" href="${href}">${text}</a>` : `<button class="${cls}" type="button">${text}</button>`;
}

export function sheet(title, content, close = "#/dashboard") {
  return `
    <div class="scrim"></div>
    <section class="sheet" role="dialog" aria-modal="true">
      <div class="sheet__handle"></div>
      <div class="sheet__head">
        <h2>${title}</h2>
        <a class="icon-button" href="${close}" aria-label="Close">×</a>
      </div>
      ${content}
    </section>
  `;
}

export function emptyState(icon, title, sub, href, buttonText) {
  return `
    <section class="empty-state hero-card">
      <div class="icon icon-mint icon-large">${icon}</div>
      <h1>${title}</h1>
      <p>${sub}</p>
      ${href ? `<a class="button primary" href="${href}">${buttonText}</a>` : ""}
    </section>
  `;
}
