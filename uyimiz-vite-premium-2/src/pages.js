import { DOMAIN, family, tasks, transactions, reminders, birthdays, categories } from "./data.js";
import { appShell, domainShell, card, stat, pill, sheet, avatarStack, emptyState } from "./components/ui.js";

const routeLink = (route) => `#/${route}`;

export function homePage() {
  return domainShell(`
    <section class="domain-hero">
      <div class="hero-card domain-hero__copy">
        <p class="eyebrow">Telegram Mini App · ${DOMAIN}</p>
        <h1>Oilangiz uchun premium raqamli uy</h1>
        <p>@uyimiz oilaviy yumushlar, byudjet, eslatmalar, tug'ilgan kunlar va ball reytingini Telegram ichida sodda boshqaradi.</p>
        <div class="button-row">
          <a class="button primary" href="#/open-app">Open Mini App</a>
          <a class="button secondary" href="#/join">Join family</a>
        </div>
      </div>
      <div class="phone-preview" aria-label="Mini app preview">
        <div class="phone-preview__top">${avatarStack()}</div>
        <h2>Hi, Zilola</h2>
        ${card({ icon: "✅", title: "Catch the bus", sub: "Today, 6:00 AM · +25 points" })}
        ${card({ icon: "💰", title: "Monthly balance", sub: "1,400,000 UZS saved", tone: "blue" })}
        ${card({ icon: "🎂", title: "Jasur birthday", sub: "In 3 days", tone: "yellow" })}
      </div>
    </section>
    <section class="domain-section">
      <h2>Refactored flows</h2>
      <div class="feature-grid">
        ${[
          ["#/onboarding", "✨", "Onboarding", "Language, family create/join, waiting approval."],
          ["#/dashboard", "🏠", "Dashboard", "Owner/member overview with quick actions."],
          ["#/budget", "💰", "Budget", "List, report, and 4-step add flow."],
          ["#/tasks", "✅", "Tasks", "Assign, complete, confetti and points."],
          ["#/reminders", "🔔", "Reminders", "Create, snooze and Telegram-friendly flow."],
          ["#/route-map", "🧭", "Route map", "All screens in one Vite project."]
        ].map(([href, icon, title, sub]) => `<a class="feature-card" href="${href}"><div class="icon icon-mint">${icon}</div><h3>${title}</h3><p>${sub}</p></a>`).join("")}
      </div>
    </section>
  `);
}

export function featuresPage() {
  return domainShell(`
    <section class="hero-card">
      <p class="eyebrow">Product</p>
      <h1>Features designed around family routines</h1>
      <p>Every screen has one main action, large touch targets, premium mint states, and mobile-first spacing.</p>
    </section>
    <section class="feature-grid wide">
      ${[
        ["✅", "Chores", "Assign, rotate, complete and reward.", "mint"],
        ["💰", "Budget", "Track income, expenses and category reports.", "blue"],
        ["🔔", "Reminders", "Snooze and repeat important reminders.", "yellow"],
        ["👨‍👩‍👧", "Roles", "Owner, member, child and future guest views.", "mint"],
        ["🎂", "Birthdays", "Never forget family birthdays.", "purple"],
        ["🌙", "Dark mode", "Elegant Telegram dark-theme direction.", "blue"]
      ].map(([icon, title, sub, tone]) => `<div class="feature-card"><div class="icon icon-${tone}">${icon}</div><h3>${title}</h3><p>${sub}</p></div>`).join("")}
    </section>
  `);
}

export function pricingPage() {
  return domainShell(`
    <section class="hero-card">
      <p class="eyebrow">Pricing placeholder</p>
      <h1>Simple pricing page for ${DOMAIN}</h1>
      <p>Production prices can be changed later. The UI is ready for a domain landing page.</p>
    </section>
    <section class="pricing-grid">
      ${[
        ["Free", "0 UZS", "Basic chores and reminders.", "secondary"],
        ["Premium", "29k UZS/mo", "Reports, unlimited members, analytics.", "primary"],
        ["Family Pro", "Custom", "Extended family and future exports.", "secondary"]
      ].map(([name, price, sub, btn]) => `<article class="price-card ${btn === "primary" ? "is-featured" : ""}"><span>${name}</span><h2>${price}</h2><p>${sub}</p><a class="button ${btn}" href="#/open-app">Start</a></article>`).join("")}
    </section>
  `);
}

