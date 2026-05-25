export class GetCategoryReportQuery {
  constructor(
    public readonly familyId: string,
    public readonly year: number,
    public readonly month: number,
  ) {}
}
