import { BIRTHDAY_REPO } from './birthdays.tokens';
import { Module } from '@nestjs/common';
import { DrizzleBirthdayRepository } from './infrastructure/repositories/drizzle-birthday.repository';
import { CreateBirthdayHandler } from './application/commands/create/create-birthday.handler';
import { ListBirthdaysHandler } from './application/queries/list/list-birthdays.handler';
import { BirthdayController } from './presentation/http/birthday.controller';


@Module({
  controllers: [BirthdayController],
  providers: [
    { provide: BIRTHDAY_REPO, useClass: DrizzleBirthdayRepository },
    CreateBirthdayHandler,
    ListBirthdaysHandler,
  ],
  exports: [BIRTHDAY_REPO, CreateBirthdayHandler, ListBirthdaysHandler],
})
export class BirthdaysModule {}
