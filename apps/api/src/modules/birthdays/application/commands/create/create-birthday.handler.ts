import { Injectable, Inject } from '@nestjs/common';
import { BirthdayEntity } from '../../../domain/entities/birthday.entity';
import { IBirthdayRepository } from '../../../domain/repositories/birthday.repository.interface';
import { BIRTHDAY_REPO } from '../../../birthdays.tokens';

export class CreateBirthdayHandler {
  constructor(@Inject(BIRTHDAY_REPO) private readonly repo: IBirthdayRepository) {}
  async execute(command: {
    familyId: string;
    name: string;
    birthDate: string;
    createdBy: string;
    notifyDaysBefore: number[];
  }): Promise<BirthdayEntity> {
    return this.repo.create({
      familyId: command.familyId,
      name: command.name,
      birthDate: command.birthDate,
      createdBy: command.createdBy,
      notifyDaysBefore: command.notifyDaysBefore,
    } as any);
  }
}