export function supportPage() {
  return domainShell(`
    <section class="hero-card">
      <p class="eyebrow">Support</p>
      <h1>Help center</h1>
      <p>Domain support page for invite, Telegram Mini App and family permission issues.</p>
    </section>
    <section class="support-layout">
      <div class="stack">
        ${card({ icon: "💬", title: "Telegram support", sub: "@uyimiz_support placeholder" })}
        ${card({ icon: "📧", title: "Email", sub: "support@uyimiz.app", tone: "blue" })}
      </div>
      <form class="form-card">
        <label>Email<input class="input" value="user@example.com" /></label>
        <label>Message<textarea class="input" rows="5">Invite link ishlamayapti</textarea></label>
        <button class="button primary" type="button" data-action="toast" data-message="Support request preview">Send</button>
      </form>
    </section>
  `);
}

export function legalPage(type = "Privacy") {
  return domainShell(`
    <article class="hero-card legal-card">
      <p class="eyebrow">${type}</p>
      <h1>${type === "Privacy" ? "Privacy Policy" : "Terms of Service"}</h1>
      <p>This is a clean placeholder page for ${DOMAIN}. Replace with production legal text before launch.</p>
      <h2>Family data</h2>
      <p>The app shows family members, chores, reminders, birthdays, budget records and role permissions.</p>
      <h2>Role visibility</h2>
      <p>Child views must only show their own allowed task information. Owner-only settings must stay protected.</p>
    </article>
  `);
}

export function openAppPage() {
  return domainShell(`
    ${emptyState("🚀", "Open @uyimiz Mini App", "Use this page as a public domain fallback. In production, connect the button to your Telegram bot / Mini App link.", "#/dashboard", "Preview app")}
  `);
}

export function joinPage() {
  return domainShell(`
    <section class="hero-card join-card">
      <p class="eyebrow">${DOMAIN}/join/ABC123</p>
      <h1>Join Karimovlar family</h1>
      <p>Invite-code landing page for Telegram, SMS and browser shares.</p>
      <div class="otp-row"><input value="A"/><input value="B"/><input value="C"/><input value="1"/><input value="2"/><input value="3"/></div>
      <a class="button primary" href="#/onboarding-waiting">Request access</a>
    </section>
  `);
}

export function onboardingPage() {
  return appShell({
    showNav: false,
    active: "dashboard",
    title: `<p class="eyebrow">Onboarding</p><h1>Welcome home</h1><p>Choose a language and start your family space.</p>`,
    body: `
      <div class="stack">
        ${card({ icon: "🇺🇿", title: "O'zbek", sub: "Tanlangan til", after: `<span class="check done">✓</span>`, href: "#/onboarding-choice" })}
        ${card({ icon: "🇷🇺", title: "Русский", sub: "Можно изменить позже", href: "#/onboarding-choice" })}
        ${card({ icon: "🇬🇧", title: "English", sub: "Can be changed later", href: "#/onboarding-choice" })}
      </div>
    `
  });
}

export function onboardingChoicePage() {
  return appShell({
    showNav: false,
    active: "dashboard",
    title: `<p class="eyebrow">Start</p><h1>Oilangiz bormi?</h1><p>Yangi family yarating yoki invite kod orqali qo'shiling.</p>`,
    body: `
      <div class="two-grid">
        <a class="choice-card" href="#/onboarding-create"><div class="icon icon-mint icon-large">🏡</div><h3>Yangi oila yarataman</h3><p>Owner sifatida boshlaysiz.</p></a>
        <a class="choice-card" href="#/onboarding-code"><div class="icon icon-blue icon-large">🔗</div><h3>Oilaga qo'shilaman</h3><p>6 xonali invite code.</p></a>
      </div>
    `
  });
}

