import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

export const FamilyContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const user = (request as any).user;

    if (!user || !user.familyId) {
      throw new UnauthorizedException('User is not assigned to any family context');
    }

    return user.familyId;
  },
);
