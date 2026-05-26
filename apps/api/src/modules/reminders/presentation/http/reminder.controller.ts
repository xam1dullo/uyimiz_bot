import { Controller, Get, Post, Body, Query, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateReminderHandler } from '../../application/commands/create-reminder/create-reminder.handler';
import { CreateReminderCommand } from '../../application/commands/create-reminder/create-reminder.command';
import { REMINDER_REPO } from '../../reminders.tokens';
import { IReminderRepository } from '../../domain/repositories/reminder.repository.interface';

@Controller('api/reminders')
@UseGuards(JwtAuthGuard)
export class ReminderController {
  constructor(
    @Inject(forwardRef(() => CreateReminderHandler)) private readonly createReminder: CreateReminderHandler,
    @Inject(REMINDER_REPO) private readonly repo: IReminderRepository,
  ) {}

  @Get()
  async list(@Query('familyId') familyId: string) {
    return this.repo.findByFamilyId(familyId);
  }

  @Post()
  async create(@Body() body: {
    familyId: string;
    title: string;
    description?: string;
    type?: string;
    scheduledAt: string;
    createdBy?: string;
  }) {
    return this.createReminder.execute(new CreateReminderCommand(
      body.familyId,
      body.title,
      (body.type ?? 'one_time') as any,
      new Date(body.scheduledAt),
      body.createdBy ?? 'system',
      body.description,
    ));
  }
}
