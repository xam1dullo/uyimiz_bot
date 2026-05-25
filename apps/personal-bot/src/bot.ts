// ─── Personal AI Bot — Khamidullo's Control Panel ───
// Run: cd apps/personal-bot && npm run dev

import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

config({ path: join(import.meta.dirname, '../.env') });

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN || BOT_TOKEN === 'your_token_here') {
  console.error('❌ BOT_TOKEN required in .env');
  process.exit(1);
}

// ─── Memory System ───
const MEMORY_DIR = join(import.meta.dirname, '../memory');
if (!existsSync(MEMORY_DIR)) mkdirSync(MEMORY_DIR, { recursive: true });

interface Memory {
  notes: Record<string, string>;
  context: string[];
  todos: string[];
}

function loadMemory(): Memory {
  const path = join(MEMORY_DIR, 'memory.json');
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, 'utf-8'));
  }
  return { notes: {}, context: [], todos: [] };
}

function saveMemory(mem: Memory): void {
  writeFileSync(join(MEMORY_DIR, 'memory.json'), JSON.stringify(mem, null, 2));
}

// ─── Bot Setup ───
const bot = new Telegraf(BOT_TOKEN);
const mem = loadMemory();

// ─── Streaming helper ───
async function streamReply(ctx: any, steps: Array<{ emoji: string; text: string; fn: () => Promise<string> }>) {
  let msgId: number | undefined;
  let result = '';

  for (const step of steps) {
    await ctx.sendChatAction('typing').catch(() => {});
    
    if (!msgId) {
      const msg = await ctx.reply(`${step.emoji} ${step.text}...`);
      msgId = msg.message_id;
    } else {
      await ctx.telegram.editMessageText(ctx.chat!.id, msgId, undefined, `${step.emoji} ${step.text}...`).catch(() => {});
    }

    result = await step.fn();
    await ctx.telegram.editMessageText(ctx.chat!.id, msgId!, undefined, result).catch(() => {});
  }
  return result;
}

// ─── Commands ───

bot.start(async (ctx) => {
  await ctx.reply(
    '🤖 *Shaxsiy AI Yordamchi*\n\n' +
    'Buyruqlar:\n' +
    '/ask [savol] — AI bilan suhbat\n' +
    '/note [matn] — Eslatma saqlash\n' +
    '/notes — Barcha eslatmalar\n' +
    '/todo [vazifa] — Vazifa qo\'shish\n' +
    '/todos — Vazifalar ro\'yxati\n' +
    '/done [№] — Vazifani bajarish\n' +
    '/think [mavzu] — Chuqur tahlil\n' +
    '/context [matn] — Kontekst qo\'shish\n' +
    '/clear — Xotirani tozalash\n' +
    '/help — Yordam',
    { parse_mode: 'Markdown' },
  );
});

bot.help((ctx) => {
  ctx.reply(
    '📋 *Barcha buyruqlar:*\n\n' +
    '*Asosiy:*\n' +
    '/ask [savol] — AI dan so\'rash\n' +
    '/think [mavzu] — Chuqur tahlil (batafsil)\n\n' +
    '*Xotira:*\n' +
    '/note [matn] — Eslatma\n' +
    '/notes — Ko\'rish\n' +
    '/deln [№] — O\'chirish\n\n' +
    '*Vazifalar:*\n' +
    '/todo [vazifa] — Qo\'shish\n' +
    '/todos — Ro\'yxat\n' +
    '/done [№] — Belgiqlash\n\n' +
    '*Kontekst:*\n' +
    '/context [matn] — Qo\'shish\n' +
    '/clear — Tozalash',
    { parse_mode: 'Markdown' },
  );
});

// ─── AI Chat ───
bot.command('ask', async (ctx) => {
  const question = (ctx.message as any)?.text?.replace(/^\/ask\s*/, '')?.trim();
  if (!question) {
    return ctx.reply('❓ Nima haqida so\'ramoqchisiz?\nMisol: /ask TypeScript da generic types qanday ishlaydi?');
  }

  await streamReply(ctx, [
    {
      emoji: '🧠', text: 'O\'ylayapman...',
      fn: async () => {
        // Build context from memory
        const contextText = mem.context.slice(-5).join('\n');
        const fullPrompt = contextText 
          ? `Kontekst:\n${contextText}\n\nSavol: ${question}`
          : question;

        // AI response (simulated — replace with actual AI API call)
        return `📝 *${question}*\n\n${generateResponse(question, mem)}`;
      },
    },
  ]);
});

