import { Controller, Post, Body , Inject, forwardRef } from '@nestjs/common';
import { GenerateInviteHandler } from '../../application/commands/generate-invite/generate-invite.handler';
import { GenerateInviteCommand } from '../../application/commands/generate-invite/generate-invite.command';
import { IFamilyRepository } from '../../domain/repositories/family.repository.interface';
import { Inject } from '@nestjs/common';
import { FAMILY_REPO } from '../../family.tokens';

@Controller('api/invites')
export class InviteController {
  constructor(
    @Inject(forwardRef(() => GenerateInviteHandler)) private readonly generateInvite: GenerateInviteHandler,
    @Inject(FAMILY_REPO) private readonly repo: IFamilyRepository,
  ) {}

  @Post('generate')
  async generate(@Body() body: { familyId: string; createdBy: string }) {
    return this.generateInvite.execute(new GenerateInviteCommand(body.familyId, body.createdBy));
  }

  @Post('validate')
  async validate(@Body() body: { code: string }) {
    const family = await this.repo.findFamilyByCode(body.code.toUpperCase());
    if (!family) {
      return { valid: false, message: 'Invalid code' };
    }
    return { valid: true, familyId: family.id };
  }
}
