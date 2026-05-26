import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards , Inject, forwardRef } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateTaskHandler } from '../../application/commands/create-task/create-task.handler';
import { ListTasksHandler } from '../../application/queries/list-tasks/list-tasks.handler';
import { CreateTaskCommand } from '../../application/commands/create-task/create-task.command';

@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    @Inject(forwardRef(() => CreateTaskHandler)) private readonly createTask: CreateTaskHandler,
    @Inject(forwardRef(() => ListTasksHandler)) private readonly listTasks: ListTasksHandler,
  ) {}

  @Get()
  async list(@Query('familyId') familyId: string, @Query('status') status?: string) {
    return this.listTasks.execute({ familyId, status });
  }

  @Post()
  async create(@Body() body: {
    familyId: string;
    title: string;
    description?: string;
    priority?: string;
    points?: number;
    assignedTo?: string;
  }) {
    return this.createTask.execute(new CreateTaskCommand(
      body.familyId,
      body.title,
      body.description ?? '',
      body.priority ?? 'medium',
      String(body.points ?? 0),
      body.assignedTo,
    ));
  }

  @Patch(':taskId/complete')
  async complete(@Param('taskId') taskId: string) {
    return { taskId, status: 'completed', message: 'Task completed' };
  }
}
