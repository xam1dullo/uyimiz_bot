import { Module } from '@nestjs/common';
import { DrizzleFirstAidRepository } from './infrastructure/repositories/drizzle-firstaid.repository';
export const FIRSTAID_REPO = Symbol('IFirstAidRepository');
@Module({ providers: [{ provide: FIRSTAID_REPO, useClass: DrizzleFirstAidRepository }], exports: [FIRSTAID_REPO] })
export class FirstAidModule {}
