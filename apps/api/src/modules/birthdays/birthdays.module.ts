import { Module } from '@nestjs/common';
import { DrizzleBirthdayRepository } from './infrastructure/repositories/drizzle-birthday.repository';

export const BIRTHDAY_REPO = Symbol('IBirthdayRepository');

@Module({
  providers: [{ provide: BIRTHDAY_REPO, useClass: DrizzleBirthdayRepository }],
  exports: [BIRTHDAY_REPO],
})
export class BirthdaysModule {}
