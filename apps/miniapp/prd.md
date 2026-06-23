# @uyimiz Mini App — Design PRD (Product Requirements Document)

> **Versiya:** 1.0 | **Maqsad:** UI/UX Designer uchun | **Sana:** May 2026
> **Muhim:** Bu hujjatda texnik stack YO'Q. Faqat user ko'radigan narsa — oqimlar, ekranlar, rollar, imkoniyatlar va design talablari.

***

## 1. Mahsulot Haqida Qisqa Ma'lumot

**@uyimiz** — oila uchun yagona raqamsal uy. Oila a'zolari birgalikda xarajatlarni kuzatadi, yumushlarni taqsimladi, bir-biriga eslatmalar yuboradi va muhim sanalarni unutmaydi. Hammasi Telegram ichida, alohida ilova yuklab olmasdan.

### Mahsulot printsipi

> **"Oson, tez, birga."**
> Har bir ekran bir maqsad — ortiqcha bosish yo'q.
> Har bir a'zo o'z rolida o'zini qulay his etsin.

***

## 2. Foydalanuvchilar — Kim Ular?

### Rolllar va ularning farqi

| Rol | Nomi | Kim | Nima qila oladi |
|-----|------|-----|-----------------|
| 👑 | **Oila Egasi** (Family Owner) | Oilani yaratgan kishi | Hamma narsa: sozlamalar, a'zolar, barcha modullar |
| 👤 | **A'zo** (Member) | Ota, ona, katta farzand | Ko'pchilik imkoniyatlar, lekin sozlamalar yo'q |
| 👦 | **Bola** (Child) | Kichik farzand | Faqat o'ziga tegishli vazifalar va jadval |
| 👁 | **Mehmon** (Guest) | Qarindosh, bobo-buvi | Faqat ko'rish (kelajak versiya) |

### Persona portretlari

**Zilola — Band ona (34 yosh, Toshkent)**
Uch bolali, ishlaydi. Telefonni ko'p ochib-yopmaydi. Unga kerak: tez kirish, bir qadam bilan xarajat qo'shish, kechqurun 5 daqiqada hafta hisobotini ko'rish.

**Jasur — Mas'ul ota (38 yosh, Samarqand)**
Tadbirkor, telefon orqali oilani kuzatadi. Unga kerak: moliyaviy nazorat, haftalik hisobot, muhim to'lovlar eslatmasi.

**Dildora — Yosh turmush qurgan (26 yosh, Buxoro)**
Yangi oila, hamma narsa birinchi marta. Mini App ning asosiy foydalanuvchisi. Unga kerak: qulay onboarding, vizual grafik, hammasini bitta joyda ko'rish.

**Rustam — Diaspora (31 yosh, Moskva)**
Oilasidan uzoqda. Unga kerak: rus tili, uzoqdan oila holatini ko'rish.

***

## 3. Ruxsatlar Matritsasi — Kim Nima Ko'radi?

### Asosiy modullar bo'yicha

| Ekran / Funksiya | 👑 Oila Egasi | 👤 A'zo | 👦 Bola |
|------------------|:------------:|:-------:|:-------:|
| Dashboard (asosiy) | ✅ To'liq | ✅ To'liq | ✅ Cheklangan |
| Byudjet — ko'rish | ✅ | ✅ | ❌ |
| Byudjet — qo'shish | ✅ | ✅ | ❌ |
| Byudjet — o'chirish | ✅ Hamma | ✅ Faqat o'ziniki | ❌ |
| Byudjet — hisobot | ✅ | ✅ | ❌ |
| Vazifalar — ko'rish | ✅ | ✅ | ✅ Faqat o'ziniki |
| Vazifalar — yaratish | ✅ | ✅ | ❌ |
| Vazifalar — bajarish | ✅ | ✅ | ✅ O'zinikini |
| Eslatmalar | ✅ | ✅ | ❌ |
| Tug'ilgan kunlar | ✅ | ✅ | ❌ Faqat ko'rish |
| A'zolar ro'yxati | ✅ Ko'rish+boshqarish | ✅ Faqat ko'rish | ❌ |
| Oila sozlamalari | ✅ | ❌ | ❌ |
| Shaxsiy sozlamalar | ✅ | ✅ | ✅ |
| Liderboard (ball) | ✅ | ✅ | ✅ |

### Ko'rinadigan holat (visibility)

- **Bola** dashboardda faqat o'ziga belgilangan vazifalarni ko'radi
- **A'zo** oila byudjetini ko'radi, lekin faqat o'zi qo'shgan yozuvlarni o'chira oladi
- **Mehmon** — faqat o'qish rejimi (keyingi versiyada)

***

## 4. Navigatsiya Arxitekturasi

### Bottom Navigation (asosiy menyu — 5 tab)

```
┌────────────────────────────────────┐
│                                    │
│           [Kontent maydoni]        │
│                                    │
├────────────────────────────────────┤
│  🏠      💰      ✅      🔔      👤  │
│ Bosh   Byudjet  Vazifa  Eslatma  Men │
└────────────────────────────────────┘
```

| Tab | Ikonka | Nom (uz/ru/en) | Kimga ko'rinadi |
|-----|--------|----------------|-----------------|
| 1 | 🏠 | Bosh / Главная / Home | Hammaga |
| 2 | 💰 | Byudjet / Бюджет / Budget | Owner, Member |
| 3 | ✅ | Vazifalar / Задачи / Tasks | Hammaga |
| 4 | 🔔 | Eslatmalar / Напоминания / Reminders | Owner, Member |
| 5 | 👤 | Men / Я / Me | Hammaga |

**Bola** uchun navigatsiya:
```
🏠 Bosh   |   ✅ Mening vazifalarim   |   🏆 Reyting   |   👤 Men
```

### Sahifalarning to'liq xaritasi

