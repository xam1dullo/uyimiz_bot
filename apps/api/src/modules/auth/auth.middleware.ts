import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
      (req as any).user = null;
    }
    next();
  }
}
