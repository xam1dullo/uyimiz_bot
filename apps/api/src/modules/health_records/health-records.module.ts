import { Module } from '@nestjs/common';
import { DrizzleHealthRecordRepository } from './infrastructure/repositories/drizzle-health-record.repository';
import { CreateHealthRecordHandler, ListHealthRecordsHandler } from './application/health-records.handlers';
export const HEALTH_RECORD_REPO = Symbol('IHealthRecordRepository');
@Module({
  providers: [
    { provide: HEALTH_RECORD_REPO, useClass: DrizzleHealthRecordRepository },
    CreateHealthRecordHandler, ListHealthRecordsHandler,
  ],
  exports: [HEALTH_RECORD_REPO, CreateHealthRecordHandler, ListHealthRecordsHandler],
})
export class HealthRecordsModule {}