```
App
├── Onboarding (birinchi kirish)
│   ├── Til tanlash
│   ├── Oila yaratish
│   │   └── Oila nomi → Invite kod yaratildi
│   └── Oilaga qo'shilish
│       └── Invite kod → Kutish holati → Tasdiqlandi
│
├── Dashboard (Bosh sahifa)
│   ├── Salom xabari + oila nomi
│   ├── Balans kartochkasi (bu oy)
│   ├── Aktiv vazifalar (3 ta, qisqa ko'rinish)
│   ├── Yaqin eslatma
│   ├── Kelayotgan tug'ilgan kun
│   └── Tez harakatlar (FAB)
│
├── Byudjet
│   ├── Byudjet ro'yxati sahifasi
│   │   ├── Filtrlash: Daromad / Xarajat / Hammasi
│   │   ├── Davr tanlash: Buoy / O'tgan oy / Haftali
│   │   └── Yozuv kartochkalari (pagination)
│   ├── Hisobot sahifasi
│   │   ├── Donut grafik (kategoriyalar)
│   │   ├── Chiziqli grafik (kunlar bo'yicha)
│   │   └── Kategoriya jadvali
│   └── Qo'shish shakli (bottom sheet)
│       ├── Miqdor (katta raqam klaviaturasi)
│       ├── Tur: Daromad / Xarajat
│       ├── Kategoriya (ikonkali grid)
│       ├── Izoh (ixtiyoriy)
│       └── Sana (bugun standart)
│
├── Vazifalar
│   ├── Vazifalar ro'yxati
│   │   ├── Tab: Yangi / Jarayonda / Bajarilgan
│   │   ├── Filtrlash: Mening / Hammasining
│   │   └── Vazifa kartochkalari
│   └── Vazifa yaratish (bottom sheet)
│       ├── Sarlavha
│       ├── Kategoriya (emoji grid)
│       ├── Kimga belgilash (a'zolar)
│       ├── Muddat (sana tanlash)
│       ├── Takrorlanish
│       └── Ball (avtomatik / manual)
│
├── Eslatmalar
│   ├── Eslatmalar ro'yxati
│   │   ├── Yaqin eslatmalar (yuqorida)
│   │   └── O'tgan eslatmalar
│   └── Eslatma yaratish (bottom sheet)
│       ├── Sarlavha va matn
│       ├── Kimga (o'zim / a'zo / hammasi)
│       ├── Vaqt tanlash
│       └── Takrorlanish
│
├── Men (Profil)
│   ├── Profil sahifasi
│   │   ├── Ism, rol, ball
│   │   └── Statistika (bu oy)
│   ├── Oila
│   │   ├── A'zolar ro'yxati
│   │   ├── Invite link (Owner uchun)
│   │   └── Sozlamalar (Owner uchun)
│   ├── Tug'ilgan kunlar
│   │   ├── Ro'yxat (yaqin sanadan tartib)
│   │   └── Qo'shish
│   ├── Til va bildirishnomalar
│   └── Yordam
│
└── Liderboard (Dashboard dan kirish)
    ├── Haftalik ball reytingi
    └── Oila a'zolari kartochkalari
```

***

## 5. Ekranlar — Batafsil Tavsif

### 5.1 Onboarding

#### Ekran: Til tanlash
**Maqsad:** Foydalanuvchi o'ziga qulay tilni tanlaydi.

**Ko'rinish:**
- Markazda @uyimiz logosi va "Xush kelibsiz / Добро пожаловать / Welcome"
- 3 ta katta tugma: 🇺🇿 O'zbek | 🇷🇺 Русский | 🇬🇧 English
- Pastda kichik matn: "Tilni keyinchalik o'zgartirish mumkin"

**Oqim:**
1. Foydalanuvchi til tanlaydi
2. Tanlangan til aktiv ko'rinadi (border, check mark)
3. "Davom etish" tugmasi paydo bo'ladi
4. Keyingi ekranga o'tish

***

#### Ekran: Oila yaratish yoki qo'shilish
**Maqsad:** Foydalanuvchi oilasi bor-yo'qligini tanilaydi.

**Ko'rinish:**
- Yuqorida: "Oilangiz bormi?"
- 2 ta katta card:
  - 🏡 "Yangi oila yarataman" — yangi oilani boshlamoqchi
  - 🔗 "Oilaga qo'shilaman" — invite kodi bor

***

#### Ekran: Oila nomi kiritish (yaratish oqimi)
**Ko'rinish:**
- Sarlavha: "Oilangiz nomini kiriting"
- Katta matn kiritish maydoni (placeholder: "Karimovlar oilasi")
- Pastda: "Emoji qo'shish" tugmasi (ixtiyoriy)
- "Davom etish" tugmasi (to'ldirilganda aktiv bo'ladi)

**Validatsiya holatlari:**
- Bo'sh: tugma nofaol (kulrang)
- 2 belgidan kam: "Kamida 3 belgi kiriting" qizil matn
- To'g'ri: yashil border, tugma aktiv

***

#### Ekran: Invite kodi kiritish (qo'shilish oqimi)
**Ko'rinish:**
- Sarlavha: "Invite kodni kiriting"
- 6 xonali OTP input (har raqam alohida katak)
- Pastda: "Yoki QR kod skanerlang" tugmasi
- Xato holati: "Kod topilmadi yoki muddati o'tgan" qizil xabar

***

#### Ekran: Kutish holati
**Ko'rinish:**
- Markazda: ⏳ animatsiya yoki yuklash indikatori
- Matn: "Oila egasi tasdig'ini kutmoqda..."
- "Xabar yuborildi" info kartochka
- Pastda: "Kutish..." kulrang tugma (nofaol)

***

### 5.2 Dashboard (Bosh sahifa)

**Maqsad:** Oila hayotining bir qarashda ko'rinishi. Eng ko'p ishlatiladigan ekran.

#### Tarkib bloklari (yuqoridan pastga):

