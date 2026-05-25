import { Module } from '@nestjs/common';
import { DrizzleDietRepository } from './infrastructure/repositories/drizzle-diet.repository';
export const DIET_REPO = Symbol('IDietRepository');
@Module({ providers: [{ provide: DIET_REPO, useClass: DrizzleDietRepository }], exports: [DIET_REPO] })
export class DietModule {}