export function onboardingCreatePage() {
  return appShell({
    showNav: false,
    title: `<p class="eyebrow">Create family</p><h1>Oilangiz nomini kiriting</h1><p>Bu nom dashboard, invite va profile sahifalarida ko'rinadi.</p>`,
    body: `
      <form class="form-card">
        <label>Family name<input class="input" value="${family.name}" /></label>
        <button class="button secondary" type="button">😊 Emoji qo'shish</button>
        <a class="button primary" href="#/onboarding-success">Davom etish</a>
      </form>
    `
  });
}

export function onboardingCodePage() {
  return appShell({
    showNav: false,
    title: `<p class="eyebrow">Join family</p><h1>Invite kodni kiriting</h1><p>Owner tasdiqlagandan keyin oilaga qo'shilasiz.</p>`,
    body: `
      <div class="form-card">
        <div class="otp-row"><input value="A"/><input value="B"/><input value="C"/><input value="1"/><input value="2"/><input value="3"/></div>
        <a class="button primary" href="#/onboarding-waiting">So'rov yuborish</a>
      </div>
    `
  });
}

export function onboardingWaitingPage() {
  return appShell({
    showNav: false,
    body: emptyState("⏳", "Owner tasdig'i kutilmoqda", "Oila egasiga so'rov yuborildi. Tasdiqlangandan keyin dashboard ochiladi.", "#/dashboard", "Preview dashboard")
  });
}

export function onboardingSuccessPage() {
  return appShell({
    showNav: false,
    body: emptyState("✅", "Oila yaratildi", "Invite link tayyor. Endi dashboard orqali oilani boshqarishingiz mumkin.", "#/dashboard", "Dashboardga o'tish")
  });
}

