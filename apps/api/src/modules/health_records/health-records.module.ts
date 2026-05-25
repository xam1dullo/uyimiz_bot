import { Module } from '@nestjs/common';
import { DrizzleHealthRecordRepository } from './infrastructure/repositories/drizzle-health-record.repository';
export const HEALTH_RECORD_REPO = Symbol('IHealthRecordRepository');
@Module({ providers: [{ provide: HEALTH_RECORD_REPO, useClass: DrizzleHealthRecordRepository }], exports: [HEALTH_RECORD_REPO] })
export class HealthRecordsModule {}
