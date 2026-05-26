import { Injectable, Inject } from '@nestjs/common';
import { BirthdayEntity } from '../../../domain/entities/birthday.entity';
import { BIRTHDAY_REPO } from '../../../birthdays.tokens';
import type { DrizzleBirthdayRepository } from '../../../infrastructure/repositories/drizzle-birthday.repository';

export class ListBirthdaysQuery {
  constructor(public readonly familyId: string) {}
}

@Injectable()
export class ListBirthdaysHandler {
  constructor(@Inject(BIRTHDAY_REPO) private readonly repo: DrizzleBirthdayRepository) {}
  async execute(query: ListBirthdaysQuery): Promise<BirthdayEntity[]> {
    return this.repo.findByFamilyId(query.familyId);
  }
}