export function dashboardPage(role = "owner") {
  const isChild = role === "child";
  return appShell({
    active: "dashboard",
    title: `
      <div class="row split">
        <div>
          <p class="eyebrow">${isChild ? "Child view" : "Bugun"}</p>
          <h1>Hi, ${isChild ? "Sarvar" : "Zilola"}</h1>
          <p>${isChild ? "Faqat senga tegishli vazifalar." : `${family.name} · ${family.members.length} a'zo`}</p>
        </div>
        <a class="icon-button" href="#/search">⌕</a>
      </div>
    `,
    body: `
      ${!isChild ? `
        <section class="hero-card balance-card">
          <div class="row">
            <div><p class="eyebrow">Bu oy</p><h3>Family balance</h3></div>
            <a href="#/budget-report" class="soft-link">Hisobot →</a>
          </div>
          <div class="stats-grid">
            ${stat("4.2M", "Daromad")}
            ${stat("2.8M", "Xarajat", "danger")}
            ${stat("1.4M", "Balans")}
          </div>
        </section>` : ""}
      <section class="section-head"><h2>${isChild ? "Mening vazifalarim" : "Aktiv vazifalar"}</h2><a href="#/tasks">Hammasi →</a></section>
      <div class="stack">
        ${tasks.filter(t => isChild ? ["Sarvar", "Malika"].includes(t.assignee) : t.status !== "overdue").slice(0, 3).map(t => taskCard(t)).join("")}
      </div>
      ${!isChild ? `<section class="section-head"><h2>Yaqin eslatma</h2></section>${card({ icon: "🔔", title: reminders[0].title, sub: `${reminders[0].time} · ${reminders[0].target}`, tone: "yellow", href: "#/reminders" })}` : ""}
      <section class="section-head"><h2>Haftalik reyting</h2><a href="#/leaderboard">To'liq →</a></section>
      ${card({ icon: "🏆", title: isChild ? "Bu hafta 2-o'rin" : "Zilola 280 ball", sub: isChild ? "120 ball" : "Jasur 190 ball · Sarvar 120 ball", tone: "purple", href: "#/leaderboard" })}
    `,
    fab: !isChild ? `<a class="fab" href="#/quick-add">+</a>` : ""
  });
}

function taskCard(t) {
  return `
    <div class="task-card list-card ${t.status === "overdue" ? "is-overdue" : ""}" role="link" tabindex="0" data-href="#/task-detail" aria-label="Open task ${t.title}">
      <button class="check" type="button" data-action="complete" aria-label="Complete task">✓</button>
      <div class="meta">
        <strong>${t.title}</strong>
        <span>${t.assignee} · ${t.time} · ${t.repeat}</span>
      </div>
      <span class="score-badge">+${t.points}</span>
    </div>
  `;
}

export function quickAddPage() {
  return appShell({
    active: "dashboard",
    title: `<h1>Quick add</h1><p>One-thumb quick actions from dashboard.</p>`,
    body: sheet("Nima qo'shamiz?", `
      <div class="stack">
        ${card({ icon: "💸", title: "Xarajat qo'sh", sub: "4-step budget flow", tone: "blue", href: "#/budget-add-type" })}
        ${card({ icon: "✅", title: "Vazifa qo'sh", sub: "Assign and reward", href: "#/task-create" })}
        ${card({ icon: "🔔", title: "Eslatma qo'sh", sub: "Time and repeat", tone: "yellow", href: "#/reminder-create" })}
      </div>
    `)
  });
}

export function budgetPage() {
  return appShell({
    active: "budget",
    title: `<h1>Byudjet</h1><div class="pills">${pill("Hammasi", true)}${pill("💚 Daromad")}${pill("🔴 Xarajat")}${pill("Bu oy ▾")}</div>`,
    body: `
      <section class="hero-card balance-card">
        <div class="stats-grid">${stat("4.2M", "Daromad")}${stat("2.8M", "Xarajat", "danger")}${stat("1.4M", "Balans")}</div>
        <a class="button secondary full" href="#/budget-report">Hisobot ko'rish →</a>
      </section>
      <section class="section-head"><h2>Yozuvlar</h2></section>
      <div class="stack">
        ${transactions.map(tx => card({
          icon: tx.icon,
          title: tx.title,
          sub: `${tx.person} · ${tx.time}`,
          tone: tx.type === "expense" ? "red" : "mint",
          after: `<strong class="amount ${tx.type === "expense" ? "minus" : "plus"}">${tx.amount}</strong>`
        })).join("")}
      </div>
    `,
    fab: `<a class="fab" href="#/budget-add-type">+</a>`
  });
}

export function budgetReportPage() {
  return appShell({
    active: "budget",
    title: `<h1>Hisobot</h1><div class="pills">${pill("Bu oy", true)}${pill("O'tgan oy")}${pill("Haftali")}${pill("Custom")}</div>`,
    body: `
      <section class="hero-card">
        <div class="donut"><div><strong>2.8M</strong><span>Xarajat</span></div></div>
      </section>
      <section class="section-head"><h2>Kategoriyalar</h2></section>
      <div class="stack">
        ${[
          ["🛒", "Oziq-ovqat", "850k · 30%", 72],
          ["🏠", "Kommunal", "540k · 19%", 52],
          ["🚗", "Transport", "420k · 15%", 42]
        ].map(([ic, title, sub, w]) => `<div class="report-row"><div class="icon icon-blue">${ic}</div><div class="meta"><strong>${title}</strong><span>${sub}</span><div class="progress"><i style="width:${w}%"></i></div></div></div>`).join("")}
      </div>
    `
  });
}

export function budgetAddStep(step = "type") {
  const pages = {
    type: ["1/4", "Nima qo'shmoqchisiz?", `
      <div class="two-grid">
        <a class="choice-card" href="#/budget-add-amount"><div class="icon icon-red icon-large">💸</div><h3>Xarajat</h3></a>
        <a class="choice-card" href="#/budget-add-amount"><div class="icon icon-mint icon-large">💚</div><h3>Daromad</h3></a>
      </div>`],
    amount: ["2/4", "Miqdor", `
      <div class="amount-input">285,000 <small>UZS</small></div>
      <div class="keypad">${[1,2,3,4,5,6,7,8,9,".","0","⌫"].map(x => `<button>${x}</button>`).join("")}</div>
      <a class="button primary full" href="#/budget-add-category">Davom etish</a>`],
    category: ["3/4", "Kategoriya tanlang", `
      <div class="category-grid">${categories.map(c => `<a href="#/budget-add-final" class="category-card"><span>${c.icon}</span><strong>${c.title}</strong></a>`).join("")}</div>`],
    final: ["4/4", "Yakunlash", `
      <label>Izoh<textarea class="input" rows="3">Haftalik oziq-ovqat</textarea></label>
      <label>Sana<input class="input" value="Bugun" /></label>
      <a class="button primary full" href="#/budget">✅ Saqlash</a>`]
  };
  const [count, title, content] = pages[step];
  return appShell({
    active: "budget",
    title: `<p class="eyebrow">Budget flow · ${count}</p><h1>${title}</h1>`,
    body: sheet(title, `<div class="stepper"><span style="width:${parseInt(count) * 25}%"></span></div>${content}`, "#/budget")
  });
}

export function tasksPage() {
  return appShell({
    active: "tasks",
    title: `<h1>Vazifalar</h1><div class="pills">${pill("Yangi (5)", true)}${pill("Jarayonda")}${pill("Bajarilgan")}${pill("Filter", false, "#/tasks-filter")}</div>`,
    body: `<div class="stack">${tasks.map(taskCard).join("")}</div>`,
    fab: `<a class="fab" href="#/task-create">+</a>`
  });
}

export function taskDetailPage() {
  return appShell({
    active: "tasks",
    title: `<h1>Vacuum</h1><p>You should vacuum high-traffic areas daily and the entire area twice a week.</p>`,
    body: `
      <section class="hero-card detail-card">
        ${[
          ["Next due date", "Tomorrow, 6:00 PM"],
          ["Repeat", "Every week on Thursday"],
          ["Members", avatarStack()],
          ["Rotated to", "Ryan"],
          ["Reminder", "Enabled"]
        ].map(([k, v]) => `<div class="detail-row"><strong>${k}</strong><span>${v}</span></div>`).join("")}
      </section>
      <button class="button primary full" data-action="complete">Mark as done</button>
    `
  });
}

export function taskCreatePage() {
  return appShell({
    active: "tasks",
    body: sheet("Yangi vazifa", `
      <form class="sheet-form">
        <label>Sarlavha<input class="input" value="Vacuum" /></label>
        <label>Kategoriya<div class="pills">${pill("🍽", true)}${pill("🧹")}${pill("🛒")}${pill("🔧")}</div></label>
        <label>Kimga<div class="pills">${pill("Ryan", true)}${pill("Paul", true)}${pill("Justin")}</div></label>
        <div class="two-grid"><label>Muddat<input class="input" value="Tomorrow" /></label><label>Vaqt<input class="input" value="6:00 PM" /></label></div>
        <label>Takrorlanish<input class="input" value="Every week" /></label>
        <label>Ball<input class="input" value="30 points" /></label>
        <a class="button primary full" href="#/tasks">✅ Yaratish</a>
      </form>
    `, "#/tasks")
  });
}

export function tasksFilterPage() {
  return appShell({
    active: "tasks",
    title: `<h1>Filter & organize</h1>`,
    body: `
      <h2>Filter</h2><div class="three-grid">${["⊘ None", "☑ Assigned to me", "👥 Assigned to others"].map((x,i)=>`<button class="filter-card ${i===0?"is-active":""}">${x}</button>`).join("")}</div>
      <h2>Grouping</h2><div class="three-grid">${["📅 Date", "👤 Assignee", "💧 Color"].map((x,i)=>`<button class="filter-card ${i===2?"is-active":""}">${x}</button>`).join("")}</div>
      <h2>Advanced</h2>${card({ icon: "✓", title: "Show completed chores", after: `<span class="switch"><i></i></span>` })}
    `
  });
}

export function remindersPage() {
  return appShell({
    active: "reminders",
    title: `<h1>Eslatmalar</h1>`,
    body: `
      <section class="section-head"><h2>Yaqinlashayotgan</h2></section>
      <div class="stack">
        ${reminders.map((r, i) => card({ icon: r.icon, title: r.title, sub: `${r.time} · ${r.target}`, tone: i ? "blue" : "yellow", after: i ? "" : `<a class="button secondary small" href="#/reminder-snooze">Snooze</a>` })).join("")}
      </div>
      <section class="section-head"><h2>O'tgan</h2></section>
      <div class="muted-card">${card({ icon: "✓", title: "Kommunal to'lov", sub: "Kecha" })}</div>
    `,
    fab: `<a class="fab" href="#/reminder-create">+</a>`
  });
}

export function reminderCreatePage() {
  return appShell({
    active: "reminders",
    body: sheet("Eslatma qo'shish", `
      <form class="sheet-form">
        <label>Nima haqida?<input class="input" value="Bank to'lovi" /></label>
        <label>Matn<textarea class="input" rows="3">Kartani to'ldirish kerak</textarea></label>
        <label>Kimga?<div class="pills">${pill("Faqat men", true)}${pill("Zilola")}${pill("Hammaga")}</div></label>
        <div class="two-grid"><label>Sana<input class="input" value="Bugun" /></label><label>Vaqt<input class="input" value="18:00" /></label></div>
        <a class="button primary full" href="#/reminders">🔔 Eslatma qo'sh</a>
      </form>
    `, "#/reminders")
  });
}

export function reminderSnoozePage() {
  return appShell({
    active: "reminders",
    body: sheet("Qancha vaqtga?", `
      <div class="two-grid">${["10 daqiqa", "30 daqiqa", "1 soat", "3 soat"].map(x => `<a class="choice-card compact" href="#/reminders"><h3>${x}</h3></a>`).join("")}</div>
    `, "#/reminders")
  });
}

export function membersPage() {
  return appShell({
    active: "profile",
    title: `<h1>Oila a'zolari</h1>`,
    body: `
      <div class="stack">${family.members.map(m => card({ icon: m.initials, title: m.name, sub: `${m.role} · ${m.email}`, tone: m.role === "Owner" ? "mint" : m.role === "Child" ? "purple" : "blue", href: "#/member-detail", after: m.role === "Owner" ? `<span class="badge">Admin</span>` : "›" })).join("")}</div>
      <a class="button primary full mt" href="#/invite-member">+ A'zo qo'shish</a>
    `
  });
}

