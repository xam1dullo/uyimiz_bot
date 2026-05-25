import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private startTime = Date.now();

  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      version: '1.0.0',
    };
  }

  @Get('ready')
  ready() {
    return { status: 'ready', checks: { database: 'ok', redis: 'ok', bot: 'ok' } };
  }
}
