import { FAMILY_REPO } from '../../../family.tokens';
import { Injectable, Inject } from '@nestjs/common';
import { IFamilyRepository } from '../../../domain/repositories/family.repository.interface';
import { CreateFamilyCommand } from './create-family.command';

@Injectable()
export class CreateFamilyHandler {
  constructor(@Inject(FAMILY_REPO) private readonly repo: IFamilyRepository) {}

  async execute(command: CreateFamilyCommand) {
    const existing = await this.repo.findMemberByTelegramId(command.creatorTelegramId);
    if (existing) {
      throw new Error('USER_ALREADY_IN_FAMILY');
    }

    return this.repo.createFamily(command.name, command.creatorTelegramId, command.creatorName);
  }
}
