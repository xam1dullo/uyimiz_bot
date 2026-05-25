// ─── Project Control Bot — @uyimiz_bot via Telegram ───
import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import * as pm from './services/project-manager.js';

config({ path: join(import.meta.dirname, '../.env') });
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) { console.error('BOT_TOKEN required'); process.exit(1); }

const bot = new Telegraf(BOT_TOKEN);
const TASK_FILE = join(homedir(), '.uyimiz-tasks.json');

// ═══ START ═══
bot.start((ctx) => ctx.reply(
  '🤖 LOYIHA BOSHQARUV BOTI\n\n' +
  '/status — Holat\n/tasks — Tasklar\n/gate — Quality Gate\n' +
  '/build — Build\n/test — Testlar\n/pull — Git pull\n/push — Git push\n' +
  '/pm2 — Jarayonlar\n/restart — Restart\n/report — Hisobot\n' +
  '/do [task] — Yangi task\n/tasks_list — Tasklar royhati\n' +
  '/qc — Tez QG\n/tc — TypeCheck\n/rb — Build\n/help — Yordam'
));

bot.help((ctx) => ctx.reply('/status /tasks /gate /build /test /pull /push /pm2 /restart /report /do /qc /tc /rb'));

// ═══ PROJECT ═══
bot.command('status', (ctx) => { ctx.sendChatAction('typing').catch(()=>{}); ctx.reply(pm.getFullStatus()); });
bot.command('tasks', (ctx) => ctx.reply(pm.listTasks()));
bot.command('changes', (ctx) => ctx.reply(pm.getRecentChanges()));
bot.command('report', (ctx) => { ctx.sendChatAction('typing').catch(()=>{}); ctx.reply(pm.generateReport()); });

// ═══ QUALITY ═══
bot.command('gate', (ctx) => { ctx.sendChatAction('typing').catch(()=>{}); ctx.reply(pm.runQualityGate()); });
bot.command('qc', (ctx) => {
  ctx.sendChatAction('typing').catch(()=>{});
  const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && bash scripts/quality-gate.sh 2>&1', { encoding: 'utf-8', timeout: 60000 });
  ctx.reply(r.slice(-1000));
});
bot.command('tc', (ctx) => {
  ctx.sendChatAction('typing').catch(()=>{});
  const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && pnpm typecheck 2>&1', { encoding: 'utf-8', timeout: 60000 });
  ctx.reply(r.includes('4 successful') ? '✅ TypeCheck: 4/4' : '❌\n' + r.slice(-500));
});
bot.command('rb', (ctx) => {
  ctx.sendChatAction('typing').catch(()=>{});
  const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && pnpm build 2>&1', { encoding: 'utf-8', timeout: 60000 });
  ctx.reply(r.includes('4 successful') ? '✅ Build: 4/4' : '❌\n' + r.slice(-500));
});
bot.command('test', (ctx) => { ctx.sendChatAction('typing').catch(()=>{}); ctx.reply(pm.runTests()); });
bot.command('build', (ctx) => ctx.reply(pm.requestConfirmation('Build', 'pnpm build', 'pnpm build 2>&1')));

// ═══ GIT ═══
bot.command('pull', (ctx) => ctx.reply(pm.requestConfirmation('Git Pull', 'git pull --rebase', 'git pull --rebase 2>&1')));
bot.command('push', (ctx) => ctx.reply(pm.requestConfirmation('Git Push', 'git push', 'git push 2>&1')));

// ═══ PM2 ═══
bot.command('pm2', (ctx) => ctx.reply(pm.pm2Status()));
bot.command('restart', (ctx) => ctx.reply(pm.requestConfirmation('Restart All', 'pm2 restart all', 'pm2 restart all 2>&1')));

// ═══ TASK QUEUE ═══
bot.command('do', (ctx) => {
  const task = (ctx.message as any)?.text?.replace(/^\/do\s*/, '')?.trim();
  if (!task) return ctx.reply('/do [task tavsifi]\n\nMisollar:\n/do typecheck qil\n/do budget moduliga validation qosh\n/do test corner case larni tekshir');
  
  let tasks: any[] = [];
  try { if (existsSync(TASK_FILE)) tasks = JSON.parse(readFileSync(TASK_FILE, 'utf-8')); } catch {}
  const id = Date.now().toString(36);
  tasks.push({ id, task, from: ctx.from?.id, createdAt: new Date().toISOString(), status: 'pending' });
  writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
  ctx.reply(`📋 Task #${id}\n⏳ ${task}\n\nKeyingi sessiyada bajariladi. /tasks_list`);
});

bot.command('tasks_list', (ctx) => {
  let tasks: any[] = [];
  try { if (existsSync(TASK_FILE)) tasks = JSON.parse(readFileSync(TASK_FILE, 'utf-8')); } catch {}
  if (!tasks.length) return ctx.reply('📭 Tasklar yoq');
  ctx.reply(tasks.map((t, i) => `${t.status === 'done' ? '✅' : '⏳'} ${i + 1}. ${t.task.slice(0, 60)} [${t.id}]`).join('\n'));
});

// ═══ CONFIRM ═══
bot.command('confirm', (ctx) => {
  const id = (ctx.message as any)?.text?.replace(/^\/confirm_?\s*/, '')?.trim();
  if (!id) return;
  const r = pm.confirmAction(id);
  ctx.reply(r.confirmed ? r.result : r.result);
});
bot.command('reject', (ctx) => {
  const id = (ctx.message as any)?.text?.replace(/^\/reject_?\s*/, '')?.trim();
  if (!id) return;
  ctx.reply(pm.rejectAction(id));
});

