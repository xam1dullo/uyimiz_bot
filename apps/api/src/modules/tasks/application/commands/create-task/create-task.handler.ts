import { Injectable, Inject } from '@nestjs/common';
import { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { CreateTaskCommand } from './create-task.command';
import { TASK_REPO } from '../../../tasks.module';

@Injectable()
export class CreateTaskHandler {
  constructor(@Inject(TASK_REPO) private readonly repo: ITaskRepository) {}

  async execute(command: CreateTaskCommand): Promise<TaskEntity> {
    return this.repo.create(TaskEntity.create({
      familyId: command.familyId,
      title: command.title,
      createdBy: command.createdBy,
      assignedTo: command.assignedTo,
      description: command.description,
      priority: command.priority as TaskEntity['priority'],
      points: command.points,
      repeat: command.repeat as TaskEntity['repeat'],
    }));
  }
}