// ─── Deep Think ───
bot.command('think', async (ctx) => {
  const topic = (ctx.message as any)?.text?.replace(/^\/think\s*/, '')?.trim();
  if (!topic) return ctx.reply('❓ Qaysi mavzuda chuqur tahlil kerak?');

  await streamReply(ctx, [
    { emoji: '🔍', text: 'Tahlil qilinyapti...', fn: async () => `🔍 *${topic}* — Tahlil:\n\n${deepAnalyze(topic, mem)}` },
    { emoji: '💡', text: 'Xulosa chiqarilmoqda...', fn: async () => `💡 *Xulosa:*\n\n${summarize(topic)}` },
  ]);
});

// ─── Memory Commands ───
bot.command('note', (ctx) => {
  const text = (ctx.message as any)?.text?.replace(/^\/note\s*/, '')?.trim();
  if (!text) return ctx.reply('❓ Nimani eslatma qilish kerak?');
  
  const id = `note_${Date.now()}`;
  mem.notes[id] = text;
  saveMemory(mem);
  ctx.reply(`📝 Eslatma saqlandi [${Object.keys(mem.notes).length}]`);
});

bot.command('notes', (ctx) => {
  const entries = Object.entries(mem.notes);
  if (entries.length === 0) return ctx.reply('📭 Hozircha eslatmalar yo\'q');
  
  const list = entries.map(([id, text], i) => `${i + 1}. ${text} (deln_${i})`).join('\n');
  ctx.reply(`📝 *Eslatmalar (${entries.length}):*\n\n${list}`, { parse_mode: 'Markdown' });
});

bot.command('deln', (ctx) => {
  const num = parseInt((ctx.message as any)?.text?.replace(/^\/deln\s*/, '')?.trim() ?? '');
  if (isNaN(num)) return ctx.reply('❓ Qaysi eslatmani o\'chirish kerak? Raqamini kiriting.');
  
  const keys = Object.keys(mem.notes);
  if (num < 1 || num > keys.length) return ctx.reply('❌ Noto\'g\'ri raqam');
  
  const key = keys[num - 1]!;
  delete mem.notes[key];
  saveMemory(mem);
  ctx.reply('🗑️ Eslatma o\'chirildi');
});

// ─── Todo Commands ───
bot.command('todo', (ctx) => {
  const text = (ctx.message as any)?.text?.replace(/^\/todo\s*/, '')?.trim();
  if (!text) return ctx.reply('❓ Qanday vazifa?');
  mem.todos.push(text);
  saveMemory(mem);
  ctx.reply(`✅ Vazifa qo\'shildi [${mem.todos.length}]`);
});

bot.command('todos', (ctx) => {
  if (mem.todos.length === 0) return ctx.reply('📭 Vazifalar yo\'q');
  const list = mem.todos.map((t, i) => `${i + 1}. ${t} /done_${i + 1}`).join('\n');
  ctx.reply(`📋 *Vazifalar:*\n\n${list}`, { parse_mode: 'Markdown' });
});

bot.command('done', (ctx) => {
  const num = parseInt((ctx.message as any)?.text?.replace(/^\/done\s*/, '')?.trim() ?? '');
  if (isNaN(num) || num < 1 || num > mem.todos.length) {
    return ctx.reply('❓ Qaysi vazifa bajarildi? Raqamini kiriting.');
  }
  const done = mem.todos.splice(num - 1, 1)[0];
  saveMemory(mem);
  ctx.reply(`🎉 Bajarildi: ${done}`);
});

