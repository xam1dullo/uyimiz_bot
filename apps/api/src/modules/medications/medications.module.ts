import { Module } from '@nestjs/common';
import { DrizzleMedicationRepository } from './infrastructure/repositories/drizzle-medication.repository';
import { CreateMedicationHandler, ListMedicationsHandler } from './application/medications.handlers';
export const MEDICATION_REPO = Symbol('IMedicationRepository');
@Module({
  providers: [
    { provide: MEDICATION_REPO, useClass: DrizzleMedicationRepository },
    CreateMedicationHandler, ListMedicationsHandler,
  ],
  exports: [MEDICATION_REPO, CreateMedicationHandler, ListMedicationsHandler],
})
export class MedicationsModule {}
