import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

interface JwtPayload {
  sub: string;
  telegramId: string;
  familyId?: string;
  role?: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET ?? 'default-secret-change-in-production-!!';
  }

  sign(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresInMinutes = 15): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);

    const tokenPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInMinutes * 60,
    };

    const headerEncoded = this.base64url(JSON.stringify(header));
    const payloadEncoded = this.base64url(JSON.stringify(tokenPayload));
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest('base64url');

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  signRefresh(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return this.sign(payload, 7 * 24 * 60);
  }

  verify(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      const signature = crypto
        .createHmac('sha256', this.secret)
        .update(`${parts[0]}.${parts[1]}`)
        .digest('base64url');

      if (signature !== parts[2]) return null;
      if (payload.exp < Math.floor(Date.now() / 1000)) return null;

      return payload as JwtPayload;
    } catch {
      return null;
    }
  }

  private base64url(data: string): string {
    return Buffer.from(data)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
}