export function memberDetailPage() {
  return appShell({
    active: "profile",
    title: `<section class="profile-hero"><span class="avatar xl">RB</span><h1>Ryan Bruzan</h1><p>Member · ryan@example.com</p></section>`,
    body: `
      <h2>Permissions</h2>
      <div class="stack">
        ${card({ icon: "🛡", title: "Admin Enabled", sub: "Has enhanced privileges", after: `<span class="switch"><i></i></span>` })}
        ${card({ icon: "💰", title: "Budget access", sub: "Can view/add, delete own only", tone: "blue" })}
        ${card({ icon: "✅", title: "Task access", sub: "Can create and complete tasks", tone: "mint" })}
      </div>
    `
  });
}

export function inviteMemberPage() {
  return appShell({
    active: "profile",
    title: `<h1>Invite member</h1>`,
    body: `
      <section class="hero-card">
        <p class="eyebrow">7 kun amal qiladi</p>
        <h3>${DOMAIN}/join/ABC123</h3>
        <p>Linkni Telegram, SMS yoki brauzer orqali yuboring.</p>
        <div class="button-row"><button class="button primary" data-action="copy">📋 Nusxalash</button><a class="button secondary" href="#/join">Preview join</a></div>
      </section>
    `
  });
}

export function birthdaysPage() {
  return appShell({
    active: "profile",
    title: `<h1>Tug'ilgan kunlar</h1>`,
    body: `
      <section class="hero-card">${card({ icon: "🎂", title: "3 kun qoldi", sub: "Jasur Karimov · 12-iyun · 38 yosh bo'ladi", tone: "yellow" })}</section>
      <h2>IYUN</h2>
      <div class="stack">${birthdays.map(b => card({ icon: "🎂", title: b.name, sub: `${b.date} · ${b.relation} · ${b.age}`, tone: "yellow", after: `<strong>${b.left}</strong>` })).join("")}</div>
    `,
    fab: `<a class="fab" href="#/birthday-add">+</a>`
  });
}

