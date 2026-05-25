export class ListTasksQuery {
  constructor(
    public readonly familyId: string,
    public readonly status?: string,
    public readonly assignedTo?: string,
  ) {}
}
