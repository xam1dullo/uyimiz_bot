import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import * as crypto from 'crypto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');

      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      const secret = process.env.JWT_SECRET ?? '';
      const signature = crypto
        .createHmac('sha256', secret)
        .update(`${parts[0]}.${parts[1]}`)
        .digest('base64url');

      if (signature !== parts[2]) {
        throw new Error('Invalid signature');
      }

      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }

      (request as any).user = payload;
      return true;
    } catch (e: any) {
      this.logger.warn(`JWT verification failed: ${e.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
