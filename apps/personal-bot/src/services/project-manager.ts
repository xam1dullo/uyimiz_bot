// ─── Project Manager Bot — Loyihani Telegram orqali boshqarish ───
// /status, /tasks, /build, /test, /deploy, /review, /report

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = '/Users/admin/Developer/Projects/bot/uyimiz_bot';

function sh(cmd: string): string {
  try {
    return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', timeout: 30000 }).trim();
  } catch (e: any) {
    return `❌ ${e.message?.split('\n')[0] ?? 'Error'}`;
  }
}

// ═══════════════════════════════════════════
// PROJECT STATUS
// ═══════════════════════════════════════════

export function getFullStatus(): string {
  const gitBranch = sh('git branch --show-current');
  const gitLog = sh('git log --oneline -5');
  const gitStatus = sh('git status --short | head -10');
  
  const tasks = getTaskSummary();
  const qg = sh('cd ' + PROJECT_ROOT + ' && bash scripts/quality-gate.sh 2>&1 | tail -8');

  return [
    '📊 LOYIHA HOLATI',
    '',
    `🌿 Branch: \`${gitBranch}\``,
    '',
    'Oxirgi commit\'lar:',
    '```',
    gitLog,
    '```',
    '',
    'Task\'lar:',
    tasks,
    '',
    'Quality Gate:',
    '```',
    qg,
    '```',
    gitStatus ? `\nO\'zgargan fayllar:\n\`\`\`\n${gitStatus}\n\`\`\`` : '',
  ].join('\n');
}

export function getTaskSummary(): string {
  const result = sh('cd ' + PROJECT_ROOT + ' && python3 -c "import json; f=open(\'.beads/issues.jsonl\'); tasks=[json.loads(l) for l in f if json.loads(l)[\'issue_type\']==\'task\']; open_tasks=[t for t in tasks if t[\'status\']==\'open\']; closed_tasks=[t for t in tasks if t[\'status\']==\'closed\']; print(f\'{len(closed_tasks)}/{len(tasks)} yopilgan, {len(open_tasks)} ochiq\')" 2>/dev/null');
  return result || 'Task\'lar o\'qilmadi';
}

// ═══════════════════════════════════════════
// QUALITY GATE
// ═══════════════════════════════════════════

export function runQualityGate(): string {
  const result = sh('bash scripts/quality-gate.sh 2>&1');
  const passed = result.includes('ALL 4/4 CHECKS PASSED');
  
  return [
    passed ? '✅ QUALITY GATE — O\'TDI!*' : '❌ QUALITY GATE — O\'TMADI!*',
    '',
    '```',
    result,
    '```',
    '',
    passed ? '🚀 Tayyor!' : '🔧 Xatoliklarni to\'g\'irlash kerak',
  ].join('\n');
}

// ═══════════════════════════════════════════
// BUILD & TEST
// ═══════════════════════════════════════════

export function runBuild(): string {
  const result = sh('pnpm build 2>&1');
  return `🔨 Build:\n\`\`\`\n${result.slice(-200)}\n\`\`\``;
}

export function runTests(): string {
  const result = sh('pnpm --filter @uyimiz/api test 2>&1');
  const passed = result.includes('Tests  104 passed');
  return [
    passed ? '✅ TESTLAR O\'TDI (104/104)*' : '❌ TESTLAR O\'TMADI*',
    '',
    '```',
    result.slice(-300),
    '```',
  ].join('\n');
}

// ═══════════════════════════════════════════
// GIT OPERATIONS
// ═══════════════════════════════════════════

export function gitPull(): string {
  const result = sh('git pull --rebase 2>&1');
  return `🔄 Git Pull:\n\`\`\`\n${result}\n\`\`\``;
}

export function gitPush(): string {
  const result = sh('git push 2>&1');
  return `📤 Git Push:\n\`\`\`\n${result}\n\`\`\``;
}

// ═══════════════════════════════════════════
// PM2 SERVICE CONTROL
// ═══════════════════════════════════════════

