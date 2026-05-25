// ─── Personal AI Bot — Khamidullo's Project Control Panel ───

import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as pm from './services/project-manager.js';

config({ path: join(import.meta.dirname, '../.env') });

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) { console.error('❌ BOT_TOKEN required'); process.exit(1); }

const MEMORY_DIR = join(import.meta.dirname, '../memory');
if (!existsSync(MEMORY_DIR)) mkdirSync(MEMORY_DIR, { recursive: true });

interface Memory { notes: Record<string, string>; context: string[]; todos: string[]; }
function loadMemory(): Memory {
  const p = join(MEMORY_DIR, 'memory.json');
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf-8')) : { notes: {}, context: [], todos: [] };
}
function saveMemory(mem: Memory): void { writeFileSync(join(MEMORY_DIR, 'memory.json'), JSON.stringify(mem, null, 2)); }

const bot = new Telegraf(BOT_TOKEN);
const mem = loadMemory();

// Helper: stream reply
async function stream(ctx: any, text: string): Promise<any> {
  await ctx.sendChatAction('typing').catch(() => {});
  // Split long messages
  if (text.length > 4000) {
    const parts = text.match(/[\s\S]{1,3800}/g) ?? [text];
    for (const part of parts) {
      await ctx.reply(part);
    }
    return;
  }
  return ctx.reply(text);
}

async function streamMulti(ctx: any, texts: string[]): Promise<void> {
  for (const text of texts) {
    await ctx.sendChatAction('typing').catch(() => {});
    if (text.length > 4000) {
      const parts = text.match(/[\s\S]{1,3800}/g) ?? [text];
      for (const part of parts) await ctx.reply(part);
    } else {
      await ctx.reply(text);
    }
  }
}

// ═══ START ═══
bot.start(async (ctx) => {
  await ctx.reply(
    '🤖 LOYIHA BOSHQARUV BOTI\n\n' +
    '📊 /status — Loyiha holati\n' +
    '✅ /tasks — Ochiq tasklar\n' +
    '🔨 /build — Build qilish\n' +
    '🧪 /test — Testlar\n' +
    '🔍 /gate — Quality Gate\n' +
    '📝 /changes — Oxirgi ozgarishlar\n' +
    '🔄 /pull — Git pull\n' +
    '📤 /push — Git push\n' +
    '⚡ /pm2 — Jarayonlar\n' +
    '🔄 /restart — Restart all\n' +
    '📊 /report — Tolik hisobot\n' +
    '\n📋 /help — Barcha buyruqlar',
  );
});

// ═══ PROJECT STATUS ═══
bot.command('status', async (ctx) => {
  await ctx.sendChatAction('typing').catch(() => {});
  const status = pm.getFullStatus();
  await stream(ctx, status);
});

bot.command('tasks', async (ctx) => {
  const tasks = pm.listTasks();
  await stream(ctx, tasks);
});

bot.command('changes', async (ctx) => {
  const changes = pm.getRecentChanges();
  await stream(ctx, changes);
});

// ═══ QUALITY ═══
bot.command('gate', async (ctx) => {
  await ctx.sendChatAction('typing').catch(() => {});
  const result = pm.runQualityGate();
  await stream(ctx, result);
});

bot.command('build', async (ctx) => {
  // Request confirmation before build
  const confirmMsg = pm.requestConfirmation(
    'Build',
    'Loyihani build qilish (pnpm build)',
    'pnpm build 2>&1',
  );
  await stream(ctx, confirmMsg);
});

bot.command('test', async (ctx) => {
  await ctx.sendChatAction('typing').catch(() => {});
  const result = pm.runTests();
  await stream(ctx, result);
});

// ═══ GIT ═══
bot.command('pull', async (ctx) => {
  const confirmMsg = pm.requestConfirmation(
    'Git Pull',
    'Oxirgi o\'zgarishlarni olish (git pull --rebase)',
    'git pull --rebase 2>&1',
  );
  await stream(ctx, confirmMsg);
});

bot.command('push', async (ctx) => {
  const confirmMsg = pm.requestConfirmation(
    'Git Push',
    'O\'zgarishlarni remote\'ga yuborish (git push)',
    'git push 2>&1',
  );
  await stream(ctx, confirmMsg);
});

// ═══ PM2 ═══
bot.command('pm2', async (ctx) => {
  const status = pm.pm2Status();
  await stream(ctx, status);
});

bot.command('restart', async (ctx) => {
  const confirmMsg = pm.requestConfirmation(
    'Restart All',
    'Barcha service\'larni qayta ishga tushirish (pm2 restart all)',
    'pm2 restart all 2>&1',
  );
  await stream(ctx, confirmMsg);
});

// ═══ TASK MANAGEMENT ═══
bot.command('close_task', async (ctx) => {
  const taskId = (ctx.message as any)?.text?.replace(/^\/close_task\s*/, '')?.trim();
  if (!taskId) return ctx.reply('❓ Qaysi task? /close_task uyimiz_bot-xxx');
  
  const confirmMsg = pm.requestConfirmation(
    'Task yopish',
    `${taskId} task\'ini yopish`,
    `cd /Users/admin/Developer/Projects/bot/uyimiz_bot && bd close ${taskId} 2>&1`,
  );
  await stream(ctx, confirmMsg);
});

