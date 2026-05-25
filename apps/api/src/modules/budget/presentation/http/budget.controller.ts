import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AddRecordHandler } from '../../application/commands/add-record/add-record.handler';
import { GetBalanceHandler } from '../../application/queries/get-balance/get-balance.handler';
import { GetMonthlySummaryHandler } from '../../application/queries/get-monthly-summary/get-monthly-summary.handler';
import type { TransactionType } from '@uyimiz/shared';

@Controller('api/budget')
export class BudgetController {
  constructor(
    private readonly addRecord: AddRecordHandler,
    private readonly getBalance: GetBalanceHandler,
    private readonly getMonthlySummary: GetMonthlySummaryHandler,
  ) {}

  @Post('records')
  async create(@Body() body: { familyId: string; type: TransactionType; categoryId: string; amount: number; createdBy: string; description?: string }) {
    const record = await this.addRecord.execute(body);
    return { id: record.id, amount: record.amount, type: record.type };
  }

  @Get(':familyId/balance')
  async balance(@Param('familyId') familyId: string) {
    const balance = await this.getBalance.execute({ familyId });
    return { balance };
  }

  @Get(':familyId/summary')
  async summary(@Param('familyId') familyId: string, @Query('year') year: string, @Query('month') month: string) {
    const summary = await this.getMonthlySummary.execute({
      familyId,
      year: Number(year ?? new Date().getFullYear()),
      month: Number(month ?? new Date().getMonth() + 1),
    });
    return summary;
  }
}