// ═══ LAUNCH ═══
bot.launch(() => console.log('🤖 Bot started! /status /tasks'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// ═══ AUTO-EXEC: Task kelishi bilan darhol bajarish ═══
async function autoExecuteTask(task: string, ctx: any): Promise<string> {
  const t = task.toLowerCase();
  
  // TypeCheck
  if (t.includes('typecheck') || t.includes('tc')) {
    const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && pnpm typecheck 2>&1', { encoding: 'utf-8', timeout: 60000 });
    return r.includes('4 successful') ? '✅ TypeCheck: 4/4 passed' : '❌ TypeCheck FAILED:\n' + r.slice(-500);
  }
  
  // Quality Gate
  if (t.includes('quality') || t.includes('gate') || t.includes('qg') || t.includes('qc')) {
    const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && bash scripts/quality-gate.sh 2>&1', { encoding: 'utf-8', timeout: 60000 });
    return r.includes('ALL 4/4') ? '✅ Quality Gate: 4/4 passed' : '❌\n' + r.slice(-800);
  }
  
  // Build
  if (t.includes('build') || t.includes('rb')) {
    const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && pnpm build 2>&1', { encoding: 'utf-8', timeout: 60000 });
    return r.includes('4 successful') ? '✅ Build: 4/4 passed' : '❌\n' + r.slice(-500);
  }
  
  // Tests
  if (t.includes('test')) {
    const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && pnpm --filter @uyimiz/api test 2>&1', { encoding: 'utf-8', timeout: 60000 });
    const match = r.match(/Tests\s+(\d+)\s+passed/);
    return match ? `✅ Tests: ${match[1]} passed` : '❌\n' + r.slice(-500);
  }
  
  // Git status
  if (t.includes('git') && (t.includes('status') || t.includes('log'))) {
    const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && git log --oneline -5 2>&1', { encoding: 'utf-8', timeout: 10000 });
    return '📝 Oxirgi commitlar:\n' + r;
  }
  
  // Task status
  if (t.includes('task') && (t.includes('status') || t.includes('list'))) {
    const r = pm.getFullStatus();
    return r.slice(0, 2000);
  }

  // PM2 status
  if (t.includes('pm2') || t.includes('service') || t.includes('jarayon')) {
    return pm.pm2Status();
  }

  // Review code
  if (t.includes('review') || t.includes('tekshir')) {
    const files = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && git diff --stat HEAD~3 2>&1', { encoding: 'utf-8', timeout: 10000 });
    const log = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && git log --oneline -5 2>&1', { encoding: 'utf-8', timeout: 10000 });
    return '🔍 REVIEW:\n\nOxirgi commitlar:\n' + log + '\n\nO\'zgarishlar:\n' + files;
  }

  // Fix/eslint
  if (t.includes('fix') || t.includes('lint')) {
    const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && pnpm lint 2>&1', { encoding: 'utf-8', timeout: 30000 });
    return '🔧 Lint:\n' + r.slice(-500);
  }

  // DB
  if (t.includes('db') || t.includes('schema') || t.includes('migration')) {
    const r = execSync('cd /Users/admin/Developer/Projects/bot/uyimiz_bot && pnpm --filter @uyimiz/db exec drizzle-kit check 2>&1', { encoding: 'utf-8', timeout: 10000 });
    return '🗄️ DB Schema:\n' + r.slice(-500);
  }

  // Default: queue for AI agent
  return '';
}

// Override /do with auto-exec
const oldDoHandler = bot.command;
bot.command('do', async (ctx) => {
  const task = (ctx.message as any)?.text?.replace(/^\/do\s*/, '')?.trim();
  if (!task) return ctx.reply('/do [task]\nMisollar:\n/do typecheck\n/do quality gate\n/do review code');
  
  await ctx.sendChatAction('typing').catch(()=>{});
  
  // Try auto-execute
  const result = await autoExecuteTask(task, ctx);
  
  if (result) {
    // Auto-executed successfully
    await ctx.reply(`🤖 Avtomatik bajarildi!\n\n${result}`);
    
    // Save as done
    let tasks: any[] = [];
    try { if (existsSync(TASK_FILE)) tasks = JSON.parse(readFileSync(TASK_FILE, 'utf-8')); } catch {}
    tasks.push({ id: Date.now().toString(36), task, from: ctx.from?.id, createdAt: new Date().toISOString(), status: 'done', result: result.slice(0, 200) });
    writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
  } else {
    // Queue for AI agent
    let tasks: any[] = [];
    try { if (existsSync(TASK_FILE)) tasks = JSON.parse(readFileSync(TASK_FILE, 'utf-8')); } catch {}
    const id = Date.now().toString(36);
    tasks.push({ id, task, from: ctx.from?.id, createdAt: new Date().toISOString(), status: 'pending' });
    writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
    
    await ctx.reply(
      `📋 Task #${id}\n⏳ ${task}\n\n` +
      `Bu task avtomatik bajarilmadi — AI agentga yuborildi.\n` +
      `Avtomatik bajariladigan tasklar: typecheck, build, test, gate, review, lint, db, git, pm2`
    );
  }
});

