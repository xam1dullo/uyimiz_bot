import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from './services/jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly jwt: JwtService) {}

  use(req: FastifyRequest, _res: FastifyReply, next: () => void) {
    const header = req.headers['authorization'] as string | undefined;
    if (!header) {
      (req as any).user = null;
      next();
      return;
    }

    const token = header.replace(/^Bearer\s+/i, '');
    const payload = this.jwt.verify(token);
    
    if (payload) {
      (req as any).user = {
        id: payload.sub,
        telegramId: payload.telegramId,
        familyId: payload.familyId ?? null,
        role: payload.role ?? 'user',
      };
    } else {
      (req as any).user = null;
    }

    next();
  }
}
