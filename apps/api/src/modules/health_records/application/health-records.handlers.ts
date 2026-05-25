// ─── HealthRecords Handler ───
import { Injectable, Inject } from '@nestjs/common';
import { HealthRecordEntity } from '../domain/entities/health-record.entity';
import { HEALTH_RECORD_REPO } from '../health-records.module';
import type { IHealthRecordRepository } from '../infrastructure/repositories/drizzle-health-record.repository';

export class CreateHealthRecordCommand {
  constructor(public readonly familyId: string, public readonly userId: string,
    public readonly type: string, public readonly value: Record<string, unknown>,
    public readonly recordedAt?: Date, public readonly notes?: string | null) {}
}
@Injectable()
export class CreateHealthRecordHandler {
  constructor(@Inject(HEALTH_RECORD_REPO) private readonly repo: IHealthRecordRepository) {}
  async execute(cmd: CreateHealthRecordCommand): Promise<HealthRecordEntity> {
    return this.repo.create(HealthRecordEntity.create(cmd.familyId, cmd.userId, cmd.type, cmd.value, cmd.recordedAt, cmd.notes));
  }
}
export class ListHealthRecordsQuery { constructor(public readonly familyId: string, public readonly limit?: number) {} }
@Injectable()
export class ListHealthRecordsHandler {
  constructor(@Inject(HEALTH_RECORD_REPO) private readonly repo: IHealthRecordRepository) {}
  async execute(q: ListHealthRecordsQuery): Promise<HealthRecordEntity[]> { return this.repo.findByFamilyId(q.familyId, q.limit); }
}
