// ─── FirstAid Handler ───
import { Injectable, Inject } from '@nestjs/common';
import { FirstAidEntity } from '../domain/entities/first-aid.entity';
import { FIRSTAID_REPO } from '../first-aid.module';
import type { IFirstAidRepository } from '../infrastructure/repositories/drizzle-firstaid.repository';

export class CreateFirstAidCommand {
  constructor(public readonly familyId: string, public readonly title: string,
    public readonly description: string, public readonly lang?: string, public readonly emergencyLevel?: string) {}
}
@Injectable()
export class CreateFirstAidHandler {
  constructor(@Inject(FIRSTAID_REPO) private readonly repo: IFirstAidRepository) {}
  async execute(cmd: CreateFirstAidCommand): Promise<FirstAidEntity> {
    return this.repo.create(FirstAidEntity.create(cmd.familyId, cmd.title, cmd.description, cmd.lang, cmd.emergencyLevel));
  }
}
export class ListFirstAidQuery { constructor(public readonly familyId: string) {} }
@Injectable()
export class ListFirstAidHandler {
  constructor(@Inject(FIRSTAID_REPO) private readonly repo: IFirstAidRepository) {}
  async execute(q: ListFirstAidQuery): Promise<FirstAidEntity[]> { return this.repo.findByFamilyId(q.familyId); }
}
