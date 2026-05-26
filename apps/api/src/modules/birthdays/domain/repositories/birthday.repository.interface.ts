import { BirthdayEntity } from '../entities/birthday.entity';

export interface IBirthdayRepository {
  create(b: BirthdayEntity): Promise<BirthdayEntity>;
  findByFamilyId(familyId: string): Promise<BirthdayEntity[]>;
  update(b: BirthdayEntity): Promise<BirthdayEntity>;
  delete(id: string, familyId: string): Promise<void>;
}
