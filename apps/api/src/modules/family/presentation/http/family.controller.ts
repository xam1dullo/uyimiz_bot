import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateFamilyHandler } from '../../application/commands/create-family/create-family.handler';
import { GetFamilyHandler } from '../../application/queries/get-family/get-family.handler';

@Controller('api/families')
export class FamilyController {
  constructor(
    private readonly createFamily: CreateFamilyHandler,
    private readonly getFamily: GetFamilyHandler,
  ) {}

  @Post()
  async create(@Body() body: { name: string; telegramId: string; name2: string }) {
    const result = await this.createFamily.execute({
      name: body.name,
      creatorTelegramId: body.telegramId,
      creatorName: body.name2,
    });
    return { id: result.family.id, code: result.family.code };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const result = await this.getFamily.execute({ familyId: id });
    if (!result) return { error: 'not_found' };
    return {
      id: result.family.id,
      name: result.family.name,
      code: result.family.code,
      members: result.members.map((m) => ({
        id: m.id, name: m.name, role: m.role, lang: m.lang,
      })),
    };
  }
}
