// ─── Medications Command + Query ───
import { Injectable, Inject } from '@nestjs/common';
import { MedicationEntity } from '../domain/entities/medication.entity';
import { MEDICATION_REPO } from '../medications.module';
import type { IMedicationRepository } from '../infrastructure/repositories/drizzle-medication.repository';

export class CreateMedicationCommand {
  constructor(public readonly familyId: string, public readonly name: string, public readonly dosage?: string | null, public readonly assignedTo?: string | null) {}
}
@Injectable()
export class CreateMedicationHandler {
  constructor(@Inject(MEDICATION_REPO) private readonly repo: IMedicationRepository) {}
  async execute(cmd: CreateMedicationCommand): Promise<MedicationEntity> {
    return this.repo.create(MedicationEntity.create(cmd.familyId, cmd.name, cmd.dosage, cmd.assignedTo));
  }
}
export class ListMedicationsQuery { constructor(public readonly familyId: string, public readonly activeOnly?: boolean) {} }
@Injectable()
export class ListMedicationsHandler {
  constructor(@Inject(MEDICATION_REPO) private readonly repo: IMedicationRepository) {}
  async execute(q: ListMedicationsQuery): Promise<MedicationEntity[]> { return this.repo.findByFamilyId(q.familyId, q.activeOnly); }
}
