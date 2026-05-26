import { Injectable, Inject } from '@nestjs/common';
import { IFamilyRepository } from '../../../domain/repositories/family.repository.interface';
import { FAMILY_REPO } from '../../../family.tokens';
import { GenerateInviteCommand } from './generate-invite.command';

@Injectable()
export class GenerateInviteHandler {
  constructor(@Inject(FAMILY_REPO) private readonly repo: IFamilyRepository) {}

  async execute(command: GenerateInviteCommand): Promise<{ code: string }> {
    return this.repo.generateInviteCode(command.familyId, command.createdBy);
  }
}
