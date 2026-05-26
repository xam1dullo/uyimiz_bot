import { Injectable, Inject } from '@nestjs/common';
import { BirthdayEntity } from '../../../domain/entities/birthday.entity';
import { BIRTHDAY_REPO } from '../../../birthdays.tokens';
import type { DrizzleBirthdayRepository } from '../../../infrastructure/repositories/drizzle-birthday.repository';

export class CreateBirthdayCommand {
  constructor(
    public readonly familyId: string,
    public readonly name: string,
    public readonly birthDate: string,
    public readonly createdBy: string,
    public readonly userId?: string | null,
    public readonly notifyDaysBefore?: number[],
  ) {}
}

@Injectable()
export class CreateBirthdayHandler {
  constructor(@Inject(BIRTHDAY_REPO) private readonly repo: DrizzleBirthdayRepository) {}
  async execute(cmd: CreateBirthdayCommand): Promise<BirthdayEntity> {
    return this.repo.create(BirthdayEntity.create({
      familyId: cmd.familyId, name: cmd.name, birthDate: cmd.birthDate,
      createdBy: cmd.createdBy, userId: cmd.userId, notifyDaysBefore: cmd.notifyDaysBefore,
    }));
  }
}
