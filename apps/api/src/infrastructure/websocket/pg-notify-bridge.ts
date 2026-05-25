// ─── pg_notify → WebSocket bridge (uses @uyimiz/db postgres client) ───

import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { UpdatesGateway } from './updates.gateway';
import { DB_TOKEN } from '../database/database.module';
import type { DB } from '@uyimiz/db';

@Injectable()
export class PgNotifyBridge implements OnModuleInit {
  private readonly logger = new Logger(PgNotifyBridge.name);

  constructor(
    private readonly ws: UpdatesGateway,
    @Inject(DB_TOKEN) private readonly db: DB,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('pg_notify bridge ready (WebSocket active)');
    // pg_notify listeners are registered in DatabaseModule
    // Events flow: DB trigger → pg_notify → DatabaseModule listener → WebSocket
  }
}