// ═══ CONFIRM/REJECT ═══
bot.command('confirm', async (ctx) => {
  const id = (ctx.message as any)?.text?.replace(/^\/confirm_?\s*/, '')?.trim();
  if (!id) return;
  const result = pm.confirmAction(id);
  if (result.confirmed) {
    await stream(ctx, result.result);
  } else {
    await ctx.reply(result.result);
  }
});

bot.command('reject', async (ctx) => {
  const id = (ctx.message as any)?.text?.replace(/^\/reject_?\s*/, '')?.trim();
  if (!id) return;
  const result = pm.rejectAction(id);
  await ctx.reply(result);
});

// ═══ REPORT ═══
bot.command('report', async (ctx) => {
  await ctx.sendChatAction('typing').catch(() => {});
  const report = pm.generateReport();
  await stream(ctx, report);
});

// ═══ AI CHAT ═══
bot.command('ask', async (ctx) => {
  const q = (ctx.message as any)?.text?.replace(/^\/ask\s*/, '')?.trim();
  if (!q) return ctx.reply('❓ Nima haqida? /ask [savol]');
  const ctxText = mem.context.slice(-5).join('\n');
  await stream(ctx, `📝 *${q}*\n\n${ctxText ? `Kontekst: ${ctxText}\n\n` : ''}Javob: Bu haqida o\'ylab ko\'rish kerak. Aniqroq savol bering.`);
});

bot.command('think', async (ctx) => {
  const topic = (ctx.message as any)?.text?.replace(/^\/think\s*/, '')?.trim();
  if (!topic) return ctx.reply('❓ Qaysi mavzu? /think [mavzu]');
  await streamMulti(ctx, [
    `🔍 *${topic}* — Tahlil boshlandi...`,
    `1. Asosiy tushuncha\n2. Kontekst\n3. Xulosa\n\nQo\'shimcha ma\'lumot kerak bo\'lsa /ask orqali so\'rang.`,
  ]);
});

// ═══ MEMORY ═══
bot.command('note', (ctx) => {
  const text = (ctx.message as any)?.text?.replace(/^\/note\s*/, '')?.trim();
  if (!text) return ctx.reply('❓ Nima? /note [matn]');
  mem.notes[`n_${Date.now()}`] = text;
  saveMemory(mem);
  ctx.reply('📝 Saqlandi');
});

bot.command('notes', (ctx) => {
  const e = Object.entries(mem.notes);
  if (!e.length) return ctx.reply('📭 Yo\'q');
  ctx.reply(e.map(([, t], i) => `${i + 1}. ${t}`).join('\n'));
});

bot.command('todo', (ctx) => {
  const text = (ctx.message as any)?.text?.replace(/^\/todo\s*/, '')?.trim();
  if (!text) return ctx.reply('❓ Nima? /todo [vazifa]');
  mem.todos.push(text);
  saveMemory(mem);
  ctx.reply(`✅ Qo\'shildi [${mem.todos.length}]`);
});

bot.command('todos', (ctx) => {
  if (!mem.todos.length) return ctx.reply('📭 Yo\'q');
  ctx.reply(mem.todos.map((t, i) => `${i + 1}. ${t}`).join('\n'));
});

bot.command('done', (ctx) => {
  const n = parseInt((ctx.message as any)?.text?.replace(/^\/done\s*/, '')?.trim() ?? '');
  if (isNaN(n) || n < 1 || n > mem.todos.length) return ctx.reply('❓ Qaysi? /done [№]');
  const d = mem.todos.splice(n - 1, 1)[0];
  saveMemory(mem);
  ctx.reply(`🎉 ${d}`);
});

bot.command('context', (ctx) => {
  const text = (ctx.message as any)?.text?.replace(/^\/context\s*/, '')?.trim();
  if (!text) return ctx.reply('❓ Nima? /context [matn]');
  mem.context.push(text);
  if (mem.context.length > 20) mem.context.shift();
  saveMemory(mem);
  ctx.reply(`🧠 [${mem.context.length}/20]`);
});

bot.command('clear', (ctx) => {
  mem.context = [];
  saveMemory(mem);
  ctx.reply('🧹 Tozalandi');
});

// ═══ HELP ═══
bot.help((ctx) => {
  ctx.reply([
    '📋 *BUYRUQLAR*',
    '',
    '*Loyiha:* /status /tasks /changes /report',
    '*Quality:* /gate /build /test',
    '*Git:* /pull /push',
    '*Service:* /pm2 /restart',
    '*Shaxsiy:* /note /notes /todo /todos /done',
    '*AI:* /ask /think /context /clear',
    '',
    'Har bir muhim amal tasdiqlanadi (confirm/reject)',
  ].join('\n'));
});

// ═══ DIRECT MESSAGE ═══
bot.on('text', async (ctx) => {
  const text = (ctx.message as any)?.text;
  if (text?.startsWith('/')) return;
  await ctx.reply('💬 Buyruq berish uchun /help');
});

// ═══ LAUNCH ═══
bot.launch(() => console.log('🤖 Project Control Bot ishga tushdi!\n📊 /status — holat\n📋 /help — barcha buyruqlar'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
