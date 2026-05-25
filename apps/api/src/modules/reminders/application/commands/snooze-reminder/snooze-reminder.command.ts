export class SnoozeReminderCommand {
  constructor(
    public readonly reminderId: string,
    public readonly until: Date,
  ) {}
}
