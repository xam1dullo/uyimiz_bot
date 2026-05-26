import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    // Only handle HTTP context (not Telegraf/RPC/WebSocket)
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message = typeof response === 'string' ? response : (response as Record<string, unknown>).message as string ?? message;
    } else if (exception instanceof Error) {
      message = exception.message;
      if (message.startsWith('BUDGET_') || message.startsWith('USER_') || message.startsWith('INVITE_') || message.startsWith('FAMILY_') || message.startsWith('TASK_') || message.startsWith('MED_') || message.startsWith('FIRSTAID_') || message.startsWith('CHILD_')) {
        status = HttpStatus.BAD_REQUEST;
      }
    }

    // Sanitize: don't log raw DB errors
    const safeMsg = exception instanceof Error && message.startsWith('BUDGET_') ? message : String(status);
    this.logger.error(`HTTP ${status} ${request.method} ${request.url}: ${safeMsg}`);

    reply.code(status).send({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
