// ─── Children Command + Query ───
import { Injectable, Inject } from '@nestjs/common';
import { ChildEntity } from '../domain/entities/child.entity';
import { CHILD_REPO } from '../children.module';
import type { IChildRepository } from '../infrastructure/repositories/drizzle-child.repository';

export class CreateChildCommand {
  constructor(public readonly familyId: string, public readonly name: string, public readonly birthDate?: string | null) {}
}
@Injectable()
export class CreateChildHandler {
  constructor(@Inject(CHILD_REPO) private readonly repo: IChildRepository) {}
  async execute(cmd: CreateChildCommand): Promise<ChildEntity> {
    return this.repo.create(ChildEntity.create(cmd.familyId, cmd.name, cmd.birthDate));
  }
}

export class ListChildrenQuery { constructor(public readonly familyId: string) {} }
@Injectable()
export class ListChildrenHandler {
  constructor(@Inject(CHILD_REPO) private readonly repo: IChildRepository) {}
  async execute(q: ListChildrenQuery): Promise<ChildEntity[]> { return this.repo.findByFamilyId(q.familyId); }
}
