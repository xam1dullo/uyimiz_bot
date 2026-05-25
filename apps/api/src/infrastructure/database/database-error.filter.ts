import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DatabaseErrorHandler {
  private readonly logger = new Logger(DatabaseErrorHandler.name);

  handle(error: unknown, context: string): never {
    const err = error as Record<string, unknown> | undefined;
    const code = err?.code as string | undefined;

    if (code === '23505') {
      this.logger.warn(`Unique constraint violation in ${context}`);
      throw new Error('DUPLICATE_ENTRY');
    }
    if (code === '23503') {
      this.logger.warn(`Foreign key violation in ${context}`);
      throw new Error('REFERENCE_NOT_FOUND');
    }
    if (code === 'P0001') {
      this.logger.warn(`RLS policy violation in ${context}`);
      throw new Error('ACCESS_DENIED');
    }
    // Sanitize: don't leak DB internals
    this.logger.error(`Database error in ${context}: code=${code ?? 'unknown'}`);
    throw new Error('DATABASE_ERROR');
  }
}
