import { Injectable, Inject } from '@nestjs/common';
import { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { ListTasksQuery } from './list-tasks.query';
import { TASK_REPO } from '../../../tasks.tokens';

@Injectable()
export class ListTasksHandler {
  constructor(@Inject(TASK_REPO) private readonly repo: ITaskRepository) {}

  async execute(query: ListTasksQuery): Promise<TaskEntity[]> {
    return this.repo.findByFamilyId(query.familyId, {
      status: query.status,
      assignedTo: query.assignedTo,
    });
  }
}
