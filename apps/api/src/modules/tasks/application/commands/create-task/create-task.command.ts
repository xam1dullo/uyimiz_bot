export class CreateTaskCommand {
  constructor(
    public readonly familyId: string,
    public readonly title: string,
    public readonly createdBy: string,
    public readonly assignedTo?: string | null,
    public readonly description?: string | null,
    public readonly priority?: string,
    public readonly points?: number,
    public readonly repeat?: string,
  ) {}
}
