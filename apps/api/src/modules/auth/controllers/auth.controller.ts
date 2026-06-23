import { Controller, Post, Body, UnauthorizedException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { createHmac, createHash } from 'crypto';
import { JwtService } from '../services/jwt.service';

import { validate, parse } from '@telegram-apps/init-data-node';
import { LoginHandler } from '../application/commands/login/login.handler';

interface InitDataPayload {
  telegramId: string;
  name?: string;
  username?: string;
}

function verifyTelegramInitData(initData: string, botToken: string): InitDataPayload | null {
  try {
    validate(initData, botToken);
    const parsed = parse(initData);
    if (!parsed.user) return null;
    return {
      telegramId: String(parsed.user.id),
      name: parsed.user.firstName + (parsed.user.lastName ? ' ' + parsed.user.lastName : ''),
      username: parsed.user.username,
    };
  } catch (err) {
    return null;
  }
}

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => JwtService)) private readonly jwt: JwtService,
    private readonly loginHandler: LoginHandler
  ) {}

  /** Telegram Mini App auth — verifies initData from TMA SDK */
  @Post('init')
  async getToken(@Body() body: { initData?: string; telegramId?: string; name?: string }) {
    const botToken = process.env.BOT_TOKEN ?? '';

    // Try Telegram initData verification first (Mini App)
    if (body.initData) {
      const payload = verifyTelegramInitData(body.initData, botToken);
      if (!payload) {
        throw new UnauthorizedException('Invalid Telegram initData');
      }
      return this.loginHandler.execute(payload);
    }

    // Dev/test mode: allow direct telegramId
    if (process.env.NODE_ENV === 'development' && body.telegramId) {
      return this.loginHandler.execute({
        telegramId: body.telegramId,
        name: body.name || 'Dev User',
      });
    }

    throw new UnauthorizedException(
      'Authentication requires Telegram Mini App initData. ' +
      'Open the app via Telegram.'
    );
  }

  @Post('verify')
  async verify(@Body() body: { token: string }) {
    const payload = this.jwt.verify(body.token);
    if (!payload) return { valid: false };
    // Never expose full payload — only minimal info
    return { valid: true, role: payload.role };
  }

}