export function birthdayAddPage() {
  return appShell({
    active: "profile",
    body: sheet("Tug'ilgan kun qo'shish", `
      <form class="sheet-form">
        <label>Ism<input class="input" value="Jasur Karimov" /></label>
        <label>Kim?<div class="pills">${pill("Ota", true)}${pill("Ona")}${pill("Aka/opa")}${pill("Do'st")}</div></label>
        <div class="three-grid"><input class="input" value="12"><input class="input" value="Iyun"><input class="input" value="1988"></div>
        <label>Eslatish<div class="pills">${pill("7 kun", true)}${pill("3 kun", true)}${pill("1 kun", true)}</div></label>
        <a class="button primary full" href="#/birthdays">✅ Saqlash</a>
      </form>
    `, "#/birthdays")
  });
}

export function profilePage() {
  return appShell({
    active: "profile",
    title: `<section class="profile-hero"><span class="avatar xl">ZI</span><h1>Zilola Karimova</h1><p>👑 Oila Egasi · ${family.name}</p></section>`,
    body: `
      <div class="stats-grid">${stat("280", "Ball")}${stat("47", "Vazifa")}${stat("12", "Eslatma")}</div>
      <h2>Settings</h2>
      <div class="stack">
        ${card({ icon: "👨‍👩‍👧", title: "Oila", sub: "Karimovlar · 4 kishi", href: "#/members" })}
        ${card({ icon: "🎂", title: "Tug'ilgan kunlar", href: "#/birthdays", tone: "yellow" })}
        ${card({ icon: "🌐", title: "Til", sub: "O'zbek", href: "#/settings-language", tone: "blue" })}
        ${card({ icon: "⚙", title: "Family settings", sub: "Owner only", href: "#/family-settings", tone: "purple" })}
      </div>
    `
  });
}