// ─── Context Commands ───
bot.command('context', (ctx) => {
  const text = (ctx.message as any)?.text?.replace(/^\/context\s*/, '')?.trim();
  if (!text) return ctx.reply('❓ Qanday kontekst?');
  mem.context.push(text);
  if (mem.context.length > 20) mem.context.shift();
  saveMemory(mem);
  ctx.reply(`🧠 Kontekst qo\'shildi [${mem.context.length}/20]`);
});

bot.command('clear', (ctx) => {
  mem.context = [];
  saveMemory(mem);
  ctx.reply('🧹 Kontekst tozalandi');
});

// ─── Direct message — AI chat ───
bot.on('text', async (ctx) => {
  const text = (ctx.message as any)?.text;
  if (text?.startsWith('/')) return; // Commands handled above
  
  await streamReply(ctx, [
    { emoji: '💭', text: '...', fn: async () => `📝 ${generateResponse(text, mem)}` },
  ]);
});

// ─── AI Logic (replace with actual API call) ───
function generateResponse(input: string, memory: Memory): string {
  const lower = input.toLowerCase();
  
  if (lower.includes('salom') || lower.includes('hello') || lower.includes('hi')) {
    return 'Salom! Qanday yordam bera olaman? 🚀';
  }
  if (lower.includes('kim') || lower.includes('kimsan')) {
    return 'Men sizning shaxsiy AI yordamchingizman. Telegram orqali boshqariladigan bot. Buyruqlar ro\'yxati: /help';
  }
  if (lower.includes('nima qila')) {
    return 'Men:\n• Savollarga javob beraman (/ask)\n• Eslatmalar saqlayman (/note)\n• Vazifalarni boshqaraman (/todo)\n• Chuqur tahlil qilaman (/think)\n• Kontekstni eslayman (/context)';
  }
  if (lower.includes('vaqt') || lower.includes('soat') || lower.includes('time')) {
    return `Hozir: ${new Date().toLocaleString('uz-UZ')}`;
  }
  if (lower.includes('eslatma') || lower.includes('note')) {
    const count = Object.keys(memory.notes).length;
    return `Jami ${count} ta eslatma bor. /notes — ko'rish, /note [matn] — yangi qo'shish`;
  }
  if (lower.includes('vazifa') || lower.includes('todo')) {
    return `${memory.todos.length} ta vazifa bor. /todos — ko'rish, /todo [vazifa] — qo'shish`;
  }

  // Context-aware response
  if (memory.context.length > 0) {
    return `Kontekst asosida javob:\n\n"Sizning kontekstingizda ${memory.context.length} ta element bor. Bu haqida chuqurroq tahlil uchun /think buyrug\'idan foydalaning."`;
  }

  return `"${input}" — bu haqida o\'ylab ko\'rishim kerak. Aniqroq savol bersangiz yoki /think buyrug\'i bilan chuqur tahlil qilishim mumkin.`;
}

function deepAnalyze(topic: string, memory: Memory): string {
  return [
    `**Mavzu:** ${topic}`,
    ``,
    `**1. Asosiy tushuncha**`,
    `${topic} haqida asosiy ma'lumot...`,
    ``,
    `**2. Kontekst**`,
    memory.context.length > 0 
      ? `Avvalgi kontekst: ${memory.context.slice(-3).join('; ')}`
      : 'Kontekst mavjud emas. /context orqali qo\'shing.',
    ``,
    `**3. Tahlil**`,
    `Ushbu mavzu bo'yicha chuqur tahlil uchun qo'shimcha ma'lumot kerak.`,
    ``,
    `**4. Tavsiya**`,
    `Aniq savollar bilan /ask orqali murojaat qiling.`,
  ].join('\n');
}

function summarize(topic: string): string {
  return `${topic} bo'yicha asosiy xulosalar yuqorida keltirilgan. Qo'shimcha savollar uchun /ask.`;
}

// ─── Launch ───
bot.launch(() => {
  console.log('🤖 Personal AI Bot ishga tushdi!');
  console.log(`📝 Eslatmalar: ${Object.keys(mem.notes).length}`);
  console.log(`📋 Vazifalar: ${mem.todos.length}`);
  console.log(`🧠 Kontekst: ${mem.context.length}/20`);
  console.log('⌨️  /help — barcha buyruqlar');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
