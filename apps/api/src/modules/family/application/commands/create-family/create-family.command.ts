export class CreateFamilyCommand {
  constructor(
    public readonly name: string,
    public readonly creatorTelegramId: string,
    public readonly creatorName: string,
  ) {}
}