export function languagePage() {
  return appShell({
    active: "profile",
    title: `<h1>Tilni tanlang</h1>`,
    body: `<div class="stack">
      ${card({ icon: "🇺🇿", title: "O'zbek", after: `<span class="check done">✓</span>` })}
      ${card({ icon: "🇷🇺", title: "Русский" })}
      ${card({ icon: "🇬🇧", title: "English" })}
    </div>`
  });
}

export function familySettingsPage() {
  return appShell({
    active: "profile",
    title: `<h1>Family settings</h1>`,
    body: `<div class="stack">
      ${card({ icon: "🏡", title: "Family name", sub: family.name })}
      ${card({ icon: "🔗", title: "Invite link", sub: "7 days expiration", tone: "blue", href: "#/invite-member" })}
      ${card({ icon: "⚠", title: "Danger zone", sub: "Leave or delete family", tone: "red" })}
    </div>`
  });
}

export function calendarPage() {
  const cells = Array.from({ length: 35 }, (_, i) => {
    const n = i + 1;
    const label = n <= 7 ? ["S","M","T","W","T","F","S"][i] : (n < 34 ? n - 7 : n - 33);
    return `<div class="calendar-day ${[1,2,34,35].includes(n) ? "is-muted" : ""}">${n === 27 ? `<span class="selected-day">23</span>` : label}<span class="day-dots"><i></i>${n%3===0 ? "<i class='blue'></i>" : ""}${n%4===0 ? "<i class='red'></i>" : ""}</span></div>`;
  }).join("");
  return appShell({
    active: "tasks",
    title: `<div class="row split"><h1>Calendar</h1><div class="pills">${pill("Month", true)}${pill("Week")}</div></div>`,
    body: `<section class="calendar-card">${cells}</section><h2>3 chores due March 23</h2><div class="stack">${tasks.slice(0,3).map(taskCard).join("")}</div>`
  });
}

