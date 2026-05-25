import { Module } from '@nestjs/common';
import { CreateTaskHandler } from './application/commands/create-task/create-task.handler';
import { ListTasksHandler } from './application/queries/list-tasks/list-tasks.handler';
import { DrizzleTaskRepository } from './infrastructure/repositories/drizzle-task.repository';

export const TASK_REPO = Symbol('ITaskRepository');

@Module({
  providers: [
    CreateTaskHandler,
    ListTasksHandler,
    { provide: TASK_REPO, useClass: DrizzleTaskRepository },
  ],
  exports: [TASK_REPO, CreateTaskHandler, ListTasksHandler],
})
export class TasksModule {}
