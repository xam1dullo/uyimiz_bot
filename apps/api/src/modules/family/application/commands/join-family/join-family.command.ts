export class JoinFamilyCommand {
  constructor(
    public readonly code: string,
    public readonly telegramId: string,
    public readonly name: string,
  ) {}
}
