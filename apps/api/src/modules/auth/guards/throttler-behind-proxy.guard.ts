import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected override async getTracker(req: FastifyRequest): Promise<string> {
    return req.ips?.length ? req.ips[0] ?? req.ip : req.ip ?? 'unknown';
  }
}