**Blok 1 — Salomlashuv banner:**
```
┌────────────────────────────────┐
│  🌅 Xayrli tong, Zilola!       │
│  Karimovlar oilasi • 4 a'zo    │
└────────────────────────────────┘
```
- Vaqtga qarab: Xayrli tong / Xayrli kun / Xayrli oqshom
- Oila nomi va a'zolar soni

**Blok 2 — Balans kartochkasi:**
```
┌────────────────────────────────┐
│  💰  Bu oy                     │
│  Daromad    Xarajat   Balans   │
│  4,200,000  2,800,000 1,400,000│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [  Hisobot ko'rish  →  ]      │
└────────────────────────────────┘
```
- Raqamlar yirik va aniq
- "Hisobot ko'rish" tugmasi Byudjet / Hisobot sahifasiga olib boradi
- **A'zo roli:** to'liq balans ko'rinadi
- **Bola roli:** bu blok ko'rinmaydi

**Blok 3 — Aktiv vazifalar:**
```
┌────────────────────────────────┐
│  ✅  Vazifalar  (5 ta yangi)    │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  🛒 Bozorga borish    [Bajardim]│
│  🧹 Uyni tozalash     [Bajardim]│
│  + 3 ta yana...     [Hammasi →]│
└────────────────────────────────┘
```
- Eng ko'pi 3 ta ko'rinadi, "Hammasi" tugmasi bilan to'liq sahifaga o'tish
- **Bola roli:** faqat o'ziga belgilangan ko'radi

**Blok 4 — Yaqin eslatma:**
```
┌────────────────────────────────┐
│  🔔  Bugun, 18:00              │
│  "Shifokorga borish"           │
│  👤  Zilola uchun              │
└────────────────────────────────┘
```
- Eng yaqin kelayotgan eslatma
- Yo'q bo'lsa: "Bugun eslatma yo'q 😌"

**Blok 5 — Kelayotgan tug'ilgan kun:**
```
┌────────────────────────────────┐
│  🎂  3 kundan keyin            │
│  Jasurning tug'ilgan kuni!     │
│  37 yoshga to'ladi             │
└────────────────────────────────┘
```
- Yo'q bo'lsa: blok umuman ko'rinmaydi

**Blok 6 — Haftalik liderboard (mini):**
```
┌────────────────────────────────┐
│  🏆  Bu hafta                  │
│  🥇 Zilola    280 ball         │
│  🥈 Jasur     190 ball         │
│  [To'liq reyting →]            │
└────────────────────────────────┘
```

**Tez Harakat Tugmasi (FAB — Floating Action Button):**
- O'ng pastda: "+" yumaloq tugma
- Bosish → 3 variantli menyucha:
  - 💸 Xarajat qo'sh
  - ✅ Vazifa qo'sh
  - 🔔 Eslatma qo'sh

***

### 5.3 Byudjet Moduli

#### Ekran: Byudjet ro'yxati

**Sarlavha paneli:**
```
[← Orqaga]   Byudjet   [⚙️]
```

**Filter panel:**
```
[Hammasi] [💚 Daromad] [🔴 Xarajat]
[Bu oy ▾]
```

**Balans summary (ixcham):**
```
┌──────────────────────────────────┐
│  +4,200,000   -2,800,000   💰 1.4M│
│  Daromad       Xarajat    Balans  │
└──────────────────────────────────┘
```

**Yozuv ro'yxati:**
```
┌──────────────────────────────────┐
│  🛒 Oziq-ovqat    Bugun, 12:30   │
│  Zilola           -285,000 UZS   │
├──────────────────────────────────┤
│  💼 Maosh         Bugun, 09:00   │
│  Jasur          +3,500,000 UZS   │
├──────────────────────────────────┤
│  ...                             │
└──────────────────────────────────┘
```
Har kartochkada: ikonka, kategoriya, ism, sana, miqdor (rang: yashil daromad, qizil xarajat)

**Swipe to delete (A'zo — faqat o'ziniki, Owner — hammasi):**
- Chapga suring → qizil "🗑 O'chirish" ko'rinadi

***

#### Ekran: Byudjet hisoboti

**Davrni tanlash:**
```
[Bu oy] [O'tgan oy] [Haftali] [Custom...]
```

**Donut grafik (katta):**
- Markazda: Umumiy xarajat miqdori
- Atrofida: kategoriya ranglari
- Pastda: rangli legend jadval (kategoriya nomi + foiz + miqdor)

**Kategoriyalar jadvali:**
```
🛒 Oziq-ovqat    850,000    30%   ████████░░
🏠 Kommunal      540,000    19%   █████░░░░░
🚗 Transport     420,000    15%   ████░░░░░░
...
```

**Kunlar bo'yicha chiziqli grafik:**
- X o'qi: kunlar
- Y o'qi: miqdor
- 2 chiziq: Daromad (yashil) + Xarajat (qizil)

***

#### Bottom Sheet: Xarajat/Daromad qo'shish

**Qadamlar ketma-ketligi:**

**Qadam 1 — Tur tanlash:**
```
╔══════════════════════════════════╗
║  Nima qo'shmoqchisiz?            ║
║  ┌─────────────┐ ┌─────────────┐ ║
║  │ 💸 Xarajat  │ │ 💚 Daromad  │ ║
║  └─────────────┘ └─────────────┘ ║
╚══════════════════════════════════╝
```

**Qadam 2 — Miqdor:**
```
╔══════════════════════════════════╗
║  ← Orqaga    2/4                 ║
║                                  ║
║         285,000 UZS              ║
║   (katta, markazda, aniq)        ║
║                                  ║
║  [^1][^2][^3]                       ║
║  [^4][^5][^6]                       ║
║  [^7][^8][^9]                       ║
║  [.][⌫]                       ║
║                                  ║
║  [     Davom etish     ]         ║
╚══════════════════════════════════╝
```
- O'ziga xos raqam klaviaturasi (telefon raqam klaviaturasiga o'xshash)

