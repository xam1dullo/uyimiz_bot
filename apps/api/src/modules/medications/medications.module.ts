import { Module } from '@nestjs/common';
import { DrizzleMedicationRepository } from './infrastructure/repositories/drizzle-medication.repository';
export const MEDICATION_REPO = Symbol('IMedicationRepository');
@Module({ providers: [{ provide: MEDICATION_REPO, useClass: DrizzleMedicationRepository }], exports: [MEDICATION_REPO] })
export class MedicationsModule {}
