import { Module } from '@nestjs/common';
import { DrizzleImportantTaskRepository } from './infrastructure/repositories/drizzle-important-task.repository';
export const IMPORTANT_TASK_REPO = Symbol('IImportantTaskRepository');
@Module({
  providers: [{ provide: IMPORTANT_TASK_REPO, useClass: DrizzleImportantTaskRepository }],
  exports: [IMPORTANT_TASK_REPO],
})
export class ImportantTasksModule {}
