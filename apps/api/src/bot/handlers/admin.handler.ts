// ─── Admin Handler — Loyihani Telegram orqali boshqarish ───
// Faqat loyiha egasi (540152508) uchun ishlaydi

import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Command } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { execSync } from 'child_process';
import { join } from 'path';

const PROJECT_ROOT = '/Users/admin/Developer/Projects/bot/uyimiz_bot';
const OWNER_ID = 540152508;

function sh(cmd: string): string {
  try {
    return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', timeout: 60000 }).trim().slice(0, 3500);
  } catch (e: any) {
    return `❌ ${e.message?.split('\n')[0] ?? 'Xatolik'}`;
  }
}

@Injectable()
export class AdminHandler {
  private readonly logger = new Logger(AdminHandler.name);

  private isOwner(ctx: Context): boolean {
    return ctx.from?.id === OWNER_ID;
  }

  @Command('admin')
  async adminHelp(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    await ctx.reply([
      '🔧 *ADMIN BUYRUQLAR*',
      '',
      '/a — loyiha holati',
      '/gate — quality gate',
      '/tc — typecheck',
      '/build — build',
      '/test — testlar',
      '/gitlog — oxirgi commitlar',
      '/pm2 — jarayonlar',
      '/beads — ochiq tasklar',
      '/deploy — restart all',
      '',
      'Buyruqni yozing, darhol bajariladi ⚡',
    ].join('\n'), { parse_mode: 'Markdown' });
  }

  @Command('a')
  async status(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    await ctx.sendChatAction('typing');

    const branch = sh('git branch --show-current');
    const log = sh('git log --oneline -3');
    const status = sh('git status --short | head -5');
    const beads = sh('cd ' + PROJECT_ROOT + ' && bd list --status open 2>&1 | head -10');

    await ctx.reply([
      '📊 *LOYIHA HOLATI*',
      '',
      `🌿 \`${branch}\``,
      '',
      '*Oxirgi commitlar:*',
      '```',
      log,
      '```',
      '',
      '*Ochik tasklar:*',
      '```',
      beads,
      '```',
      status ? `\n*Fayllar:*\n\`\`\`\n${status}\n\`\`\`` : '',
    ].join('\n'), { parse_mode: 'Markdown' });
  }

  @Command('gate')
  async qualityGate(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    await ctx.sendChatAction('typing');
    const result = sh('bash scripts/quality-gate.sh 2>&1');
    const passed = result.includes('ALL 4/4');
    await ctx.reply(
      (passed ? '✅ *QG otildi!*' : '❌ *QG otilmadi*') + '\n```\n' + result.slice(-1000) + '\n```',
      { parse_mode: 'Markdown' },
    );
  }

  @Command('tc')
  async typecheck(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    await ctx.sendChatAction('typing');
    const result = sh('pnpm typecheck 2>&1');
    const ok = result.includes('7 successful') || result.includes('4 successful');
    await ctx.reply(ok ? '✅ TypeCheck: otildi' : '❌\n```\n' + result.slice(-500) + '\n```', { parse_mode: 'Markdown' });
  }

  @Command('build')
  async build(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    await ctx.sendChatAction('typing');
    const result = sh('pnpm build 2>&1');
    const ok = result.includes('4 successful');
    await ctx.reply(ok ? '✅ Build: otildi' : '❌\n```\n' + result.slice(-500) + '\n```', { parse_mode: 'Markdown' });
  }

  @Command('test')
  async test(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    await ctx.sendChatAction('typing');
    const result = sh('pnpm --filter @uyimiz/api test 2>&1');
    const match = result.match(/Tests\s+(\d+)\s+passed/);
    await ctx.reply(
      match ? `✅ Testlar: ${match[1]} otildi` : '❌\n```\n' + result.slice(-500) + '\n```',
      { parse_mode: 'Markdown' },
    );
  }

  @Command('gitlog')
  async gitlog(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    const log = sh('git log --oneline -10');
    const diff = sh('git diff --stat HEAD~3 2>&1');
    await ctx.reply('📝 ```\n' + log + '\n\n' + diff + '\n```', { parse_mode: 'Markdown' });
  }

  @Command('pm2')
  async pm2(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    const result = sh('pm2 status 2>&1');
    await ctx.reply('⚡ ```\n' + result.slice(0, 1000) + '\n```', { parse_mode: 'Markdown' });
  }

  @Command('beads')
  async beads(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    const result = sh('cd ' + PROJECT_ROOT + ' && bd list --status open 2>&1');
    const done = sh('cd ' + PROJECT_ROOT + ' && python3 -c "import json; f=open(\'.beads/issues.jsonl\'); tasks=[json.loads(l) for l in f]; closed=[t for t in tasks if t.get(\'status\')==\'closed\']; print(f\'{len(closed)} closed\')" 2>/dev/null');
    await ctx.reply(
      `📋 *Tasklar* (${done || '?'} yopilgan)\n\`\`\`\n${result}\n\`\`\``,
      { parse_mode: 'Markdown' },
    );
  }

  @Command('deploy')
  async deploy(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    await ctx.reply('⚠️ *Deploy?* /confirm yozing', { parse_mode: 'Markdown' });
  }

  @Command('confirm')
  async confirm(@Ctx() ctx: Context) {
    if (!this.isOwner(ctx)) return;
    await ctx.sendChatAction('typing');
    const r1 = sh('git add -A && git commit -m "deploy: quick deploy" 2>&1');
    const r2 = sh('pnpm build 2>&1');
    const r3 = sh('pm2 restart all 2>&1').slice(0, 500);
    await ctx.reply(
      '🚀 *Deploy bajarildi!*\n```\n' + r1.slice(-200) + '\n\n' + r2.slice(-200) + '\n\n' + r3 + '\n```',
      { parse_mode: 'Markdown' },
    );
  }
}
