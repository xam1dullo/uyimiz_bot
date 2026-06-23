import { Controller, Get, Post, Delete, Param, Body, NotFoundException, Inject } from '@nestjs/common';
import { IFamilyRepository } from '../../domain/repositories/family.repository.interface';
import { FAMILY_REPO } from '../../family.tokens';

@Controller('api/families')
export class FamilyMembersController {
  constructor(
    @Inject(FAMILY_REPO) private readonly repo: IFamilyRepository,
  ) {}

  @Get(':familyId/members')
  async getMembers(@Param('familyId') familyId: string) {
    const family = await this.repo.findFamilyById(familyId);
    if (!family) throw new NotFoundException('Family not found');
    const members = await this.repo.findMembersByFamilyId(familyId);
    return members.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      lang: m.lang,
    }));
  }

  @Post(':familyId/members')
  async addMember(
    @Param('familyId') familyId: string,
    @Body() body: { telegramId: string; name: string; role?: string },
  ) {
    const existing = await this.repo.findMemberByTelegramId(body.telegramId);
    if (existing) throw new Error('USER_ALREADY_IN_FAMILY');

    const role = (body.role ?? 'MEMBER') as 'OWNER' | 'MEMBER' | 'CHILD';
    const created = await this.repo.addMember(familyId, body.telegramId, body.name, role);
    return { id: created.id, name: created.name, role: created.role };
  }

  @Delete(':familyId/members/:memberId')
  async removeMember(
    @Param('memberId') memberId: string,
  ) {
    await this.repo.removeMember(memberId);
    return { success: true };
  }
}
