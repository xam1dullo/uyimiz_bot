import { Module } from '@nestjs/common';
import { DrizzleDietRepository } from './infrastructure/repositories/drizzle-diet.repository';
import { CreateDietHandler, ListDietHandler } from './application/diet.handlers';
export const DIET_REPO = Symbol('IDietRepository');
@Module({
  providers: [
    { provide: DIET_REPO, useClass: DrizzleDietRepository },
    CreateDietHandler, ListDietHandler,
  ],
  exports: [DIET_REPO, CreateDietHandler, ListDietHandler],
})
export class DietModule {}
