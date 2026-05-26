import { Injectable, Inject } from '@nestjs/common';
import { BirthdayEntity } from '../../../domain/entities/birthday.entity';
import { IBirthdayRepository } from '../../../domain/repositories/birthday.repository.interface';
import { BIRTHDAY_REPO } from '../../../birthdays.tokens';

export class ListBirthdaysQuery {
  constructor(public readonly familyId: string) {}
}

@Injectable()
export class ListBirthdaysHandler {
  constructor(@Inject(BIRTHDAY_REPO) private readonly repo: IBirthdayRepository) {}
  async execute(query: ListBirthdaysQuery): Promise<BirthdayEntity[]> {
    return this.repo.findByFamilyId(query.familyId);
  }
}
