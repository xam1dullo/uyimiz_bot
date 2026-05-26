import { Module, Global } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { MessageManager } from './message-manager';
import { KeyboardFactory } from './keyboard.factory';
import { BotAnalytics } from './bot-analytics';

@Global()
@Module({
  providers: [StreamingService, MessageManager, KeyboardFactory, BotAnalytics],
  exports: [StreamingService, MessageManager, KeyboardFactory, BotAnalytics],
})
export class BotCoreModule {}
