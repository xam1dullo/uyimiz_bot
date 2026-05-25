import { Module } from '@nestjs/common';
import { DrizzleChildRepository } from './infrastructure/repositories/drizzle-child.repository';
import { CreateChildHandler, ListChildrenHandler } from './application/children.handlers';
export const CHILD_REPO = Symbol('IChildRepository');
@Module({
  providers: [
    { provide: CHILD_REPO, useClass: DrizzleChildRepository },
    CreateChildHandler, ListChildrenHandler,
  ],
  exports: [CHILD_REPO, CreateChildHandler, ListChildrenHandler],
})
export class ChildrenModule {}
