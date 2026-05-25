import { Injectable, NestMiddleware } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(_req: FastifyRequest, reply: FastifyReply, next: () => void) {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Frame-Options', 'DENY');
    reply.header('X-XSS-Protection', '1; mode=block');
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  }
}
