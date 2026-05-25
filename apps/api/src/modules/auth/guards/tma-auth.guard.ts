import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import * as crypto from 'crypto';

@Injectable()
export class TmaAuthGuard implements CanActivate {
  private readonly logger = new Logger(TmaAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const initData = request.headers['x-telegram-init-data'] as string;

    if (!initData) {
      throw new UnauthorizedException('Missing Telegram init data');
    }

    try {
      const botToken = process.env.BOT_TOKEN ?? '';
      const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

      const params = new URLSearchParams(initData);
      const hash = params.get('hash');
      params.delete('hash');

      const sortedParams = Array.from(params.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');

      const computedHash = crypto
        .createHmac('sha256', secretKey)
        .update(sortedParams)
        .digest('hex');

      if (computedHash !== hash) {
        throw new Error('Hash mismatch');
      }

      const userStr = params.get('user');
      if (userStr) {
        (request as any).telegramUser = JSON.parse(userStr);
      }

      return true;
    } catch (e: any) {
      this.logger.warn(`TMA auth failed: ${e.message}`);
      throw new UnauthorizedException('Invalid Telegram authentication');
    }
  }
}
