import { Injectable, Inject } from '@nestjs/common';
import { IFamilyRepository } from '../../domain/repositories/family.repository.interface';
import { FAMILY_REPO } from '../../family.tokens';

@Injectable()
export class InviteSystem {
  constructor(@Inject(FAMILY_REPO) private readonly repo: IFamilyRepository) {}

  async generateInvite(familyId: string, createdBy: string): Promise<string> {
    const result = await this.repo.generateInviteCode(familyId, createdBy);
    return result.code;
  }
}
