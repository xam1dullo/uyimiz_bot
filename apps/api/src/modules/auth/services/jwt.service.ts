import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface JwtPayload {
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
    this.secret = process.env.JWT_SECRET ?? '';
    if (this.secret.length < 32) {
      this.logger.warn('JWT_SECRET is missing or too short (< 32 chars). Auth will fail.');
    }
  }

  sign(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresInSeconds = 900): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const full: JwtPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

    const encodedHeader = this.base64url(JSON.stringify(header));
    const encodedPayload = this.base64url(JSON.stringify(full));
    const signature = this.signData(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verify(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [headerB64, payloadB64, signatureB64] = parts;
      const expectedSig = this.signData(`${headerB64}.${payloadB64}`);
      
      if (!crypto.timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expectedSig))) {
        return null;
      }

      const payload: JwtPayload = JSON.parse(this.base64Decode(payloadB64));
      
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null; // expired
      }

      return payload;
    } catch {
      return null;
    }
  }

  private signData(data: string): string {
    return crypto.createHmac('sha256', this.secret).update(data).digest('base64url');
  }

  private base64url(data: string): string {
    return Buffer.from(data).toString('base64url');
  }

  private base64Decode(data: string): string {
    return Buffer.from(data, 'base64url').toString('utf-8');
  }
}
