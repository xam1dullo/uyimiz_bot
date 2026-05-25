import { Injectable } from '@nestjs/common';
import { IFamilyRepository } from '../../../domain/repositories/family.repository.interface';
import { FamilyEntity } from '../../../domain/entities/family.entity';
import { MemberEntity } from '../../../domain/entities/member.entity';
import { GetFamilyQuery } from './get-family.query';

@Injectable()
export class GetFamilyHandler {
  constructor(private readonly repo: IFamilyRepository) {}

  async execute(query: GetFamilyQuery): Promise<{ family: FamilyEntity; members: MemberEntity[] } | null> {
    const family = await this.repo.findById(query.familyId);
    if (!family) return null;
    const members = await this.repo.findMembersByFamilyId(query.familyId);
    return { family, members };
  }
}
