import { FAMILY_REPO } from '../../../family.tokens';
import { Injectable, Inject } from '@nestjs/common';
import { IFamilyRepository } from '../../../domain/repositories/family.repository.interface';
import { MemberEntity } from '../../../domain/entities/member.entity';
import { JoinFamilyCommand } from './join-family.command';

@Injectable()
export class JoinFamilyHandler {
  constructor(@Inject(FAMILY_REPO) private readonly repo: IFamilyRepository) {}

  async execute(command: JoinFamilyCommand): Promise<MemberEntity> {
    const existing = await this.repo.findMemberByTelegramId(command.telegramId);
    if (existing) {
      throw new Error('USER_ALREADY_IN_FAMILY');
    }

    const family = await this.repo.findByCode(command.code);
    if (!family) {
      throw new Error('INVITE_CODE_INVALID');
    }

    const member = MemberEntity.create(
      command.telegramId,
      command.name,
      family.id,
      'parent',
    );
    return this.repo.addMember(member);
  }
}
