import { Module, Global } from '@nestjs/common';
import { UpdatesGateway } from './updates.gateway';

@Global()
@Module({
  providers: [UpdatesGateway],
  exports: [UpdatesGateway],
})
export class WebSocketModule {}
