export const DOMAIN = "uyimiz.app";

export const family = {
  name: "Karimovlar oilasi",
  place: "Apartment",
  members: [
    { id: "zilola", initials: "ZI", name: "Zilola Karimova", role: "Owner", email: "zilola@example.com", points: 280 },
    { id: "jasur", initials: "JA", name: "Jasur Karimov", role: "Member", email: "jasur@example.com", points: 190 },
    { id: "sarvar", initials: "SA", name: "Sarvar", role: "Child", email: "sarvar@example.com", points: 120 },
    { id: "malika", initials: "MA", name: "Malika", role: "Child", email: "malika@example.com", points: 45 }
  ]
};

export const tasks = [
  { id: 1, title: "Bozorga borish", assignee: "Jasur", time: "Bugun, 18:00", points: 30, status: "new", color: "mint", repeat: "Bir marta" },
  { id: 2, title: "Uyni tozalash", assignee: "Sarvar", time: "Bugun, 20:00", points: 25, status: "new", color: "purple", repeat: "Har hafta" },
  { id: 3, title: "Pack lunch for school", assignee: "Malika", time: "Yesterday, 7:00 PM", points: 15, status: "overdue", color: "red", repeat: "Har kuni" },
  { id: 4, title: "Write in journal", assignee: "Zilola", time: "Today, 7:00 PM", points: 20, status: "today", color: "purple", repeat: "Har kuni" }
];

export const transactions = [
  { title: "Oziq-ovqat", person: "Zilola", time: "Bugun, 12:30", amount: "-285 000", type: "expense", icon: "🛒" },
  { title: "Maosh", person: "Jasur", time: "Bugun, 09:00", amount: "+3 500 000", type: "income", icon: "💼" },
  { title: "Kommunal", person: "Zilola", time: "Kecha, 18:20", amount: "-540 000", type: "expense", icon: "🏠" },
  { title: "Transport", person: "Jasur", time: "Kecha, 08:10", amount: "-120 000", type: "expense", icon: "🚗" }
];

export const reminders = [
  { title: "Shifokorga borish", target: "Zilola uchun", time: "Bugun, 18:00", icon: "🔔" },
  { title: "Bank to'lovi", target: "Hammaga", time: "Ertaga, 09:00", icon: "🏦" }
];

export const birthdays = [
  { name: "Jasur Karimov", relation: "Ota", date: "12-iyun", left: "3 kun", age: "38 yosh" },
  { name: "Sarvar", relation: "Aka", date: "25-iyun", left: "16 kun", age: "15 yosh" },
  { name: "Barno buvi", relation: "Buvi", date: "8-iyul", left: "29 kun", age: "68 yosh" }
];

export const categories = [
  { icon: "🛒", title: "Oziq-ovqat" },
  { icon: "🏠", title: "Kommunal" },
  { icon: "🚗", title: "Transport" },
  { icon: "🎓", title: "Ta'lim" },
  { icon: "💊", title: "Dori" },
  { icon: "➕", title: "Boshqa" }
];
