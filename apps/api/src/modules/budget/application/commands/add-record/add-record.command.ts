import type { TransactionType } from '@uyimiz/shared';

export class AddRecordCommand {
  constructor(
    public readonly familyId: string,
    public readonly type: TransactionType,
    public readonly categoryId: string,
    public readonly amount: number,
    public readonly createdBy: string,
    public readonly description?: string,
    public readonly txDate?: Date,
  ) {}
}
