# @uyimiz_bot — To'liq Texnik Topshiriq (TZ) v2.0

> **Versiya:** 2.0 | **Holat:** Implementation-Ready | **Sana:** May 2026
> **Ekspert jamoasi:** Business Analyst · System Analyst · Solution Architect · Backend Engineer · Frontend Engineer · DB Architect · DevOps · Security · QA · UX Designer · Technical Writer

***

## 1. Loyiha Umumiy Ko'rinishi (Project Overview)

**@uyimiz_bot** — O'zbek, Rus va Ingliz tillarida ishlaydigan, oilaning kundalik hayotini boshqarish, rejalashtirish, sog'liq, tarbiya va moliyani qo'llab-quvvatlash uchun mo'ljallangan ko'p platformali ekosistem. Loyiha uch komponentdan iborat: Telegram Bot (asosiy interfeys), Telegram Mini App (boy UI), va Admin Panel (boshqaruv).

Global family management app bozori 2025-yilda **$3.8 milliard** ni tashkil etib, 2034-yilga kelib **$9.7 milliardga** yetishi kutilmoqda (CAGR 10.9%). Parenting apps bozori 2024-yilda **$552.6 million** bo'lib, 2034-yilga 8.3% o'sishi prognoz qilinmoqda. Bu loyiha ushbu o'sib kelayotgan segmentda CIS va O'rta Osiyoga mo'ljallangan bo'shliqni to'ldiradi.[^1][^2]

***

## 2. Biznes Maqsadlar (Business Goals)

| # | Maqsad | O'lchov (KPI) | Muddat |
|---|--------|---------------|--------|
| BG-1 | MVP ishga tushirish | 100 oila (beta) | Sprint 3 |
| BG-2 | Foydalanuvchi bazasini oshirish | 10,000 oila | 6 oy |
| BG-3 | Premium obuna daromadi | $3,000/oy ARR | 9 oy |
| BG-4 | Foydalanuvchi saqlab qolish | DAU/MAU > 40% | 6 oy |
| BG-5 | 3 tilda global kengayish | UZ + RU + EN | 12 oy |
| BG-6 | App Store / Play Store chiqarish | TMA 800M+ user | 4 oy |

***

## 3. Muammo Bayoni (Problem Statement)

### Joriy Muammolar:

**Oilalar uchun:**
- Yumushlar, byudjet va eslatmalar turli ilovalar (Excel, WhatsApp, Notes) bo'yicha tarqoq
- Tug'ilgan kunlar va muhim sanalar unutiladi
- Bolalar tarbiyasi va rivojlanish kuzatuvi tizimli emas
- Dori va birinchi yordam ma'lumotlari kerak bo'lganda tez topilmaydi
- Sog'lom ovqatlanish rejasi yo'q

**Bozordagi bo'shliq:**
- Cozi va FamilyWall ingliz tilida va G'arb bozoriga mo'ljallangan[^3][^4]
- CIS va O'rta Osiya uchun lokallashtirilgan yechim yo'q
- Telegram'da ishlaydi — alohida app yuklab olish shart emas (800M+ MAU)[^5]
- O'zbek milliy taomlar, retseptlar, mahalliy dorilar bazasi yo'q

### Taklif etilayotgan Yechim:
Telegram ekosistemasi ichida to'liq oilaviy boshqaruv platformasi — bot, mini app va veb sayt orqali.

***

## 4. Qamrov (Scope)

### MVP ga kiradi (In Scope):
- Oila ro'yxatga olish va invite system
- Byudjet boshqaruvi (Modul 1)
- Yumushlar + gamification (Modul 2)
- Eslatmalar + scheduler (Modul 3)
- Tug'ilgan kun eslatmalari (Modul 4)
- Bot + Telegram Mini App
- UZ/RU/EN lokalizatsiya
- Docker + VPS deployment

### Keyingi versiyalarga qoladi (Out of Scope - MVP):
- Farzand tarbiyasi moduli (V1.5)
- Sog'liq va parhez (V2.0)
- Birinchi yordam KB (V2.0)
- Muhim ishlar moduli (V1.5)
- AI maslahatchi (V3.0)
- Mobil native app (V4.0)
- To'lov tizimi / Premium (V2.0)

***

## 5. Versiyalar Xaritasi (MVP / V1 / Future)

| Versiya | Modul | Vaqt | Maqsad |
|---------|-------|------|--------|
| **MVP (v0.1)** | Onboarding, Oila yaratish, Bot asosi | Sprint 1-2 | Infra + Bot ishlashi |
| **MVP (v0.2)** | Byudjet + Yumushlar + Eslatmalar | Sprint 3-4 | Core loops |
| **MVP (v0.3)** | Tug'ilgan kun + Mini App beta | Sprint 5-6 | UI + Scheduler |
| **V1.0** | Muhim ishlar + Farzand tarbiyasi | Sprint 7-9 | Full feature |
| **V1.5** | Sog'liq + Parhez | Sprint 10-12 | Health layer |
| **V2.0** | Birinchi yordam + Dori KB | Sprint 13-15 | Medical layer |
| **V2.5** | AI maslahatchi + PDF hisobot | Sprint 16-18 | Intelligence |
| **V3.0** | Premium + To'lov + API ochish | Sprint 19-21 | Monetization |

***

## 6. Manfaatdorlar (Stakeholders)

| Rol | Kim | Mas'uliyat |
|-----|-----|-----------|
| **Product Owner** | Loyiha egasi | Prioritizatsiya, accept/reject |
| **Tech Lead** | Senior Backend Developer | Arxitektura qarorlari |
| **Bot Developer** | Backend + Bot | Telegraf, NestJS |
| **Frontend Dev** | Mini App + Admin | React, Vite |
| **DB Architect** | PostgreSQL + Drizzle | Schema, migrations |
| **DevOps** | CI/CD, Docker | Deployment |
| **QA Engineer** | Testing | Test plans |
| **UX Designer** | Telegram UI/UX | Bot flow, Mini App design |
| **End Users** | Oila a'zolari | Asosiy foydalanuvchilar |

***

## 7. Foydalanuvchi Rollari (User Roles)

```
Oila Egasi (Family Owner / Admin)
  └── Oila A'zosi (Member)
        └── Bola (Child - restricted)
              └── Mehmon (Guest - read-only, future)

Super Admin (Platform level - admin panel)
```

### Rol ta'riflari:

| Rol | Telegram | Mini App | Admin Panel | Tavsif |
|-----|----------|----------|-------------|--------|
| **Super Admin** | — | — | Tam kirish | Platform boshqaruvi |
| **Family Owner** | Barcha | Barcha | Faqat o'z oilasi | Oila yaratadi, a'zo qo'shadi |
| **Member** | Ko'p | Ko'p | Yo'q | Oddiy a'zo |
| **Child** | Cheklangan | Cheklangan | Yo'q | Faqat vazifa, jadval |
| **Guest** | Read-only | Read-only | Yo'q | Kelajak versiya |

***

## 8. Ruxsatlar Matritsasi (Permission Matrix)

