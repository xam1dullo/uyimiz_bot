import { Module, Global, type OnApplicationShutdown } from '@nestjs/common';
import { createClient, closeClient, type DB } from '@uyimiz/db';

export const DB_TOKEN = 'DRIZZLE_DB';

const dbProvider = {
  provide: DB_TOKEN,
  useFactory: () => {
    return createClient();
  },
};

@Global()
@Module({
  providers: [dbProvider],
  exports: [DB_TOKEN],
})
export class DatabaseModule implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await closeClient();
  }
}
