import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import * as crypto from 'crypto';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  private readonly logger = new Logger(TelegramAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const initData = request.headers['x-telegram-init-data'] as string;

    if (!initData) {
      throw new UnauthorizedException('Missing Telegram init data');
    }

    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      this.logger.error('BOT_TOKEN not configured');
      throw new UnauthorizedException('Auth configuration error');
    }

    if (!this.validateInitData(initData, botToken)) {
      throw new UnauthorizedException('Invalid Telegram init data');
    }

    return true;
  }

  private validateInitData(initData: string, botToken: string): boolean {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return false;

    params.delete('hash');
    params.sort();

    const dataCheckString = Array.from(params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return computedHash === hash;
  }
}
