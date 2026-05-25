import { v4 as uuid } from 'uuid';

export type MemberRole = 'admin' | 'parent' | 'child' | 'guest';
export type UserLang = 'uz' | 'ru' | 'en';

export class MemberEntity {
  constructor(
    public readonly id: string,
    public readonly telegramId: string,
    public name: string,
    public role: MemberRole,
    public lang: UserLang,
    public readonly familyId: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    telegramId: string,
    name: string,
    familyId: string,
    role: MemberRole = 'parent',
    lang: UserLang = 'uz',
  ): MemberEntity {
    return new MemberEntity(
      uuid(), telegramId, name, role, lang, familyId, new Date(), new Date(),
    );
  }

  updateRole(role: MemberRole): void {
    this.role = role;
    this.updatedAt = new Date();
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}
