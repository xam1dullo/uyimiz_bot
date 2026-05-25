// ─── PM2 Ecosystem Config ───
module.exports = {
  apps: [
    {
      name: 'personal-ai-bot',
      script: 'src/bot.ts',
      cwd: '/Users/admin/Developer/Projects/bot/uyimiz_bot/apps/personal-bot',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/Users/admin/Developer/Projects/bot/uyimiz_bot/apps/personal-bot/logs/error.log',
      out_file: '/Users/admin/Developer/Projects/bot/uyimiz_bot/apps/personal-bot/logs/output.log',
      merge_logs: true,
    },
  ],
};
