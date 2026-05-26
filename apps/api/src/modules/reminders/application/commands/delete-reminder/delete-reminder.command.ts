export class DeleteReminderCommand {
  constructor(
    public readonly reminderId: string,
    public readonly requestedBy: string,
  ) {}
}
