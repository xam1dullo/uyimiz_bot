import { Catch, Logger } from '@nestjs/common';

@Catch()
export class TelegrafExceptionFilter {
  private readonly logger = new Logger(TelegrafExceptionFilter.name);

  async catch(exception: Error, context: any): Promise<void> {
    // Log safely — redact sensitive data, use error codes not messages
    const ctx = context?.ctx;
    const userId = ctx?.from?.id ?? 'unknown';
    this.logger.error(
      `Bot error for user ${userId}: ${exception.constructor.name}`,
    );

    if (ctx?.reply) {
      try {
        // Generic message — no hardcoded language
        await ctx.reply('❌ Error occurred. Please try again or /cancel.');
      } catch {
        // Silent — can't reply, nothing we can do
      }
    }
  }
}