**Qadam 3 — Kategoriya:**
```
╔══════════════════════════════════╗
║  ← Orqaga    3/4                 ║
║                                  ║
║  Kategoriya tanlang:             ║
║                                  ║
║  🛒        🏠        🚗           ║
║ Oziq-ovqat Kommunal Transport    ║
║                                  ║
║  👔        🎓        🏥           ║
║  Kiyim    Ta'lim    Sog'liq      ║
║                                  ║
║  🎉        💊        ➕           ║
║ Sayohat    Dori     Boshqa       ║
║                                  ║
╚══════════════════════════════════╝
```

**Qadam 4 — Yakunlash:**
```
╔══════════════════════════════════╗
║  ← Orqaga    4/4                 ║
║                                  ║
║  📝  Izoh (ixtiyoriy)            ║
║  [________________________]      ║
║                                  ║
║  📅  Sana                        ║
║  [Bugun ▾]                       ║
║                                  ║
║  [     ✅ Saqlash      ]         ║
╚══════════════════════════════════╝
```

***

### 5.4 Vazifalar Moduli

#### Ekran: Vazifalar ro'yxati

**Tab bar:**
```
[Yangi (5)] [Jarayonda (2)] [Bajarilgan]
```

**Filtrlash:**
```
[Mening] [Oila hammasi]  [↕ Saralash]
```

