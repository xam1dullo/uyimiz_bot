import { TASK_REPO } from './tasks.tokens';
import { TaskController } from './presentation/http/task.controller';
import { Module } from '@nestjs/common';
import { CreateTaskHandler } from './application/commands/create-task/create-task.handler';
import { ListTasksHandler } from './application/queries/list-tasks/list-tasks.handler';
import { TaskAddWizard } from './presentation/bot/task.wizard';
import { DrizzleTaskRepository } from './infrastructure/repositories/drizzle-task.repository';



@Module({
  controllers: [TaskController],
  providers: [
    CreateTaskHandler,
    ListTasksHandler,
    { provide: TASK_REPO, useClass: DrizzleTaskRepository },
    TaskAddWizard,
  ],
  exports: [TASK_REPO, CreateTaskHandler, ListTasksHandler, TaskAddWizard],
})
export class TasksModule {}
