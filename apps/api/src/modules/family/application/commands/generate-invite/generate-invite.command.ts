export class GenerateInviteCommand {
  constructor(
    public readonly familyId: string,
    public readonly createdBy: string,
  ) {}
}
