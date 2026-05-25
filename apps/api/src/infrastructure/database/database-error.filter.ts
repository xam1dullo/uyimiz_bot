import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DatabaseErrorHandler {
  private readonly logger = new Logger(DatabaseErrorHandler.name);

  handle(error: any, context: string): never {
    if (error?.code === '23505') {
      this.logger.warn(`Unique constraint violation in ${context}`);
      throw new Error('DUPLICATE_ENTRY');
    }
    if (error?.code === '23503') {
      this.logger.warn(`Foreign key violation in ${context}`);
      throw new Error('REFERENCE_NOT_FOUND');
    }
    if (error?.code === 'P0001') {
      this.logger.warn(`RLS policy violation in ${context}`);
      throw new Error('ACCESS_DENIED');
    }
    this.logger.error(`Database error in ${context}`, error);
    throw error;
  }
}
