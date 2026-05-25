import { Module } from '@nestjs/common';
import { DrizzleFirstAidRepository } from './infrastructure/repositories/drizzle-firstaid.repository';
import { CreateFirstAidHandler, ListFirstAidHandler } from './application/first-aid.handlers';
export const FIRSTAID_REPO = Symbol('IFirstAidRepository');
@Module({
  providers: [
    { provide: FIRSTAID_REPO, useClass: DrizzleFirstAidRepository },
    CreateFirstAidHandler, ListFirstAidHandler,
  ],
  exports: [FIRSTAID_REPO, CreateFirstAidHandler, ListFirstAidHandler],
})
export class FirstAidModule {}