**Vazifa kartochkasi:**
```
┌───────────────────────────────────┐
│  🧹  Yashash xonani tozalash     │
│  👤 Zilola   📅 Bugun, 20:00     │
│  🔁 Har hafta                    │
│  ⭐ 30 ball                [✅]  │
└───────────────────────────────────┘
```
- Ikonka: kategoriya emojisi
- Ism: kimga belgilangan
- Muddat: rangli (o'tgan — qizil, bugun — sariq, keyingi — kulrang)
- Ball va "Bajarildi" tugmasi

**Bajarish animatsiyasi:**
- "✅ Bajarildi" bosish → konfetti animatsiyasi
- "🏅 +30 ball oldingiz!" toast xabari
- Vazifa Bajarilgan tabga silliq o'tadi (slide animatsiya)

***

#### Bottom Sheet: Vazifa yaratish

```
╔══════════════════════════════════╗
║  Yangi vazifa                [✕] ║
║  ─────────────────────────────── ║
║  📝 Sarlavha                     ║
║  [________________________]      ║
║                                  ║
║  📂 Kategoriya                   ║
║  [🍽][🧹][🛒][👶][🔧][📦][➕]    ║
║                                  ║
║  👤 Kimga                        ║
║  [😊 Men] [Zilola] [Jasur]       ║
║                                  ║
║  📅 Muddat                       ║
║  [Bugun ▾]  ⏰ [Vaqt ▾]          ║
║                                  ║
║  🔁 Takrorlanish                 ║
║  [Bir marta ▾]                   ║
║                                  ║
║  ⭐ Ball: [Avtomatik ▾]          ║
║                                  ║
║  [     ✅ Yaratish     ]         ║
╚══════════════════════════════════╝
```

***

### 5.5 Eslatmalar Moduli

#### Ekran: Eslatmalar ro'yxati

**Seksiyalar:**

**"Yaqinlashayotgan" sektsiyasi:**
```
┌───────────────────────────────────┐
│  🔔 Bugun, 18:00                  │
│  "Shifokorga borish"              │
│  👤 Zilolaga      [⏰ Kechiktir]  │
└───────────────────────────────────┘
┌───────────────────────────────────┐
│  🔔 Ertaga, 09:00                 │
│  "Bank to'lovi"                   │
│  👨‍👩‍👧 Hammaga                        │
└───────────────────────────────────┘
```

**"O'tgan" sektsiyasi (yig'ilib qolishi mumkin):**
- Kulrang ko'rinishda, siqilgan holda
- "Yana 5 ta ko'rish" tugmasi

***

#### Bottom Sheet: Eslatma yaratish

```
╔══════════════════════════════════╗
║  Eslatma qo'shish           [✕] ║
║  ─────────────────────────────── ║
║  🔔 Nima haqida?                 ║
║  [_____________________________] ║
║                                  ║
║  💬 Matn (ixtiyoriy)             ║
║  [_____________________________] ║
║                                  ║
║  👤 Kimga?                       ║
║  [😊 Faqat men]                  ║
║  [👤 Zilola]  [👤 Jasur]         ║
║  [👨‍👩‍👧 Hammaga]                    ║
║                                  ║
║  📅 Qachon?                      ║
║  [Bugun ▾]  🕐 [18:00 ▾]         ║
║                                  ║
║  🔁 Takrorlanish                 ║
║  [Bir marta ▾]                   ║
║                                  ║
║  [     🔔 Eslatma qo'sh    ]     ║
╚══════════════════════════════════╝
```

***

### 5.6 Tug'ilgan Kunlar

#### Ekran: Tug'ilgan kunlar ro'yxati

**Yaqin kelayotganlar (yuqorida, rangli):**
```
┌───────────────────────────────────┐
│  🎂  3 kun qoldi                  │
│  Jasur Karimov                    │
│  12-iyun · 38 yosh bo'ladi        │
└───────────────────────────────────┘
```

**Hammasi ro'yxati (oylar bo'yicha):**
```
IYUN
  🎂 12-iyun    Jasur (ota)        3 kun
  🎂 25-iyun    Sarvar (aka)       16 kun

IYUL
  🎂 8-iyul     Barno (buvi)       29 kun
```

**"+" tugmasi** — yangi qo'shish

***

#### Bottom Sheet: Tug'ilgan kun qo'shish

```
╔══════════════════════════════════╗
║  Tug'ilgan kun qo'shish      [✕]║
║  ─────────────────────────────── ║
║  👤 Ism                          ║
║  [________________________]      ║
║                                  ║
║  👥 Kim?                         ║
║  [Ota] [Ona] [Aka/opa] [Do'st]   ║
║  [Buvi/Bobo] [Boshqa...]         ║
║                                  ║
║  📅 Sana                         ║
║  [Kun ▾] [Oy ▾] [Yil ▾]          ║
║                                  ║
║  🔔 Necha kun oldin eslatsin?    ║
║  [☑️ 7 kun] [☑️ 3 kun] [☑️ 1 kun]║
║                                  ║
║  [     ✅ Saqlash      ]         ║
╚══════════════════════════════════╝
```

***

### 5.7 Profil va Sozlamalar (Men)

#### Ekran: Profil sahifasi

```
┌────────────────────────────────────┐
│  [← Orqaga]      Men       [✏️]    │
│  ─────────────────────────────────  │
│      [Avatar: Telegram foto]        │
│      Zilola Karimova                │
│      👑 Oila Egasi • Karimovlar     │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ 280  │ │  47  │ │  12  │        │
│  │ Ball │ │Vazifa│ │Eslatma│       │
│  └──────┘ └──────┘ └──────┘        │
│                                     │
│  ────────────────────────────────── │
│  👨‍👩‍👧 Oila         Karimovlar (4 kishi) →│
│  🎂 Tug'ilgan kunlar              → │
│  🔔 Bildirishnomalar              → │
│  🌐 Til                  O'zbek   → │
│  ❓ Yordam                        → │
│  📤 Chiqish                          │
└────────────────────────────────────┘
```

***

#### Ekran: Oila a'zolari (Owner ko'rinishi)

```
┌────────────────────────────────────┐
│  [←]    Oila a'zolari     [+A'zo] │
│  ─────────────────────────────────  │
│  👑 Zilola Karimova                 │
│     Oila Egasi • Online             │
│                                 [•••]│
│  ─────────────────────────────────  │
│  👤 Jasur Karimov                   │
│     A'zo • 2 soat oldin             │
│                                 [•••]│
│  ─────────────────────────────────  │
│  👦 Sarvar (14 yosh)                │
│     Bola • Kecha                    │
│                                 [•••]│
│  ─────────────────────────────────  │
│  👦 Malika (9 yosh)                 │
│     Bola • 3 kun oldin              │
│                                 [•••]│
│                                      │
│  ─────────────────────────────────  │
│  🔗 Invite link ulashing            │
│     uyimiz.app/join/ABC123          │
│     [Nusxalash] [Ulashish]          │
└────────────────────────────────────┘
```

**"..." tugmasi** → Rol o'zgartirish / Oiladan chiqarish (Owner uchun)

***

### 5.8 Liderboard (Reyting)

#### Ekran: Haftalik liderboard

```
┌────────────────────────────────────┐
│  [←]    Bu hafta reyting            │
│  ─────────────────────────────────  │
│                                     │
│          🥇 Zilola                  │
│        280 ball  ★★★★★             │
│                                     │
│  🥈 Jasur      190 ball  ★★★★░     │
│  🥉 Sarvar     120 ball  ★★★░░     │
│  4. Malika      45 ball  ★★░░░     │
│                                     │
│  ─────────────────────────────────  │
│  📊 Sizning statistikangiz:         │
│  Bu hafta: 280 ball                 │
│  Umumiy: 1,240 ball                 │
│  🏅 Oila Qahramoni (4 haftali)      │
└────────────────────────────────────┘
```

***

## 6. Foydalanuvchi Oqimlari — To'liq Tavsif

### 6.1 Yangi foydalanuvchi onboarding oqimi

```
App ochiladi
    │
    ▼
[Til tanlash ekrani]
    │ Til tanlanadi
    ▼
[Oila yaratish | Qo'shilish ekrani]
    │                    │
    ▼                    ▼
[Oila nomi]     [Invite kod kiritish]
    │                    │
    ▼                    ▼
[Muvaffaqiyat]  [Kutish holati]
    │                    │ Admin tasdiqlaydi
    ▼                    ▼
[Dashboard]         [Dashboard]
```

**Oqim qoidalari:**
- Til tanlanmasa "Davom etish" nofaol
- Oila nomi 3 belgidan kam bo'lsa "Davom etish" nofaol
- Invite kodi noto'g'ri bo'lsa qizil xato xabari, clearable
- Kutish vaqti: 24 soatgacha, shundan keyin rad etiladi

***

### 6.2 Xarajat qo'shish oqimi

```
Dashboard yoki Byudjet sahifasi
    │
    ▼
"+" FAB yoki "Xarajat qo'sh" tugmasi bosiladi
    │
    ▼
Bottom sheet ochiladi (silliq animatsiya yuqoriga)
    │
    ▼
[Qadam 1: Tur → Xarajat]
    │
    ▼
[Qadam 2: Miqdor] → klaviatura bilan kiritiladi
    │ "Davom etish"
    ▼
[Qadam 3: Kategoriya] → grid dan tanlanadi
    │ "Davom etish"
    ▼
[Qadam 4: Izoh + Sana] → ixtiyoriy
    │ "Saqlash"
    ▼
✅ Toast xabari: "285,000 UZS — Oziq-ovqat qo'shildi"
    │
    ▼
Bottom sheet yopiladi, ro'yxat yangilanadi
```

**Alternativ oqimlar:**
- Istalgan qadamda "✕" — sheet yopiladi, saqlashsiz
- Noto'g'ri miqdor (0 yoki bo'sh) — "Davom etish" nofaol, validatsiya xabari

***

### 6.3 Vazifa bajarish oqimi

```
Vazifalar ro'yxati
    │
    ▼
[✅ Bajarildi] tugmasi bosiladi
    │
    ▼
Haptic feedback (vibro)
    │
    ▼
Konfetti animatsiyasi → "🏅 +30 ball oldingiz!" toast
    │
    ▼
Vazifa "Bajarilgan" tabga ko'chadi (silliq animatsiya)
    │
    ▼
Dashboard da ball yangilanadi
    │
    ▼
(Agar haftaning rekordi bo'lsa): "🏆 Bu haftaning yaxshisi!" banner
```

***

### 6.4 Eslatma kechiktirish oqimi (Snooze)

```
Bot eslatma yuboradi (Telegram xabar)
    │ "Mini App da ko'rish" tugmasi
    ▼
Eslatmalar ro'yxatida aktiv eslatma
    │ "⏰ Kechiktir" bosiladi
    ▼
Bottom sheet: "Qancha vaqtga?"
    [10 daqiqa] [30 daqiqa] [1 soat] [3 soat]
    │ Tanlash
    ▼
Eslatma yangilangan vaqtda qaytadi
Toast: "⏰ 30 daqiqadan keyin eslatamiz"
```

***

### 6.5 Oilaga a'zo qo'shish oqimi (Owner)

```
Profil → Oila a'zolari
    │ "+A'zo" bosiladi
    ▼
Bottom sheet:
    "Invite linkni ulashing"
    [uyimiz.app/join/ABC123]
    [📋 Nusxalash] [📤 Ulashish]
    │
    ▼
Link yuboriladi (WhatsApp, Telegram, SMS)
    │
    ▼
Qabul qilgan kishi botni ochadi → "/join ABC123"
    │
    ▼
Owner ga bildirishnoma: "👤 Jasur Karimov qo'shilishni so'ramoqda"
    [✅ Qabul] [❌ Rad]
    │ "Qabul"
    ▼
Ikkalasiga bildirishnoma:
    - Ownerga: "✅ Jasur Karimov qo'shildi"
    - Jasurga: "✅ Karimovlar oilasiga xush kelibsiz!"
```

***

## 7. Holat Ko'rinishlari (States)

Har bir ekran quyidagi holatlarga ega bo'lishi kerak:

### 7.1 Yuklanish (Loading)
- Skeleton screen — actual kontentning shakliga mos
- Spinner emas — skeleton (modern UX standart)
- Ma'lumot kelguncha skeleton ko'rinadi

**Misol: Byudjet ro'yxati skeleton:**
```
┌──────────────────────────────┐
│  ████████████████  ██████    │  ← kulrang to'g'ri to'rtburchak
│  ██████████████    ████████  │
├──────────────────────────────┤
│  ████████████████  ██████    │
│  ██████████████    ████████  │
└──────────────────────────────┘
```

### 7.2 Bo'sh holat (Empty state)

Har modul uchun alohida bo'sh holat:

| Modul | Ikonka | Matn | Tugma |
|-------|--------|------|-------|
| Byudjet | 💰 | "Hali hech narsa qo'shilmagan" | "Birinchi yozuv qo'shing" |
| Vazifalar | ✅ | "Hamma vazifalar bajarildi! 🎉" | "Yangi qo'shing" |
| Eslatmalar | 🔔 | "Eslatma yo'q. Dam oling!" | "Eslatma qo'shing" |
| Tug'ilgan kunlar | 🎂 | "Hech kim qo'shilmagan" | "Qo'shing" |

### 7.3 Xato holati (Error state)

| Tur | Ko'rinish |
|-----|-----------|
| Internet yo'q | 📵 "Internet ulanmagan. Qayta urinib ko'ring." + Retry tugmasi |
| Server xato | ⚠️ "Vaqtinchalik muammo. Biroz kuting." + Retry tugmasi |
| Kirish taqiqlangan | 🔒 "Sizda bu imkoniyat yo'q" |
| Topilmadi | 🔍 "Natija topilmadi" |

### 7.4 Muvaffaqiyat holati (Success state)

- **Toast xabari** — ekranning pastidan chiqadi, 3 soniyada yo'qoladi
- Rang: yashil background, oq matn
- Ikonka: ✅

***

## 8. Komponentlar Kutubxonasi

### 8.1 Tugmalar

| Tur | Ko'rinish | Qachon |
|-----|-----------|--------|
| **Primary** | To'q rang, oq matn, katta | Asosiy harakat: Saqlash, Davom etish |
| **Secondary** | Borderly, asosiy rang matn | Ikkilamchi harakat: Bekor qilish |
| **Destructive** | Qizil | O'chirish, Chiqish |
| **Ghost** | Fon yo'q, matn rangida | Navigatsiya harakatlari |
| **FAB** | Yumaloq, ko'tarilgan shadow | Ekranning o'ng pastida, asosiy "+" |

**Holatlari:**
- Normal → Hover → Pressed (haptic feedback) → Disabled (kulrang, 40% opacity)

### 8.2 Input maydonlari

| Tur | Qachon |
|-----|--------|
| **Matn input** | Ism, izoh, sarlavha |
| **Raqam input** | Miqdor (maxsus klaviatura) |
| **OTP input** | 6 raqamli kod (invite) |
| **Date picker** | Sana tanlash (native Telegram wheel) |
| **Time picker** | Vaqt tanlash |
| **Dropdown** | Takrorlanish, davrni tanlash |

**Validatsiya holatlari:**
- Normal: kulrang border
- Focus: asosiy rang border
- Error: qizil border + qizil xato matni pastda
- Success: yashil border (ixtiyoriy)

### 8.3 Kartochkalar

| Tur | Nima uchun |
|-----|-----------|
| **List card** | Ro'yxat elementi (byudjet, vazifa) |
| **Summary card** | Balans, statistika |
| **Event card** | Tug'ilgan kun, eslatma |
| **Person card** | A'zo profilida |
| **Achievement card** | Liderboardda |

### 8.4 Bottom Sheet

- Pastdan chiqadigan modal
- Drag handle (kulrang chiziq yuqorida) — suring yoki "✕" orqali yopiladi
- Fon qorayadi (overlay)
- Keyboard ochilganda avtomatik yuqoriga ko'tariladi

***

## 9. Design Tamoyillari

### 9.1 Telegram Design Tizimi

Mini App Telegram muhitida ishlaydi — shuning uchun:

- **Barcha ranglar** Telegram temidan olinadi (`bg_color`, `text_color`, `button_color`, `hint_color`, `link_color`, `secondary_bg_color`)
- **Qattiq kodlangan rang YO'Q** — har doim Telegram tema o'zgaruvchilari
- Dark va Light mode avtomatik — Telegram tema almashganda app ham almashadi
- **Telegram native komponentlar** ishlatiladi:
  - `MainButton` — ekranning pastida asosiy tugma
  - `BackButton` — sarlavha chiziq chap tomoni "←"
  - `HapticFeedback` — muhim harakatlarda titroq (vibro)
  - `ClosingConfirmation` — form to'ldirib yopmoqchi bo'lganda ogohlantirish

### 9.2 UX Printsipler

**Tezlik:**
- Har ekranda maksimal 1 ta asosiy harakat
- Ko'p bosqichli formalar: progress indikatori ("2/4" yoki progress bar)
- Ortiqcha tasdiqlash modal yo'q — undo imkoni

**Oddiylik:**
- Eng ko'p ishlatiladigan amal birinchi o'rinda
- Ikonkalar matn bilan birga (faqat ikonka emas)
- Professional emas, insoniy ton

**Mobillik:**
- Barmoq uchun 44px × 44px minimal touch zone
- Asosiy harakatlar pastda (bosh barmoq qo'lga mos)
- Scroll — vertikal, horizontal scroll faqat tab lar uchun

**Xatolarni oldini olish:**
- Majburiy maydonlar to'ldirilmasa tugma nofaol
- O'chirish → oldin tasdiqlash ("Rostdan o'chirishni xohlaysizmi?")
- Forma yopilayotganda ("Ma'lumotlar saqlanmaydi, davom etasizmi?")

### 9.3 Animatsiya va Mikro-interaksiya

| Holat | Animatsiya |
|-------|-----------|
| Ekranga kirish/chiqish | Silliq slide (350ms, ease-out) |
| Bottom sheet ochilish | Yuqoriga siljish + overlay fade (300ms) |
| Vazifa bajarish | Konfetti burst + ball animatsiyasi |
| Toast xabari | Pastdan chiqadi, 3s keyin yo'qoladi |
| Skeleton | Shimmer (yaltiroq o'tish) effekti |
| FAB bosish | Scale down + up (haptic) |
| Swipe delete | Chapga siring → qizil background paydo bo'ladi |

***

## 10. Ekran O'lchamlari va Grid

### Asosiy kadr

- Viewport: 375px kenglik (iPhone SE bazaviy)
- Padding: 16px horizontal
- Content max-width: 343px (375 - 16×2)
- Bottom navigation height: 56px + safe area
- Top status bar: Telegram o'zi boshqaradi

### Tipografiya

| Element | O'lcham | Og'irlik | Qo'llanish |
|---------|---------|----------|-----------|
| H1 (sarlavha) | 24px | Bold (700) | Ekran sarlavhalari |
| H2 (bo'lim) | 18px | SemiBold (600) | Sektsiya sarlavhalari |
| Body (asosiy) | 16px | Regular (400) | Asosiy matn |
| Body Small | 14px | Regular (400) | Ikkilamchi matn, sana |
| Caption | 12px | Regular (400) | Label, hint |
| Amount (katta) | 32px | Bold (700) | Byudjet miqdori |

### Spacing (bo'sh joy) tizimi

- 4px bazaviy grid
- Komponentlar orasida: 8px, 12px, 16px, 24px
- Kartochka ichida padding: 16px

***

## 11. Ko'p Tillilik Ko'rinishi

### Til o'zgartirish

Profil → "Til" → bottom sheet:
```
╔══════════════════════════════════╗
║  Tilni tanlang              [✕] ║
║  ─────────────────────────────── ║
║  [✓] 🇺🇿 O'zbek                  ║
║  [ ] 🇷🇺 Русский                 ║
║  [ ] 🇬🇧 English                 ║
╚══════════════════════════════════╝
```

### Matn uzunligi bo'yicha moslashish

- O'zbek matnlar ruscha va inglizchadan 15-20% uzunroq bo'lishi mumkin
- Tugma matnlari truncate bo'lmasin (truncate = qisqartirish belgisi "...")
- Barcha tugma o'lchamlari eng uzun tilga (odatda O'zbek) moslab kengaysin

### Raqam va sana formatlari

| | O'zbek | Rus | Ingliz |
|--|--------|-----|--------|
| Sana | 12-iyun-2026 | 12 июня 2026 | June 12, 2026 |
| Pul | 285 000 UZS | 285 000 UZS | 285,000 UZS |
| Vaqt | 18:00 | 18:00 | 6:00 PM |

***

## 12. Rol bo'yicha Ekran Farqlari

### Bola (Child) uchun maxsus ko'rinish

**Dashboard:**
- Byudjet bloki: ko'rinmaydi
- Vazifalar bloki: faqat o'ziga belgilanganlar
- Eslatma bloki: ko'rinmaydi
- Liderboard: ko'rinadi ✅

**Navigatsiya:**
```
🏠 Bosh  |  ✅ Mening vazifalarim  |  🏆 Reyting  |  👤 Men
```

**Vazifa kartochkasi (Bola ko'rinishi):**
- Faqat "Bajarildi" tugmasi — yaratish/o'chirish yo'q
- Ball ko'rinadi — motivatsiya uchun

### Member uchun cheklovlar

- Byudjet o'chirish: faqat o'zi qo'shgan yozuv
- Oila sozlamalari: ko'rinmaydi
- A'zo ro'yxati: ko'radi, lekin boshqara olmaydi ("..." menyu yo'q)

***

## 13. Onboarding Keyingi Bosqichlari (Feature Discovery)

### Birinchi kirish bo'shliq holatlar

Birinchi marta kirgan foydalanuvchi uchun modullar bo'sh bo'ladi. Har modul uchun maxsus "birinchi marta" ko'rinishi:

**Byudjet — bo'sh holat:**
```
┌──────────────────────────────────┐
│                                  │
│           💰                     │
│                                  │
│    Hali hech narsa yo'q          │
│                                  │
│  Oilangizning birinchi           │
│  xarajatini qo'shing             │
│                                  │
│  [  ➕ Birinchi xarajat qo'sh  ] │
└──────────────────────────────────┘
```

### Tooltip va yo'naltiruvchi izohlar (onboarding hints)

- Birinchi kirish: FAB tugmasida tooltip "Bu yerdan tez qo'shish mumkin"
- Yangi funksiya kashf etilganda: spotlight highlight (yaxshi ko'rinadigan qilib ajratib ko'rsatish)
- Har tooltip bir marta ko'rinadi, keyin saqlanadi

***

## 14. Xavfsizlik Ko'rinishlari (Dizayn Nuqtai Nazari)

### Sezgir ma'lumotlar

- Byudjet miqdorlari: barmoq izini tekshirish orqali "Ko'rish" imkoni (kelajak versiya)
- Oila a'zolari ro'yxati: ochiq emas, faqat oila ichida

### Invite link ko'rinishi

- Ekranda to'liq link ko'rinadi: `uyimiz.app/join/ABC123`
- "Nusxalash" tugmasi — clipboard ga nusxalash
- "Ulashish" tugmasi — Telegram native share sheet ni ochadi
- Link muddati ko'rinadi: "7 kun amal qiladi"

### Kirish taqiqlanganida

- Foydalanuvchi taqiqlangan sahifaga o'tmoqchi bo'lsa: navigatsiya bloklanadi
- Xabar: "🔒 Bu imkoniyat sizga mavjud emas"
- Back tugmasi ko'rinadi

***

## 15. Dizaynchi uchun Deliverables Ro'yxati

Ushbu PRD asosida dizaynchi quyidagi materiallarni tayyorlashi kerak:

### Figma fayl tuzilmasi

```
📁 @uyimiz — Mini App Design
├── 📄 Design System
│   ├── Colors (Telegram tema o'zgaruvchilari)
│   ├── Typography
│   ├── Spacing
│   ├── Icons
│   └── Components (Buttons, Inputs, Cards, Sheets)
│
├── 📄 Flows
│   ├── Onboarding
│   ├── Budget flow
│   ├── Tasks flow
│   ├── Reminders flow
│   └── Birthday flow
│
├── 📄 Screens — Light Mode
│   ├── Onboarding (5 ekran)
│   ├── Dashboard
│   ├── Budget (3 ekran + 1 sheet)
│   ├── Tasks (2 ekran + 1 sheet)
│   ├── Reminders (1 ekran + 1 sheet)
│   ├── Birthdays (1 ekran + 1 sheet)
│   └── Profile + Settings (4 ekran)
│
├── 📄 Screens — Dark Mode
│   └── (yuqoridagi barcha ekranlar dark tema)
│
├── 📄 States
│   ├── Loading (skeleton)
│   ├── Empty states
│   └── Error states
│
└── 📄 Roles
    ├── Owner ko'rinishi
    ├── Member ko'rinishi
    └── Child ko'rinishi
```

### Prototip xaritasi

Figma prototipda quyidagi oqimlar interaktiv bo'lishi kerak:

1. Onboarding → Dashboard (yangi foydalanuvchi)
2. Dashboard → Byudjet qo'shish (FAB orqali)
3. Dashboard → Vazifa bajarish
4. Profil → A'zo qo'shish (Owner)
5. Eslatmalar → Snooze

***

*Hujjat faqat design maqsadlari uchun. Texnik stack va amalga oshirish tafsilotlari uchun TZ v2.0 hujjatiga murojaat qiling.*

---

## References

1. [paste.txt](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/196924/0f690a1b-4c06-4741-8d8e-03557e6937c1/paste.txt) - # @uyimiz_bot — To'liq Texnik Topshiriq (TZ) v2.0

> **Versiya:** 2.0 | **Holat:** Implementation-...

2. [Семейка ботов](https://t.me/s/FamilyBots?before=1630) - Пишем о соцсетях, маркетинге и диджитале в целом. А также о наших ботах @SaveAsBot, @Text4InstaBot, ...

3. [Telegram Biznes](https://telegram.org/blog/telegram-business/uz) - Bugundan boshlab istalgan kishi Telegram hisobini biznes hisobiga aylantirishi va ish vaqti, joylash...

4. [Integration B2B Family and Telegram Bot - Api Monster](https://apimonster.io/connector/bundle/b2bfamily/telegramBot/) - Integration B2B Family and Telegram Bot. Using the API without a programmer. Connection in 5 minutes...

5. [Introducing Telegram Business](https://telegram.org/blog/telegram-business) - Anyone can turn their Telegram account into a business account – and get access to business features...

6. [MyGov: Davlat xizmatlari - App Store - Apple](https://apps.apple.com/uz/app/mygov-davlat-xizmatlari/id1544175166) - Oila, ta'lim, ijtimoiy himoya, sport va transport kabi 20 dan ortiq ... Telegram bot: @myGovUzSuppor...

7. [Telegram Bot Creation Handbook - DEV Community](https://dev.to/simplr_sh/telegram-bot-creation-handbook-g5g) - This handbook outlines the process of creating Telegram bots using BotFather. It emphasizes accuracy...

8. [Plus Messenger - Apps on Google Play](https://play.google.com/store/apps/details?id=org.telegram.plus&hl=en) - Plus Messenger is an unofficial messaging app that uses Telegram's API. One of the best rated messag...

9. ["Yosh kitobxon oila" tanlovi boshlanmoqda](https://nurobod.uz/news/yosh-kitobxon-oila-tanlovi-boshlanmoqda/) - Nihoyat, uzoq kutilgan “Yosh kitobxon oila” tanlovi start olish arafasida! Tanlovning tuman (shahar)...

