import { Injectable } from '@nestjs/common';
import { IFamilyRepository } from '../../../domain/repositories/family.repository.interface';
import { FamilyEntity } from '../../../domain/entities/family.entity';
import { MemberEntity } from '../../../domain/entities/member.entity';
import { CreateFamilyCommand } from './create-family.command';
import { nanoid } from 'nanoid';

@Injectable()
export class CreateFamilyHandler {
  constructor(private readonly repo: IFamilyRepository) {}

  async execute(command: CreateFamilyCommand): Promise<{ family: FamilyEntity; member: MemberEntity }> {
    const existing = await this.repo.findMemberByTelegramId(command.creatorTelegramId);
    if (existing) {
      throw new Error('USER_ALREADY_IN_FAMILY');
    }

    const code = nanoid(8).toUpperCase();
    const family = FamilyEntity.create(command.name, code);
    const createdFamily = await this.repo.create(family);

    const member = MemberEntity.create(
      command.creatorTelegramId,
      command.creatorName,
      createdFamily.id,
      'admin',
    );
    const createdMember = await this.repo.addMember(member);

    return { family: createdFamily, member: createdMember };
  }
}
