export class CreateBirthdayCommand {
  constructor(
    public readonly familyId: string,
    public readonly name: string,
    public readonly birthDate: string,
    public readonly createdBy: string,
    public readonly notifyDaysBefore: number[] = [7, 3, 1],
  ) {}
}
