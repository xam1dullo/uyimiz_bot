import { Module } from '@nestjs/common';
import { DrizzleChildRepository } from './infrastructure/repositories/drizzle-child.repository';
export const CHILD_REPO = Symbol('IChildRepository');
@Module({ providers: [{ provide: CHILD_REPO, useClass: DrizzleChildRepository }], exports: [CHILD_REPO] })
export class ChildrenModule {}
