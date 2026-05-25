import { Catch, Logger } from '@nestjs/common';

@Catch()
export class TelegrafExceptionFilter {
  private readonly logger = new Logger(TelegrafExceptionFilter.name);

  async catch(exception: Error, context: any): Promise<void> {
    this.logger.error(`Bot error: ${exception.message}`, exception.stack);
    const ctx = context?.ctx;
    if (ctx?.reply) {
      try {
        await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qayta urining.');
      } catch (e) {
        this.logger.error('Failed to send error reply', e);
      }
    }
  }
}
