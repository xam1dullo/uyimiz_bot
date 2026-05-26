import { Controller, Post, Body, UnauthorizedException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { createHmac, createHash } from 'crypto';
import { JwtService } from '../services/jwt.service';

interface InitDataPayload {
  telegramId: string;
  familyId?: string;
  role?: string;
}

// ─── Telegram initData verification ───
function verifyTelegramInitData(initData: string, botToken: string): InitDataPayload | null {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return null;

    // Build data check string
    params.delete('hash');
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    // Compute HMAC-SHA256
    const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
    const computedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (computedHash !== hash) return null;

    // Parse user data
    const userStr = params.get('user');
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return {
      telegramId: String(user.id),
    };
  } catch {
    return null;
  }
}

@Controller('api/auth')
export class AuthController {
  constructor(    @Inject(forwardRef(() => JwtService)) private readonly jwt: JwtService) {}

  /** Telegram Mini App auth — verifies initData from TMA SDK */
  @Post('token')
  async getToken(@Body() body: { initData?: string; telegramId?: string; familyId?: string; role?: string }) {
    const botToken = process.env.BOT_TOKEN ?? '';

    // Try Telegram initData verification first (Mini App)
    if (body.initData) {
      const payload = verifyTelegramInitData(body.initData, botToken);
      if (!payload) {
        throw new UnauthorizedException('Invalid Telegram initData');
      }
      return this.issueTokens(payload);
    }

    // Dev/test mode: allow direct telegramId
    if (process.env.NODE_ENV === 'development' && body.telegramId) {
      return this.issueTokens({
        telegramId: body.telegramId,
        familyId: body.familyId,
        role: body.role,
      });
    }

    throw new UnauthorizedException(
      'Authentication requires Telegram Mini App initData. ' +
      'Open the app via Telegram.'
    );
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const payload = this.jwt.verify(body.refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const token = this.jwt.sign({
      sub: payload.sub,
      telegramId: payload.telegramId,
      familyId: payload.familyId,
      role: payload.role,
    });

    return { accessToken: token, expiresIn: 15 * 60 };
  }

  @Post('verify')
  async verify(@Body() body: { token: string }) {
    const payload = this.jwt.verify(body.token);
    if (!payload) return { valid: false };
    // Never expose full payload — only minimal info
    return { valid: true, role: payload.role };
  }

  private issueTokens(payload: InitDataPayload) {
    const tokenPayload = {
      sub: payload.telegramId,
      telegramId: payload.telegramId,
      familyId: payload.familyId,
      role: payload.role ?? 'parent',
    };

    return {
      accessToken: this.jwt.sign(tokenPayload),
      refreshToken: this.jwt.signRefresh(tokenPayload),
      expiresIn: 15 * 60,
    };
  }
}