export function leaderboardPage() {
  const sorted = [...family.members].sort((a,b) => b.points - a.points);
  return appShell({
    active: "tasks",
    title: `<h1>Leaderboard</h1>`,
    body: `
      <section class="hero-card leader-hero"><div class="icon icon-yellow icon-large">👑</div><h2>${sorted[0].name}</h2><p>${sorted[0].points} ball · Bu hafta 1-o'rin</p></section>
      <div class="stack">${sorted.map((m, i) => `<div class="list-card"><strong class="rank">${i+1}</strong><div class="meta"><strong>${m.name}</strong><span>${m.role}</span></div><strong>${m.points}</strong></div>`).join("")}</div>
    `
  });
}

export function searchPage() {
  return appShell({
    title: `<h1>Search</h1><p>Quickly search chores, reminders, members and budget records.</p>`,
    body: `<input class="input search-input" value="bozor" /><h2>Results</h2><div class="stack">${card({ icon: "✅", title: "Bozorga borish", sub: "Task · Bugun 18:00", href: "#/task-detail" })}${card({ icon: "🛒", title: "Oziq-ovqat", sub: "Budget · -285 000 UZS", tone: "red", href: "#/budget" })}</div>`
  });
}

export function statesPage(type = "loading") {
  if (type === "loading") {
    return appShell({ title: `<h1>Loading</h1>`, body: `<div class="stack">${Array.from({length:5},()=>`<div class="skeleton-card"><i></i><b></b><span></span></div>`).join("")}</div>` });
  }
  if (type === "empty") {
    return appShell({ body: emptyState("✅", "Hamma vazifalar bajarildi!", "Bugun uchun vazifalar qolmadi. Yangi vazifa qo'shishingiz mumkin.", "#/task-create", "Yangi qo'shing") });
  }
  return appShell({ body: emptyState("📵", "Internet ulanmagan", "Ulanishni tekshiring va qayta urinib ko'ring.", "#/dashboard", "Qayta urinish") });
}

export function permissionDeniedPage() {
  return appShell({ body: emptyState("🔒", "Bu imkoniyat sizga mavjud emas", "Bu sahifani faqat Owner yoki ruxsat berilgan member ko'ra oladi.", "#/dashboard", "Dashboard") });
}

export function routeMapPage() {
  const routes = [
    "/", "features", "pricing", "support", "privacy", "terms", "open-app", "join",
    "onboarding", "onboarding-choice", "onboarding-create", "onboarding-code", "onboarding-waiting", "onboarding-success",
    "dashboard", "dashboard-child", "quick-add", "budget", "budget-report", "budget-add-type", "budget-add-amount", "budget-add-category", "budget-add-final",
    "tasks", "task-detail", "task-create", "tasks-filter", "reminders", "reminder-create", "reminder-snooze",
    "members", "member-detail", "invite-member", "birthdays", "birthday-add", "profile", "settings-language", "family-settings",
    "calendar", "leaderboard", "search", "states-loading", "states-empty", "states-error", "permission-denied"
  ];
  return domainShell(`
    <section class="hero-card"><p class="eyebrow">QA</p><h1>Route map</h1><p>All flows are now in one Vite project with hash routing.</p></section>
    <div class="route-grid">${routes.map(r => `<a href="#/${r === "/" ? "" : r}">#/${r}</a>`).join("")}</div>
  `);
}

export function notFoundPage() {
  return domainShell(`${emptyState("404", "Page not found", "The route does not exist or the invite link expired.", "#/", "Go home")}`);
}
