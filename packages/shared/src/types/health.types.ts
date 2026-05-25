export const HEALTH_RECORD_TYPES = ['temperature', 'pressure', 'weight', 'height', 'blood_sugar', 'symptom', 'note'] as const;
export type HealthRecordType = (typeof HEALTH_RECORD_TYPES)[number];

export interface HealthRecord {
  id: string;
  familyId: string;
  userId: string;
  type: HealthRecordType;
  value: Record<string, unknown>;
  recordedAt: Date;
  notes?: string;
  createdAt: Date;
}
