import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateBirthdayHandler } from '../../application/commands/create/create-birthday.handler';
import { ListBirthdaysHandler } from '../../application/queries/list/list-birthdays.handler';

@Controller('api/birthdays')
@UseGuards(JwtAuthGuard)
export class BirthdayController {
  constructor(
    private readonly createBirthday: CreateBirthdayHandler,
    private readonly listBirthdays: ListBirthdaysHandler,
  ) {}

  @Get()
  async list(@Query('familyId') familyId: string) {
    return this.listBirthdays.execute({ familyId });
  }

  @Post()
  async create(@Body() body: {
    familyId: string;
    name: string;
    birthDate: string;
    notifyDaysBefore?: number[];
    createdBy?: string;
  }) {
    return this.createBirthday.execute({
      familyId: body.familyId,
      name: body.name,
      birthDate: body.birthDate,
      createdBy: body.createdBy ?? 'system',
      notifyDaysBefore: body.notifyDaysBefore ?? [7, 3, 1],
    } as any);
  }
}
