export class GetMonthlySummaryQuery {
  constructor(
    public readonly familyId: string,
    public readonly year: number,
    public readonly month: number,
  ) {}
}
