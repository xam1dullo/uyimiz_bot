export class DeleteReminderCommand {
  constructor(
    public readonly reminderId: string,
    public readonly familyId: string,
    public readonly requestedBy: string,
  ) {}
}