| Amal | Super Admin | Family Owner | Member | Child |
|------|:-----------:|:------------:|:------:|:-----:|
| Oila yaratish | ✅ | ✅ | ❌ | ❌ |
| A'zo qo'shish | ✅ | ✅ | ❌ | ❌ |
| A'zo o'chirish | ✅ | ✅ | ❌ | ❌ |
| Byudjet qo'shish | ✅ | ✅ | ✅ | ❌ |
| Byudjet ko'rish | ✅ | ✅ | ✅ | ❌ |
| Byudjet o'chirish | ✅ | ✅ | Faqat o'ziniki | ❌ |
| Vazifa yaratish | ✅ | ✅ | ✅ | ❌ |
| Vazifa belgilash | ✅ | ✅ | ✅ | ❌ |
| Vazifani bajarish | ✅ | ✅ | ✅ | ✅ (o'zinikini) |
| Eslatma yuborish | ✅ | ✅ | ✅ | ❌ |
| Tug'ilgan kun qo'shish | ✅ | ✅ | ✅ | ❌ |
| Sog'liq yozuvlari | ✅ | ✅ | ✅ (o'ziniki) | ✅ (o'ziniki) |
| Oila sozlamalari | ✅ | ✅ | ❌ | ❌ |
| Platform statistikasi | ✅ | ❌ | ❌ | ❌ |

***

## 9. Foydalanuvchi Personajlar (User Personas)

### Persona 1: Zilola — "Band Ona"
- **Yosh:** 34 | **Shahar:** Toshkent | **Kasb:** Xodim
- **Muammo:** 3 ta bola, eri bilan yumushlarni taqsimlash qiyin, xarajatlarni kuzatmaydi
- **Maqsad:** Oilani tartibga solish, xarajatlarni nazorat qilish
- **Ishlatish:** Har kuni ertalab 5 daqiqa, kechqurun 10 daqiqa
- **Kanal:** Telegram (asosiy)

### Persona 2: Jasur — "Mas'ul Ota"
- **Yosh:** 38 | **Shahar:** Samarqand | **Kasb:** Tadbirkor
- **Muammo:** Uy xarajatlari nazorat qilinmaydi, muhim to'lovlar unutiladi
- **Maqsad:** Moliyaviy nazorat, muhim sanalarni unutmaslik
- **Ishlatish:** Haftasiga 3-4 marta, hisobotlar ko'rish
- **Kanal:** Bot + Mini App

### Persona 3: Dildora — "Yoshlik Oilasi"
- **Yosh:** 26 | **Shahar:** Buxoro | **Kasb:** O'qituvchi
- **Muammo:** Yangi turmush qurishgan, har narsa yangi, tashkil etish qiyin
- **Maqsad:** Oilaviy hayotni boshlash uchun yordamchi
- **Ishlatish:** Har kuni, hamma funksiyalar
- **Kanal:** Mini App (asosiy)

### Persona 4: Rustam — "Diaspora O'zbegi"
- **Yosh:** 31 | **Shahar:** Moskva | **Kasb:** IT mutaxassis
- **Muammo:** Ota-onasi bilan masofadan aloqa, ularning sog'lig'ini kuzatish
- **Maqsad:** Uzoqdan oilaviy bog'lanish
- **Kanal:** Bot + Rus tili

***

## 10. Funksional Talablar (Functional Requirements)

***

### FR-01: Onboarding & Oila Yaratish

**Tavsif:** Yangi foydalanuvchi botni ishga tushirib, oila yaratadi yoki mavjud oilaga qo'shiladi.

| Maydon | Qiymat |
|--------|--------|
| **Actor** | Yangi foydalanuvchi |
| **Prioritet** | 🔴 CRITICAL |
| **User Story** | "Men oila boshlig'i sifatida yangi oila yaratib, er-xotinim va bolalarimni qo'shishni xohlayman" |

**Asosiy Oqim:**
1. Foydalanuvchi `/start` yuboradi
2. Bot til tanlashni so'raydi (UZ / RU / EN)
3. Foydalanuvchi tilni tanlaydi
4. Bot: "Oila yaratish yoki mavjud oilaga qo'shilish?" — 2 tugma
5. "Oila yaratish" → oila nomini kiritadi
6. Bot 6 ta raqamli invite kod + QR link yaratadi
7. Foydalanuvchi "Family Owner" rolini oladi
8. Asosiy menyu ko'rinadi

**Alternativ Oqim (qo'shilish):**
1. Foydalanuvchi invite kod kiritadi yoki `/join XXXXXX`
2. Sistem familia topadi, admin tasdig'i so'raladi
3. Admin "Qabul qilish" bosadi → a'zo qo'shiladi

**Xato Oqimlari:**
- Invite kod noto'g'ri: "Kod topilmadi. Qayta urinib ko'ring."
- Oila to'liq (free tarif 4 kishi): "Premium ga o'ting"
- Admin 24 soat tasdiqlasa → avtomatik rad

**Biznes Qoidalar:**
- Bir Telegram account faqat bitta oilada bo'la oladi
- Oila nomi 3-50 belgi, maxsus belgilar yo'q
- Invite kod 7 kun amal qiladi, bir martalik

**Validatsiya Qoidalari:**
- `oilaAdi.length >= 3 && <= 50`
- `telegramId` unikal bo'lishi shart
- Invite kod 6 ta raqam, expires_at tekshiruvi

**Edge Cases:**
- Foydalanuvchi ikkinchi marta `/start` — mavjud profilni ko'rsatish
- Bot bloklangan edi, qayta block olindi → state saqlangan
- Bir vaqtda ikki xil oilaga invite — birinchisi qabul qilinadi, ikkinchisi rad

**Acceptance Criteria:**
- [ ] `/start` 2 soniyadan kam javob beradi
- [ ] Invite kod yaratiladi va bazada saqlanadi
- [ ] Admin bildirishnoma oladi
- [ ] Oila yaratilganda DB trigger ishlaydi

***

### FR-02: Byudjet Boshqaruvi

**Tavsif:** Oila xarajatlari va daromadlarini kiritish, kategoriyalash va hisobot olish.

| Maydon | Qiymat |
|--------|--------|
| **Actor** | Family Owner, Member |
| **Prioritet** | 🔴 HIGH |
| **User Story** | "Men bu oy oilam qancha sarflaganini bilishni va kategoriya bo'yicha ko'rishni xohlayman" |

**Asosiy Oqim (xarajat qo'shish):**
1. `/add_expense` yoki menyu → "💸 Xarajat qo'sh"
2. Miqdor kiritadi (raqam)
3. Kategoriya tanlaydi (inline keyboard — 8 kategoriya)
4. Ixtiyoriy izoh kiritadi
5. Sana: "Bugun" yoki boshqa sana
6. Tasdiqlash xabari: "✅ 150,000 UZS — Oziq-ovqat qo'shildi"
7. Oila a'zolariga bildirishnoma

**Asosiy Oqim (hisobot):**
1. `/report` yoki "📊 Hisobot"
2. Bot: "Qaysi davr?" — Buoy / O'tgan oy / Haftali / Custom
3. Davr tanlanadi
4. PostgreSQL aggregate query:
   - Umumiy daromad, xarajat, balans
   - Kategoriya bo'yicha ulush (%)
   - Kunlar bo'yicha trend
5. Mini App da grafik ko'rinadi (yoki bot da text jadval)

**Alternativ Oqim:**
- Ovozli xabar: "Yuz ming so'm oziq-ovqat" → NLP (future V2)
- Rasm (chek foto) → OCR (future V3)

**Xato Oqimlari:**
- Manfiy miqdor: "Miqdor musbat bo'lishi kerak"
- Belgi emas raqam: "Faqat raqam kiriting"
- 999 trillion dan katta: "Miqdor juda katta"

**Biznes Qoidalar:**
- Valyuta: UZS (asosiy), USD, RUB (kelajak)
- Xarajat kiritganda oila balansidan ayiriladi
- Daromad oila balansiga qo'shiladi
- Byudjet limiti: Owner belgilaydi, limit oshsa ogohlantirish

**Validatsiya:**
- `amount > 0 && amount <= 9_999_999_999` (10 mlrd limit)
- `category` enum ichida bo'lishi shart
- `txDate` kelajak sanasi bo'lmasin (max = bugun)

**Edge Cases:**
- Ikki a'zo bir vaqtda xarajat qo'shsa → race condition yo'q (PostgreSQL transaction)
- A'zo oiladan chiqib ketsa → uning yozuvlari saqlanadi (userId = null)
- 0 qiymat: rad etiladi

**Acceptance Criteria:**
- [ ] Xarajat 1 soniyadan kam qo'shiladi
- [ ] Hisobot to'g'ri aggregate ko'rsatadi
- [ ] RLS: faqat o'z oilasi ma'lumotlarini ko'radi
- [ ] Balans real vaqtda yangilanadi

***

### FR-03: Yumushlar & Gamification

**Tavsif:** Uy yumushlarini yaratish, taqsimlash, kuzatish va ballar tizimi.

| Maydon | Qiymat |
|--------|--------|
| **Actor** | Family Owner, Member |
| **Prioritet** | 🟡 HIGH |
| **User Story** | "Men er-xotinim bilan yumushlarni adolatli taqsimlashni va kim ko'p ish qilganini ko'rishni xohlayman" |

**Asosiy Oqim:**
1. `/tasks` → "Yumushlar" menyusi
2. "➕ Vazifa qo'sh" → sarlavha kiritadi
3. Kategoriya: 🍽 🧹 🛒 👶 🔧 📦
4. Kimga: "O'zim" yoki oila a'zosi
5. Muddat: optional
6. Takrorlanish: none/daily/weekly/monthly
7. Ballar: avtomatik (10-50 gap) yoki manual
8. Saqlash → belgilangan a'zoga bildirishnoma

**Bajarish oqimi:**
1. "✅ Bajarildi" bosadi
2. PostgreSQL trigger: `task_completed` notify
3. PgNotify → NestJS EventEmitter → BullMQ job
4. Ball a'zoning haftalik skoriga qo'shiladi
5. "🏆 Oila Qahramoni" (hafta yutuqchisi) e'lon qilinadi

**Gamification Qoidalar:**
- Har bajarilgan vazifa: 10-50 ball
- Kechikkan vazifa bajarilsa: 50% ball
- Haftalik liderboard: "Bu hafta Zilola 280 ball to'pladi! 🥇"
- Yiliga 1000+ ball: "Oila Qahramoni" unvoni

**Edge Cases:**
- A'zo oiladan chiqsa — uning bajarilmagan vazifalari Owner ga o'tadi
- Bir vazifani ikki kishi bir vaqtda "bajarildi" bossa → birinchisi qabul, ikkinchisiga "Allaqachon bajarildi"
- Muddat o'tgan vazifa: har kuni bildirishnoma (max 3 marta)

**Acceptance Criteria:**
- [ ] Vazifa yaratilganda belgilangan a'zo bildirishnoma oladi
- [ ] Ball tizimi to'g'ri ishlaydi
- [ ] Haftalik yutuqchi avtomatik e'lon qilinadi (pg_cron)
- [ ] Liderboard real vaqtda yangilanadi

***

### FR-04: Eslatmalar

**Tavsif:** Shaxsiy va guruh eslatmalarini yaratish, scheduler orqali yuborish.

| Maydon | Qiymat |
|--------|--------|
| **Actor** | Barcha rollar (cheklangan) |
| **Prioritet** | 🔴 HIGH |
| **User Story** | "Men kechqurun ergimanikiga eslatma yuborishni va kerak bo'lganda kechiktirish imkonini xohlayman" |

**Asosiy Oqim:**
1. "🔔 Eslatma qo'sh"
2. Sarlavha va matn
3. Kimga: o'zim / boshqa a'zo / hammasi
4. Vaqt: tanlash yoki "30 daqiqadan keyin"
5. Takrorlanish
6. Saqlash → BullMQ delayed job yaratiladi
7. `jobId` DB da saqlanadi (qayta ulash uchun)

**Eslatma yetkazish oqimi:**
1. BullMQ scheduled job fires
2. Worker: Telegram Bot API `sendMessage`
3. Inline keyboard: "✅ Qabul qildim" | "⏰ 10 daqiqa kechiktir"
4. "Qabul" bosadi → `confirmed_at` belgilanadi
5. "Kechiktir" → BullMQ yangi delayed job: +10 daqiqa

**Xato Oqimlari:**
- O'tgan vaqt kiritilsa: "Kelajak vaqtni kiriting"
- Bot bloklangan → retry 3 marta, keyin "delivery failed" log
- Redis down → job persistent, qayta tiklanadi[^6]

**Biznes Qoidalar:**
- Free: max 30 eslatma/oy
- Premium: cheksiz
- Snooze: max 5 marta
- Takrorlanadigan eslatma o'chirilmasa — "zombi job" oldini olish uchun `jobId` tracking

**Edge Cases:**
- Server restart → BullMQ Redis da job saqlanadi, qayta tiklanadi[^7]
- Vaqt zonasi: har foydalanuvchi o'z timezone si (default: Asia/Tashkent)
- Eslatma vaqti kelib, foydalanuvchi bot bloklagan → error log, skip

**Acceptance Criteria:**
- [ ] Eslatma 30 soniya ichida yetkaziladi (belgilangan vaqtdan)
- [ ] Snooze to'g'ri ishlaydi
- [ ] jobId DB da saqlanadi va BullMQ bilan sinxron

***

### FR-05: Tug'ilgan Kun Eslatmalari

**Tavsif:** Oila va yaqinlarning tug'ilgan kunlarini avtomatik kuzatish va tabriklash.

| Maydon | Qiymat |
|--------|--------|
| **Actor** | Owner, Member |
| **Prioritet** | 🟡 MEDIUM-HIGH |
| **User Story** | "Men oila a'zolarim va yaqinlarning tug'ilgan kunlarini unutmaslik uchun 7, 3, 1 kun oldin eslatma olishni xohlayman" |

**Asosiy Oqim:**
1. "🎂 Tug'ilgan kun qo'sh"
2. Ism va munosabat (ota, ona, do'st...)
3. Tug'ilgan sana (kun.oy.yil formatda)
4. Eslatma necha kun oldin:  (default)[^8][^9][^10]
5. Saqlash

**Avtomatik eslatma oqimi:**
- `pg_cron` har kuni 08:00 (UTC 03:00) ishlaydi[^11]
- Bugun tug'ilgan kunlar topiladi
- N kun oldin eslatma — ham `pg_cron` ham BullMQ
- Tug'ilgan kunda: "🎂 Bugun Zilolaning tug'ilgan kuni! Yoshi: 34"
- AI tabriklash matni taklifi (OpenAI, future)

**Edge Cases:**
- 29 fevral tug'ilgan: 28 fevral eslatma beriladi (leap year check)
- Ism 150+ belgili: validatsiya rad etadi
- Bir kunda bir nechta tug'ilgan kun: alohida xabarlar

**Acceptance Criteria:**
- [ ] `pg_cron` ishlab turar holda kun boshida eslatmalar yuboriladi
- [ ] 7-3-1 kun oldin eslatmalar to'g'ri ishlaydi
- [ ] Yosh to'g'ri hisoblanadi

***

### FR-06 — FR-10 (Keyingi versiyalar)

**FR-06: Farzand Tarbiyasi** — V1.0 da qo'shiladi. Profil, jadval, baholar, emlash tarixchasi.

**FR-07: Muhim Ishlar Ro'yxati** — V1.0 da qo'shiladi. Priority matrix, progress tracker.

**FR-08: Sog'lom Turmush Tarzi** — V1.5 da qo'shiladi. BMI, suv, uyqu, bosim.

**FR-09: Parhez & Ovqatlanish** — V1.5 da qo'shiladi. Kaloriya, retseptlar, O'zbek taomlar DB.

**FR-10: Birinchi Yordam & Dori** — V2.0 da qo'shiladi. FTS qidiruv, dori jadval.

***

## 11. Foydalanuvchi Oqimlari (User Flows)

### Onboarding Flow:
```
[/start] → [Til tanlash] → [Oila yaratish | Qo'shilish]
    ↓                              ↓
[Nom kiritish]           [Invite kod kiritish]
    ↓                              ↓
[Kod yaratiladi]         [Admin tasdig'i]
    ↓                              ↓
[Asosiy Menyu]           [Asosiy Menyu]
```

### Byudjet Qo'shish Flow:
```
[Menyu] → [💰 Byudjet] → [➕ Xarajat | ➕ Daromad | 📊 Hisobot]
              ↓
         [Miqdor] → [Kategoriya] → [Izoh?] → [Sana] → [✅ Saqlash]
              ↓
         [Bildirishnoma → Oila]
```

### Eslatma Flow:
```
[Menyu] → [🔔 Eslatma] → [Matn] → [Kimga] → [Vaqt] → [Takror?]
              ↓
         [BullMQ Delayed Job yaratiladi]
              ↓ (vaqt kelganda)
         [Bot xabar yuboradi] → [✅ Qabul | ⏰ Kechiktir]
```

***

## 12. Frontend Talablari

### 12.1 Telegram Bot UI (Conversation UI)

**Printsiplar:**
- Minimal text, maksimal inline keyboard
- Har bir jarayon max 4-5 qadam
- `/cancel` har doim ishlaydi
- Xato xabarlari aniq va harakatga undovchi
- Emoji ikonalar navigatsiyani osonlashtiradi

**Asosiy Menyu (Inline Keyboard 2x5):**
```
[💰 Ro'zg'or]   [🏡 Yumushlar]
[🔔 Eslatmalar] [🎂 Tug'ilganlar]
[👶 Tarbiya]    [✅ Muhim Ishlar]
[🏃 Sog'liq]   [🥗 Parhez]
[💊 Dori]       [⚙️ Sozlamalar]
[🌐 Mini App]
```

**Bot UX Qoidalari:**
- Wizard ssenariylari (FSM bilan) — ko'p bosqichli formalar
- Progress indikator: "Qadam 2/4"
- Bekor qilish: har doim "❌ Bekor qilish" tugmasi
- Back navigatsiya: "⬅️ Orqaga"
- Pagination: 10 ta element, "⬅️ ➡️" tugmalar

### 12.2 Telegram Mini App (TMA)

**Stack:** Vite + React + TypeScript + `@telegram-apps/sdk-react` + TanStack Router + TanStack Query + Zustand + Tailwind CSS + shadcn/ui[^12]

**TMA Arxitektura:**
```
src/
  routes/           ← TanStack Router pages
    index.tsx         ← Dashboard
    budget/           ← Byudjet sahifalar
    tasks/            ← Yumushlar
    reminders/        ← Eslatmalar
    birthdays/        ← Tug'ilgan kunlar
    settings/         ← Sozlamalar
  components/
    ui/               ← shadcn/ui komponetlar
    charts/           ← Recharts grafiklari
    forms/            ← React Hook Form formlar
  stores/             ← Zustand stores
  hooks/              ← Custom hooks
  lib/                ← API client (TanStack Query)
```

**TMA Xavfsizlik:** `initData` validatsiyasi server side — har so'rovda Telegram signature tekshiriladi[^13]

**TMA UX Qoidalari:**
- Telegram'ning native UI komponentlari: `MainButton`, `BackButton`, `HapticFeedback`[^14]
- `useThemeParams()` — Telegram tema renglarini olish
- Mobil birinchi: 375px dan boshlanadi
- Bottom navigation (4-5 tab)
- Loading skeleton state
- Offline state ko'rsatish

### 12.3 Admin Panel

**Stack:** Vite + React + TypeScript + shadcn/ui + TanStack Table + Recharts

**Sahifalar:**
- Dashboard: statistika, grafik, KPIlar
- Oilalar ro'yxati va boshqaruvi
- Foydalanuvchilar boshqaruvi
- Bildirishnoma yuborish
- Tizim sozlamalari

### 12.4 Public Web (Astro)

**Stack:** Astro + Tailwind CSS

**Sahifalar:** `/` Landing, `/features`, `/pricing`, `/docs`, `/blog`

***

## 13. Backend Talablari

### 13.1 NestJS Arxitekturasi (DDD + CQRS)

**Asosiy Printsiplar:**
- Modular Monolith — har modul o'z `domain/application/infrastructure/presentation` katlamiga ega[^15][^16]
- CQRS — Commands (yozish) va Queries (o'qish) ajratilgan[^16][^17]
- Event-driven — modul ichki kommunikatsiya EventEmitter2 orqali
- Repository Pattern — domain infra dan mustaqil
- Railway-Oriented Programming — `Result<T, E>` error handling[^17]

**Bounded Context xaritasi:**
```
modules/
  ├── family/        ← BC: Oila va a'zolar
  ├── budget/        ← BC: Moliya
  ├── tasks/         ← BC: Vazifalar + gamification
  ├── reminders/     ← BC: Eslatmalar + scheduler
  ├── birthdays/     ← BC: Tug'ilgan kunlar
  ├── children/      ← BC: Farzandlar
  ├── health/        ← BC: Sog'liq
  ├── diet/          ← BC: Parhez
  ├── medications/   ← BC: Dorilar
  ├── first-aid/     ← BC: Birinchi yordam KB
  └── important-tasks/ ← BC: Muhim ishlar
```

### 13.2 BullMQ Queue Arxitekturasi

**Queuelar:**[^18][^7][^6]

```typescript
// Queue nomlari va maqsadlar
const QUEUES = {
  REMINDERS:    'reminders',      // Delayed: eslatma yuborish
  NOTIFICATIONS:'notifications',  // Fast: darhol bildirishnoma
  BIRTHDAY:     'birthday',       // Scheduled: tug'ilgan kun check
  REPORTS:      'reports',        // Heavy: hisobot generatsiya
  CLEANUP:      'cleanup',        // Cron: DB tozalash
  WEATHER:      'weather',        // Cron: ob-havo ma'lumoti
};
```

**Worker konfiguratsiyasi:**
```typescript
// reminders.worker.ts
const worker = new Worker('reminders', processor, {
  connection: redisConfig,
  concurrency: 10,
  limiter: { max: 100, duration: 1000 }, // 100 job/sec
});
```

**Best practices:**[^6]
- Job `attempts: 3`, `backoff: exponential`
- `removeOnComplete: { count: 100 }` — memory management
- `removeOnFail: { count: 50 }` — debug uchun saqlash
- `jobId` DB da saqlash — duplicate prevention
- Bull Board monitoring dashboard qo'shish

### 13.3 Redis Caching Strategiyasi

**Cache qatlamlari:**
- **L1: In-memory (CacheableMemory)** — 60 soniya, 5000 element, LRU
- **L2: Redis** — 1-24 soat, persistent

**Cache kalitlari:**
```
family:{familyId}:profile          → 1 soat
family:{familyId}:members          → 30 daqiqa
family:{familyId}:budget:month:{Y-M} → 5 daqiqa
family:{familyId}:tasks:active     → 2 daqiqa
user:{userId}:profile              → 30 daqiqa
first-aid:category:{cat}:lang:{l}  → 24 soat (static)
medications:search:{query}         → 10 daqiqa
```

**Cache invalidation:**
- Write-through: yozganda ham cache ham DB yangilanadi
- Event-based: `task_completed` → `tasks:active` cache o'chiriladi
- TTL-based: har cache o'zining TTL si bor

***

## 14. API Spetsifikatsiyasi

### 14.1 REST API (Mini App + Admin uchun)

**Bazaviy URL:** `https://api.uyimiz.app/v1`

**Autentifikatsiya:** Telegram `initData` (Mini App) | JWT (Admin)

#### Asosiy Endpointlar:

```
POST   /auth/telegram          → TMA login
GET    /families/me            → Mening oilam
POST   /families               → Oila yaratish
POST   /families/join          → Oilaga qo'shilish

GET    /budget                 → Byudjet ro'yxati (pagination)
POST   /budget                 → Yozuv qo'shish
DELETE /budget/:id             → O'chirish
GET    /budget/report          → Aggregate hisobot

GET    /tasks                  → Vazifalar (filter: status, assigned)
POST   /tasks                  → Vazifa yaratish
PATCH  /tasks/:id              → Tahrirlash / status o'zgartirish
DELETE /tasks/:id              → O'chirish

POST   /reminders              → Eslatma yaratish
PATCH  /reminders/:id/snooze   → Kechiktirish
PATCH  /reminders/:id/confirm  → Tasdiqlash
DELETE /reminders/:id          → O'chirish (BullMQ job ham bekor)

GET    /birthdays              → Tug'ilgan kunlar
POST   /birthdays              → Qo'shish

GET    /leaderboard            → Haftalik ball reytingi
```

#### Response Format:
```typescript
// Success
{ "data": T, "meta": { "total"?: number, "page"?: number } }

// Error
{ "error": { "code": string, "message": string, "details"?: unknown } }
```

#### Pagination:
```
GET /tasks?page=1&limit=10&status=new&assignedTo=uuid
```

### 14.2 Webhook (Bot uchun)

```
POST /bot/webhook   → Telegram webhook updates
```

***

## 15. Ma'lumotlar Bazasi Dizayni

### 15.1 Asosiy Jadvallar

*(Avvalgi TZ dan schema saqlanadi — to'liq Drizzle schema yuqorida keltirilgan)*

### 15.2 PostgreSQL Maximal Imkoniyatlar

**1. Row Level Security (RLS) — oila izolyatsiyasi:**
- Har `family_id` li jadval uchun RLS yoqiladi
- `current_setting('app.current_family_id')` orqali dinamik filtr
- Application layer da `SET LOCAL` bilan inject qilinadi
- Natija: SQL injection bo'lsa ham boshqa oila ma'lumotlari ko'rinmaydi

**2. Full-Text Search (FTS) — tsvector:**[^11]
- `medications.fts_vector` — GENERATED ALWAYS AS, GIN index
- `first_aid_items.fts_uz/ru/en` — har til uchun alohida tsvector
- `tasks.fts_vector` — sarlavha va kategoriya
- So'rov: `WHERE fts_vector @@ plainto_tsquery('simple', $1)`
- Fuzzy: `ts_rank` bilan relevance sorting

**3. LISTEN/NOTIFY — real-time:**
- Trigger: task bajarildi → `pg_notify('task_completed', payload)`
- Trigger: eslatma qo'shildi → `pg_notify('reminder_created', payload)`
- NestJS: `postgres` lib dedicated connection bilan `LISTEN` qiladi
- EventEmitter2 ga forward qilinadi → BullMQ job yaratiladi

**4. pg_cron — server-side scheduling:**
- Har kuni 03:00 UTC: tug'ilgan kun tekshirish
- Har hafta Dushanba: haftalik hisobot yaratish
- Har oy 1-kuni: byudjet reset eslatmasi
- Har kuni: muddat o'tgan dorilar eslatmasi

**5. Partial Indexes — performance:**
- `WHERE status != 'done'` — faqat aktiv tasklar
- `WHERE confirmed_at IS NULL` — kutilayotgan eslatmalar
- `WHERE end_date >= CURRENT_DATE` — aktiv dorilar

**6. Identity Columns (2025 standard):**[^11]
```sql
id: integer().primaryKey().generatedAlwaysAsIdentity()
```

**7. JSONB — flexible ma'lumotlar:**
- `medications.schedule` — dori jadval (moslashuvchan)
- `health_records.value` — o'lchov turlari (BP, qand, puls)
- `families.settings` — oila sozlamalari
- JSONB indexlar: `CREATE INDEX ON medications USING GIN(schedule)`

### 15.3 Migrations Strategiyasi

- `drizzle-kit generate` — TypeScript schema dan SQL generatsiya[^19]
- `drizzle-kit migrate` — production da ishlatiladi
- `drizzle-kit push` — dev uchun (schema push)
- Rollback: har migration uchun `down` SQL yoziladi
- Seed data: `first_aid_items` va `medications` uchun seed scripts

***

## 16. Integratsiyalar

| Integratsiya | Maqsad | Versiya | Priority |
|--------------|--------|---------|----------|
| **Telegram Bot API** | Bot asosi | MVP | 🔴 CRITICAL |
| **Telegram Mini App** | Rich UI | MVP | 🔴 CRITICAL |
| **OpenWeather API** | Ob-havo | V1.0 | 🟡 |
| **OpenAI API** | Tabriklash matni | V2.0 | 🟢 |
| **Gemini API** | AI maslahatchi | V2.5 | 🟢 |
| **Telegram Stars** | To'lov (digital goods)[^13] | V3.0 | 🟡 |
| **Sentry** | Error tracking | MVP | 🔴 |
| **Grafana + Prometheus** | Monitoring | V1.0 | 🟡 |
| **S3/MinIO** | Rasm saqlash | V1.5 | 🟡 |
| **SendGrid/SMTP** | Email (admin) | V1.0 | 🟢 |

**Telegram Stars to'lov:**[^13]
- Digital tovarlar (premium obuna) faqat Telegram Stars orqali to'lanadi (Apple/Google siyosati)
- Jismoniy tovarlar/xizmatlar — boshqa to'lov tizimi ham mumkin
- Qaytarish: `/paysupport` buyrug'i majburiy

***

## 17. Autentifikatsiya va Avtorizatsiya

### 17.1 Telegram Bot (Inline auth)
- Har so'rov `telegramId` bilan keladi
- DB da `users` jadvali — `telegramId` bo'yicha user topiladi
- Topilmasa → `/start` ga yo'naltirish
- `familyId` dan RLS context set qilinadi

### 17.2 Telegram Mini App (JWT)
```
1. TMA opens → initData yuboriladi
2. Server: HMAC-SHA256 bilan initData validatsiyasi
3. Valid → JWT access token (15 daqiqa) + refresh token (7 kun)
4. Keyingi so'rovlar: Authorization: Bearer <token>
```

**initData validatsiya kodi:**
```typescript
import * as crypto from 'crypto';

function validateTelegramInitData(initData: string, botToken: string): boolean {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');

  const checkString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData')
    .update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey)
    .update(checkString).digest('hex');

  return hmac === hash;
}
```

### 17.3 Admin Panel (JWT + Role)
- Username/password login
- JWT access (15 min) + refresh (30 kun)
- Rol: `super_admin` — NestJS Guard bilan tekshiriladi
- 2FA (TOTP) — production da majburiy

***

## 18. Xavfsizlik Talablari (Security Requirements)

**OWASP Top 10 2025 asosida:**[^20][^21][^22]

| # | Tahdid | Yechim |
|---|--------|--------|
| A01 | Broken Access Control | RLS + NestJS Guards + RBAC |
| A02 | Cryptographic Failures | AES-256 DB encryption, TLS 1.3 |
| A03 | Injection | Drizzle parameterized queries, Zod validation |
| A04 | Insecure Design | DDD layer boundaries, threat modeling |
| A05 | Security Misconfiguration | Helmet, CORS whitelist, Caddy |
| A06 | Vulnerable Components | `npm audit`, Dependabot |
| A07 | Auth Failures | JWT rotation, rate limiting |
| A09 | Logging Failures | Structured logging, Sentry |

**Telegram-specific xavfsizlik:**[^23][^24]
- Bot token `.env` da, hech qachon koda kiritilmaydi
- Webhook HTTPS only, Telegram IP whitelisting
- `initData` server side validatsiya (hash tekshiruvi)
- Bot faqat private chat va oila guruhida ishlaydi
- Rate limiting: bir foydalanuvchi 30 so'rov/daqiqa

**Ma'lumotlar himoyasi:**
- Sog'liq ma'lumotlari (medical): `pgcrypto` bilan qo'shimcha shifrlash
- `users.telegramId` — index, lekin public API da expose qilinmaydi
- `families.inviteCode` — TTL 7 kun, bir martalik (yoki konfigurirlash)
- GDPR: `/delete_my_data` buyrug'i majburiy

***

## 19. Audit va Logging

### 19.1 Audit Log Jadvali

```sql
CREATE TABLE audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   uuid,
  user_id     uuid,
  action      text NOT NULL,    -- 'budget.create', 'task.complete', 'member.add'
  entity_type text NOT NULL,
  entity_id   uuid,
  old_value   jsonb,
  new_value   jsonb,
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz DEFAULT now()
);

-- Partitioning by month (katta hajm uchun)
CREATE TABLE audit_logs_2026_05
  PARTITION OF audit_logs
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
```

### 19.2 Logging Strategiyasi

- **Application logs:** Pino (NestJS) → JSON format → stdout
- **Error tracking:** Sentry (unhandled exceptions, bot errors)
- **Access logs:** Caddy → stdout → log aggregator
- **Queue logs:** Bull Board dashboard
- **Log darajalari:** `error | warn | info | debug`
- **Muhim: sog'liq ma'lumotlari va parollar log ga kirmaydi**

***

## 20. Hisobotlar va Analitika

### 20.1 Oila Hisobotlari (In-bot)

| Hisobot | Kanal | Davr | Trigger |
|---------|-------|------|---------|
| Byudjet hisobot | Bot + Mini App | Kunlik/haftalik/oylik | So'rovga binoan |
| Yumushlar statistika | Bot | Haftalik | Avtomatik Dushanba |
| Gamification liderboard | Bot | Haftalik | Avtomatik |
| Sog'liq trend | Mini App grafik | Oylik | So'rovga binoan |
| Tug'ilgan kunlar taqvimi | Bot | Oylik | Avtomatik oy boshi |

### 20.2 Platform Analitika (Admin)

- DAU/MAU ko'rsatgichlari
- Modul qo'llanilish statistikasi
- Oilalar o'sish grafigi
- Xato va nosozlik monitoringi
- Telegram Stars daromad

***

## 21. Bildirishnomalar (Notifications)

### Bildirishnoma Turlari:

| Tur | Trigger | Kanal | Priority |
|-----|---------|-------|----------|
| Eslatma yetkazish | Scheduled (BullMQ) | Bot DM | 🔴 HIGH |
| Vazifa belgilandi | Real-time | Bot DM | 🟡 MEDIUM |
| Tug'ilgan kun | pg_cron 08:00 | Bot DM | 🔴 HIGH |
| Byudjet limiti oshdi | DB trigger | Bot DM | 🟡 MEDIUM |
| Dori muddat (7 kun) | pg_cron | Bot DM | 🟡 MEDIUM |
| Haftalik liderboard | BullMQ Cron | Bot Guruh | 🟡 MEDIUM |
| A'zo oilaga qo'shildi | Event | Admin DM | 🟢 LOW |

### Bildirishnoma Arxitekturasi:
```
Trigger (DB/User) → BullMQ 'notifications' queue
                            ↓
                    Worker (NotificationWorker)
                            ↓
                    Telegraf bot.sendMessage()
                            ↓
                    Delivery log (audit_logs)
```

**Do Not Disturb (DND):**
- Foydalanuvchi soat 22:00–08:00 orasida bildirishnoma olmaslik sozlamasini qo'ya oladi
- Kritik eslatmalar (user yaratgan) DND ni e'tiborsiz qoldiradi

***

## 22. Funksional Bo'lmagan Talablar (Non-Functional Requirements)

| Soha | Talab |
|------|-------|
| **Mavjudlik** | 99.5% uptime (production) |
| **Javob vaqti** | Bot: < 1s, API: < 200ms (p95) |
| **O'lchamlash** | 10,000 oila, 50,000 foydalanuvchi |
| **Ma'lumot hajmi** | 1 TB gacha (5 yil) |
| **Xavfsizlik** | OWASP Top 10 2025 |
| **Lokalizatsiya** | UZ, RU, EN |
| **Brauzerni qo'llab-quvvatlash** | Chrome 90+, Safari 14+, Telegram WebView |
| **Mobil** | iOS 14+, Android 8+ (Telegram orqali) |

***

## 23. Ishlash Talablari (Performance Requirements)

| Metrika | Maqsad | O'lchov usuli |
|---------|--------|---------------|
| Bot javob vaqti | < 1000ms (p99) | Sentry traces |
| API javob vaqti | < 200ms (p95) | Grafana |
| DB query | < 50ms (p95) | pg_stat_statements |
| BullMQ job latency | < 500ms | Bull Board |
| Cache hit rate | > 80% | Redis INFO |
| TMA first load | < 2s (cold) | Lighthouse |
| Concurrent users | 1000 simultaneous | Load test (k6) |

**Optimization Strategiyalari:**
- PostgreSQL connection pool: max 20 (postgres.js)[^11]
- Drizzle: `findMany` instead of `findOne` loop (N+1 yo'q)[^25]
- Redis L1+L2 cache (CacheableMemory + Redis)
- BullMQ: concurrency 10, rate limiting 100/sec[^7]
- Fastify (NestJS adapter) — Express dan 2-3x tez[^26]
- Drizzle: 14x lower latency vs N+1 ORM[^25]

***

## 24. Arxitektura Tavsiyasi

### Arxitektura: Modular Monolith (DDD)

**Nima uchun Microservices emas?**[^15]
- Jamoa kichik (2-3 developer)
- MVP bosqichida over-engineering xatarli
- Modular Monolith keyinchalik microservices ga o'tish imkonini beradi
- Bitta deployable unit — DevOps murakkabligi kamaytiradi

**Nima uchun DDD?**[^27][^16]
- Har modul mustaqil bounded context — parallel rivojlantirish
- Domain logic infra dan ajralgan — test oson
- CQRS — read/write optimallashtirish imkoni

```
┌─────────────────────────────────────────────────────────┐
│                    TURBOREPO MONOREPO                   │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ apps/api │  │apps/web  │  │apps/admin│  │apps/   │ │
│  │ NestJS   │  │ Astro    │  │ React    │  │miniapp │ │
│  │ Fastify  │  │ Tailwind │  │ shadcn   │  │React   │ │
│  └────┬─────┘  └──────────┘  └──────────┘  └────────┘ │
│       │                                                 │
│  ┌────┴────────────────────────────────────────────┐   │
│  │           packages/                              │   │
│  │  ┌──────┐  ┌────────┐  ┌────────┐  ┌────────┐  │   │
│  │  │  db  │  │ shared │  │ config │  │  i18n  │  │   │
│  │  │Drizzle│ │ types  │  │  zod   │  │uz/ru/en│  │   │
│  │  └──────┘  └────────┘  └────────┘  └────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
            │
            ↓
┌───────────────────────────────────┐
│           INFRASTRUCTURE          │
│  PostgreSQL  │  Redis  │  Caddy   │
│  pg_cron     │ BullMQ  │  Docker  │
└───────────────────────────────────┘
```

***

## 25. Texnologiya Steki

| Qatlam | Texnologiya | Versiya | Sabab |
|--------|-------------|---------|-------|
| **Bot Framework** | nestjs-telegraf + Telegraf | ^4.x | NestJS integratsiya[^26] |
| **Backend** | NestJS + Fastify | ^11.x | Ishlash, DI, modular |
| **DB ORM** | Drizzle ORM | latest | Type-safe, 14x faster[^25] |
| **DB** | PostgreSQL | 16 | FTS, RLS, cron, JSONB[^11] |
| **Cache** | Redis + IORedis | ^7 | BullMQ talab qiladi[^6] |
| **Queue** | BullMQ | ^5 | Reliable, delayed jobs[^6] |
| **Mini App** | Vite+React+TS | latest | TMA standard[^28] |
| **TMA SDK** | @telegram-apps/sdk-react | latest | Official SDK |
| **Routing** | TanStack Router | v1 | Type-safe routing |
| **Data Fetching** | TanStack Query | v5 | Cache, sync |
| **State** | Zustand | v4 | Minimal, fast |
| **UI** | Tailwind + shadcn/ui | latest | Fast dev |
| **Public Web** | Astro | v5 | Zero-JS by default |
| **Admin** | Vite+React+shadcn | latest | Unified stack |
| **Validation** | Zod | v3 | End-to-end types |
| **Monorepo** | Turborepo + pnpm | latest | Fast build cache |
| **Container** | Docker + Compose | latest | Dev + prod |
| **Reverse Proxy** | Caddy | v2 | Auto HTTPS, simple |
| **CI/CD** | GitHub Actions | — | Free, powerful |
| **Error Track** | Sentry | latest | Exception monitoring |
| **Monitoring** | Grafana + Prometheus | latest | Metrics |

***

## 26. DevOps va Deployment

### 26.1 Docker Compose (Production)

```yaml
# docker-compose.prod.yml tuzilmasi:
services:
  api:
    image: uyimiz/api:${TAG}
    restart: unless-stopped
    env_file: .env.prod
    depends_on: [postgres, redis]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 30s

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: uyimiz
      POSTGRES_USER: uyimiz
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redisdata:/data

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data

  bull-board:
    image: deadly0/bull-board
    environment:
      REDIS_URL: redis://redis:6379
    # Internal only, Caddy orqali kirish

volumes:
  pgdata:
  redisdata:
  caddy_data:
```

### 26.2 Caddyfile

```
api.uyimiz.app {
  reverse_proxy api:3000
  encode zstd gzip
  header {
    Strict-Transport-Security "max-age=31536000"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
  }
}

uyimiz.app {
  root * /srv/web
  file_server
  encode zstd gzip
}

admin.uyimiz.app {
  basicauth /admin/* {
    # IP whitelist yoki OAuth
  }
  reverse_proxy admin:4000
}
```

### 26.3 GitHub Actions CI/CD

**Pipeline bosqichlari:**
1. `push` → `test` job (Jest, ESLint, TypeCheck)
2. `main` branch → `build` + Docker image push
3. Auto deploy → VPS (SSH + docker-compose pull + up)
4. Health check → Sentry deploy notification

### 26.4 Environment Management

```
.env.development   ← Local dev
.env.test          ← Test database
.env.staging       ← Staging server
.env.production    ← Production (secrets manager)
```

**Secrets:** GitHub Secrets → CI/CD → Server `.env`

***

## 27. Test Strategiyasi

| Tur | Tool | Maqsad | Coverage |
|-----|------|--------|----------|
| **Unit** | Jest + ts-jest | Domain entities, use cases | > 80% |
| **Integration** | Jest + supertest | Repository, API endpoints | > 60% |
| **E2E Bot** | grammY test | Bot conversational flows | Asosiy oqimlar |
| **E2E API** | Playwright API | Critical paths | MVP flows |
| **Load** | k6 | 1000 concurrent users | Har release |
| **Security** | OWASP ZAP | OWASP Top 10 | Har quarter |

**Test Piramidasi:**
- 70% Unit tests (tez, izolyatsiyalangan)
- 20% Integration tests (DB bilan)
- 10% E2E tests (sekin, lekin muhim)

**Test Muhiti:**
- Alohida test DB (PostgreSQL in Docker)
- Test Redis (separate instance)
- Seed data fixtures
- Factory pattern (fake data)

***

## 28. Qabul Mezonlari (Acceptance Criteria)

### MVP Chiqarish uchun:

- [ ] Bot `/start` → oila yaratish → invite → qo'shilish oqimi ishlaydi
- [ ] Byudjet qo'shish, ko'rish, hisobot ishlaydi
- [ ] Yumush yaratish, belgilash, bajarish ishlaydi
- [ ] Eslatma yaratish va scheduler ishlaydi (BullMQ)
- [ ] Tug'ilgan kun eslatmasi (pg_cron) ishlaydi
- [ ] 3 til ishlaydi (UZ/RU/EN)
- [ ] Mini App basic flow ishlaydi
- [ ] HTTPS, webhook ishlaydi (production)
- [ ] Load test: 100 concurrent foydalanuvchi OK
- [ ] Sentry error tracking ulangan
- [ ] DB backup sozlangan

***

## 29. Amalga Oshirish Bosqichlari

### Sprint 1 (2 hafta): Infra Foundation
- Turborepo + pnpm monorepo setup
- packages/config (Zod env)
- packages/db (Drizzle schema + migrations)
- apps/api skeleton (NestJS + Fastify)
- Docker compose (dev)
- GitHub Actions CI
- Bot token + webhook dev mode

### Sprint 2 (2 hafta): Core Bot + Family
- Family module (DDD)
- User onboarding flow (FSM wizard)
- Invite system
- Bot asosiy menyu
- Auth middleware
- RLS setup

### Sprint 3 (2 hafta): Budget Module
- Budget DDD (domain → infra → presentation)
- Bot wizards (add income/expense)
- PostgreSQL aggregate queries
- Redis cache budget report
- Mini App budget page (basic)

### Sprint 4 (2 hafta): Tasks + Gamification
- Tasks module (DDD)
- BullMQ setup
- Gamification (points, leaderboard)
- pg_notify → task_completed
- Mini App tasks page

### Sprint 5 (2 hafta): Reminders + Scheduler
- Reminders module
- BullMQ delayed/scheduled jobs
- Snooze mechanism
- jobId tracking

### Sprint 6 (2 hafta): Birthdays + Mini App Beta
- Birthdays module
- pg_cron integration
- Mini App full feature set
- TMA initData validation
- Beta release (100 oila)

***

## 30. Developer Task Breakdown (Sprint 1 misol)

| Task | Kimga | Soat | Prioritet |
|------|-------|------|-----------|
| Turborepo + pnpm init | Tech Lead | 4h | P0 |
| packages/config (Zod) | Backend | 3h | P0 |
| packages/db schema (barcha jadvallar) | DB Arch | 8h | P0 |
| Drizzle migrations + RLS SQL | DB Arch | 4h | P0 |
| NestJS + Fastify bootstrap | Backend | 4h | P0 |
| DatabaseModule + PgNotify | Backend | 3h | P0 |
| Docker compose dev | DevOps | 3h | P0 |
| GitHub Actions CI | DevOps | 2h | P1 |
| BotFather bot yaratish | Tech Lead | 1h | P0 |
| Webhook dev setup (ngrok) | Backend | 2h | P0 |
| Environment docs | Tech Writer | 2h | P1 |

***

## 31. Xavflar va Kamaytirish (Risks & Mitigation)

| # | Xavf | Ehtimol | Ta'sir | Kamaytirish |
|---|------|---------|--------|-------------|
| R1 | Telegram API o'zgarishi | O'rta | Yuqori | nestjs-telegraf wrapper, changelog monitoring |
| R2 | Redis/BullMQ job yo'qolishi | Past | Yuqori | Job persistence + retry + monitoring[^7] |
| R3 | PostgreSQL RLS xatosi | Past | Kritik | Integration tests, staging test |
| R4 | Telegram Stars siyosati o'zgarishi | O'rta | O'rta | Payment agnostic design[^13] |
| R5 | pg_cron server restart | O'rta | O'rta | Supervisory check + BullMQ backup scheduler |
| R6 | GDPR/ma'lumot himoyasi | O'rta | Yuqori | `/delete_my_data`, data minimization |
| R7 | Team burnout (kichik jamoa) | Yuqori | O'rta | Modular — har developer bir modul |
| R8 | Scope creep (funksiya oshib ketishi) | Yuqori | O'rta | Strict MVP scope, product owner veto |
| R9 | Bot spam/abuse | O'rta | O'rta | Rate limiting, invite-only model |
| R10 | Konkurentlar nusxa olishi | Past | O'rta | Tez iteratsiya, lokalizatsiya ustunligi |

***

## 32. Ochiq Savollar (Open Questions)

| # | Savol | Mas'ul | Muddat |
|---|-------|--------|--------|
| OQ-1 | Valyuta: faqat UZS mi yoki multi-currency? | Product Owner | Sprint 1 |
| OQ-2 | Premium narxi UZS da qancha? | Business | Sprint 5 |
| OQ-3 | Bolalar tarbiyasi moduli uchun shifokor maslahati kerakmi? | Product | Sprint 7 |
| OQ-4 | Dori bazasi: mahalliy (O'zbekiston) mi yoki xalqaro? | Domain Expert | Sprint 10 |
| OQ-5 | `pg_cron` server da superuser huquqi bormi? | DevOps | Sprint 1 |
| OQ-6 | AI maslahatchi: OpenAI (xarajatli) yoki Gemini (bepul tier)? | Tech Lead | Sprint 15 |
| OQ-7 | GDPR muvofiqlik kerakmi? (Global chiqarish uchun) | Legal | Sprint 3 |
| OQ-8 | Mini App PWA sifatida o'rnatish imkoni kerakmi? | Product | Sprint 6 |

***

## 33. Yakuniy Nazorat Ro'yxati (Final Checklist)

### Arxitektura:
- [ ] Turborepo + pnpm monorepo
- [ ] DDD (domain/app/infra/presentation) har modulda
- [ ] CQRS commands/queries ajratilgan
- [ ] Repository interface + implementation
- [ ] EventEmitter2 modul ichki kommunikatsiya

### Ma'lumotlar Bazasi:
- [ ] Drizzle schema barcha modullar uchun
- [ ] RLS barcha family-scoped jadvallarda
- [ ] FTS (tsvector) medications, first_aid, tasks
- [ ] LISTEN/NOTIFY trigerlari
- [ ] pg_cron scheduled jobs
- [ ] Partial indexes
- [ ] Migrations strategy (generate + migrate)

### Backend:
- [ ] NestJS + Fastify adapter
- [ ] nestjs-telegraf integration
- [ ] BullMQ queues (reminders, notifications, birthday, reports)
- [ ] Redis L1+L2 cache
- [ ] Zod env validation
- [ ] Rate limiting (Throttler)
- [ ] Helmet + CORS

### Bot:
- [ ] FSM Wizard scenes
- [ ] i18n (uz/ru/en)
- [ ] Error handling global
- [ ] `/cancel` barcha joyda
- [ ] Webhook mode (production)

### Mini App:
- [ ] initData server-side validation
- [ ] TMA SDK native komponentlar
- [ ] TanStack Query caching
- [ ] Offline state handling

### DevOps:
- [ ] Docker Compose (dev + prod)
- [ ] Caddy HTTPS + headers
- [ ] GitHub Actions CI/CD
- [ ] Health check endpoint
- [ ] DB backup (pg_dump cron)
- [ ] Sentry error tracking
- [ ] Grafana monitoring (V1)

### Xavfsizlik:
- [ ] OWASP Top 10 addressed
- [ ] Bot token `.env` da
- [ ] initData HMAC validation
- [ ] JWT rotation
- [ ] `/delete_my_data` buyrug'i
- [ ] Audit logs

### Sifat:
- [ ] Unit test > 80% coverage (domain)
- [ ] Integration tests asosiy API lar
- [ ] Load test (100 concurrent)
- [ ] `npm audit` CI da

***

*Hujjat @uyimiz_bot v2.0 TZ — Implementation-ready. Senior expert jamoasi tomonidan tayyorlangan.*
*Keyingi qadam: Sprint 1 task breakdown va monorepo setup.*

---

## References

1. [Family Tracking App Market Research Report 2034 - Dataintelo](https://dataintelo.com/report/family-tracking-app-market) - The global family tracking app market is projected to reach $9.7 billion by 2034, expanding from $3....

2. [Parenting Apps Market Analysis and Forecast to 2035](https://www.globalinsightservices.com/reports/parenting-apps-market/) - Parenting Apps Market is anticipated to expand from $552.6 million in 2024 to $1226.4 million by 203...

3. [Cozi vs Family Wall (2026) : Which Family Organizer App ... - YouTube](https://www.youtube.com/watch?v=77hZWUriEss) - ... Is Right For You? 7.7K views · 10 months ago ...more. How To Tech. 19.5K. Subscribe. 18. Share. ...

4. [FamilyWall | Happy Family Organization](https://www.familywall.com/en/index.html) - FamilyWall helps manage your Family's everyday life by sharing everyone's schedules and activities, ...

5. [How to Build Telegram Mini Apps Comprehensive Guide 2025.pdf](https://www.slideshare.net/slideshow/how-to-build-telegram-mini-apps-comprehensive-guide-2025-pdf/274175303) - This document serves as a comprehensive guide on how to build TMAs, highlighting their functionaliti...

6. [What is BullMQ | BullMQ](https://docs.bullmq.io)

7. [BullMQ Redis: The Backbone of High-Performance Job Queues](https://medium.com/@raza78749/bullmq-redis-the-backbone-of-high-performance-job-queues-a3a3090e3807) - BullMQ is a modern and powerful job queueing system for Node.js applications, designed to handle bac...

8. [Семейка ботов](https://t.me/s/FamilyBots?before=1630) - Пишем о соцсетях, маркетинге и диджитале в целом. А также о наших ботах @SaveAsBot, @Text4InstaBot, ...

9. [Integration B2B Family and Telegram Bot - Api Monster](https://apimonster.io/connector/bundle/b2bfamily/telegramBot/) - Integration B2B Family and Telegram Bot. Using the API without a programmer. Connection in 5 minutes...

10. [Plus Messenger - Apps on Google Play](https://play.google.com/store/apps/details?id=org.telegram.plus&hl=en) - Plus Messenger is an unofficial messaging app that uses Telegram's API. One of the best rated messag...

11. [Drizzle ORM PostgreSQL Best Practices Guide (2025) - GitHub Gist](https://gist.github.com/productdevbook/7c9ce3bbeb96b3fabc3c7c2aa2abc717) - Latest Drizzle ORM features and optimal schema patterns. Major 2025 Update: PostgreSQL now recommend...

12. [Telegram Mini Apps (TMA) "Under the Hood": Architecture, Tech ...](https://www.linkedin.com/pulse/telegram-mini-apps-tma-under-hood-architecture-tech-stack-askerov-jw8pe) - Here is a technical breakdown of what it takes to build a robust Telegram game in 2025. ... The Secr...

13. [Telegram Mini App Legal Checklist in 2025 - AURUM Law Firm](https://aurum.law/newsroom/Telegram-Mini-App-Legal-Checklist-in-2025) - This legal checklist breaks down everything you need to know in 2025 — from payment compliance and p...

14. [Telegram Mini App Architect | Claude Code Skill - MCP Market](https://mcpmarket.com/tools/skills/telegram-mini-app-architect-7) - The Telegram Mini App skill transforms Claude into an expert architect for the TWA ecosystem, enabli...

15. [nestjs-modular-monolith | Skills Mar... - LobeHub](https://lobehub.com/skills/tech-leads-club-agent-skills-nestjs-modular-monolith) - Specialist in designing and implementing scalable modular monolith architectures using NestJS with D...

16. [deadislove/nestJS-modular-monolith-cqrs-event-sourcing ... - GitHub](https://github.com/deadislove/nestJS-modular-monolith-cqrs-event-sourcing-architecture-template) - This project demonstrates a modular monolith architecture using Nest, incorporating CQRS and Event S...

17. [Built an E-commerce with NestJS, CQRS & DDD - Modular Monolith ...](https://www.reddit.com/r/nestjs/comments/1lylwjj/built_an_ecommerce_with_nestjs_cqrs_ddd_modular/) - E-commerce platform built with NestJS and DDD. Best practices for using CQRS in NestJS. Implementing...

18. [BullMQ: The Ultimate Guide (From Basics to Advanced) - Medium](https://medium.com/@chaudharyritesh947/bullmq-the-ultimate-guide-from-basics-to-advanced-b3fe621bf821) - BullMQ is a message queue built on top of Redis. It helps process background tasks asynchronously an...

19. [The Ultimate Guide to Drizzle ORM + PostgreSQL (2025 Edition)](https://dev.to/sameer_saleem/the-ultimate-guide-to-drizzle-orm-postgresql-2025-edition-22b) - 1. Project Initialization · 2. Install Drizzle and PostgreSQL Driver · 3. Configure Your Connection ...

20. [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) - The Web Security Testing Guide (WSTG) Project produces the premier cybersecurity testing resource fo...

21. [OWASP Top Ten Web Application Security Risks](https://owasp.org/www-project-top-ten/) - The most current released version is the OWASP Top Ten 2025. Previous versions are available at OWAS...

22. [OWASP Top 10 2025: Addressing Risks with Cycode](https://cycode.com/blog/the-2025-owasp-top-10-addressing-software-supply-chain-and-llm-risks-with-cycode/) - Explore the 2025 OWASP Top 10, including software supply chain failures and LLM threats, and learn h...

23. [secxena/Chat-Bot-Security-Checklist - GitHub](https://github.com/secxena/Chat-Bot-Security-Checklist) - The Chat-Bot Security Checklist is an exhaustive list of all elements you need to have before launch...

24. [LLM Chatbot Security Checklist | PDF - Scribd](https://www.scribd.com/document/928720744/Chatbot-Security-Checklist) - Initial Phase Security Checklist for LLM Chatbot Integration. Reference Standards: LLMSVS OWASP LLM ...

25. [Node.js ORMs in 2025: Choosing Between Prisma, Drizzle ...](https://thedataguy.pro/writing/2025/12/nodejs-orm-comparison-2025/) - Complex joins: Drizzle can generate single, optimized SQL statements with up to 14x lower latency th...

26. [Telegram Bot Store on Python: Step-by-Step Guide with Payment ...](https://dev.to/amverum/telegram-bot-store-on-python-step-by-step-guide-with-payment-catalog-and-admin-panel-aiogram-3-294p) - Friends, hello! Today I come to you with a new practical project in Python. This time we will create...

27. [NestJS-DDD-DevOps - Andrea Acampora](https://andrea-acampora.github.io/nestjs-ddd-devops/) - The purpose of this repository is to create a ready-to-use project following Domain-Driven Design, C...

28. [Step-by-step guide | The Open Network - TON](https://old-docs.ton.org/v3/guidelines/dapps/tma/tutorials/step-by-step-guide) - Telegram Mini Apps (TMA) are web applications that run inside the Telegram app. They are built using...

