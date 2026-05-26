import { TASK_REPO } from './tasks.tokens';
import { Module } from '@nestjs/common';
import { CreateTaskHandler } from './application/commands/create-task/create-task.handler';
import { ListTasksHandler } from './application/queries/list-tasks/list-tasks.handler';
import { DrizzleTaskRepository } from './infrastructure/repositories/drizzle-task.repository';



@Module({
  providers: [
    CreateTaskHandler,
    ListTasksHandler,
    { provide: TASK_REPO, useClass: DrizzleTaskRepository },
  ],
  exports: [TASK_REPO, CreateTaskHandler, ListTasksHandler],
})
export class TasksModule {}