export function pm2Status(): string {
  const result = sh('pm2 status 2>&1');
  return `⚡ PM2 Jarayonlar:\n\`\`\`\n${result.slice(0, 500)}\n\`\`\``;
}

export function pm2Restart(name: string): string {
  const result = sh(`pm2 restart ${name} 2>&1`);
  return `🔄 ${name} qayta ishga tushirildi:\n\`\`\`\n${result}\n\`\`\``;
}

export function pm2RestartAll(): string {
  const result = sh('pm2 restart all 2>&1');
  return `🔄 Barcha jarayonlar qayta ishga tushirildi:\n\`\`\`\n${result}\n\`\`\``;
}

// ═══════════════════════════════════════════
// TASK MANAGEMENT
// ═══════════════════════════════════════════

export function listTasks(): string {
  const result = sh('cd ' + PROJECT_ROOT + ' && bd list --status open 2>&1 | head -20');
  return `📋 Ochiq Task\'lar:\n\`\`\`\n${result || 'Hammasi yopilgan 🎉'}\n\`\`\``;
}

export function getTaskStatus(taskId: string): string {
  const result = sh(`cd ${PROJECT_ROOT} && bd show ${taskId} 2>&1`);
  return `📌 ${taskId}:\n\`\`\`\n${result.slice(0, 500)}\n\`\`\``;
}

export function closeTask(taskId: string): string {
  const result = sh(`cd ${PROJECT_ROOT} && bd close ${taskId} 2>&1`);
  return `✅ ${taskId} yopildi:\n\`\`\`\n${result}\n\`\`\``;
}

// ═══════════════════════════════════════════
// CODE REVIEW
// ═══════════════════════════════════════════

export function getRecentChanges(): string {
  const diff = sh('git diff --stat HEAD~3 2>&1');
  const log = sh('git log --oneline -10');
  return [
    '📝 Oxirgi o\'zgarishlar:',
    '',
    '```',
    log,
    '```',
    '',
    'Statistika:',
    '```',
    diff,
    '```',
  ].join('\n');
}

// ═══════════════════════════════════════════
// CONFIRMATION SYSTEM
// ═══════════════════════════════════════════

export interface PendingAction {
  id: string;
  action: string;
  description: string;
  createdAt: number;
  command: string;
}

const pendingActions = new Map<string, PendingAction>();

export function requestConfirmation(action: string, description: string, command: string): string {
  const id = `confirm_${Date.now()}`;
  pendingActions.set(id, {
    id, action, description,
    createdAt: Date.now(),
    command,
  });
  
  return [
    `⚠️ TASDIQLASH KERAK`,
    '',
    `Amal: ${action}`,
    `Tavsif: ${description}`,
    '',
    `✅ /confirm_${id} — Tasdiqlash`,
    `❌ /reject_${id} — Rad etish`,
  ].join('\n');
}

export function confirmAction(id: string): { confirmed: boolean; result: string } {
  const action = pendingActions.get(`confirm_${id}`);
  if (!action) return { confirmed: false, result: '❌ Amal topilmadi yoki muddati o\'tgan' };
  
  pendingActions.delete(`confirm_${id}`);
  const result = sh(action.command);
  
  return {
    confirmed: true,
    result: `✅ Bajarildi: ${action.description}\n\n\`\`\`\n${result}\n\`\`\``,
  };
}

export function rejectAction(id: string): string {
  const action = pendingActions.get(`reject_${id}`);
  if (!action) return '❌ Amal topilmadi';
  pendingActions.delete(`reject_${id}`);
  return `❌ Rad etildi: ${action.description}`;
}

// ═══════════════════════════════════════════
// AUTO REPORT GENERATOR
// ═══════════════════════════════════════════

export function generateReport(): string {
  const now = new Date().toLocaleString('uz-UZ');
  return [
    `📊 AVTOMATIK HISOBOT — ${now}`,
    '',
    getFullStatus(),
    '',
    '━━━━━━━━━━━━━━━━━━',
    `🤖 Avtomatik yaratildi • ${now}`,
  ].join('\n');
}
