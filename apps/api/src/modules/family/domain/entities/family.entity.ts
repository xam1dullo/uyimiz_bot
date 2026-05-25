import { v4 as uuid } from 'uuid';

export class FamilyEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly code: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(name: string, code: string): FamilyEntity {
    return new FamilyEntity(uuid(), name, code, new Date(), new Date());
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}
