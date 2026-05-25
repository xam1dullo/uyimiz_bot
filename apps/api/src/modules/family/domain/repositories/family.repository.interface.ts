import { FamilyEntity } from '../entities/family.entity';
import { MemberEntity } from '../entities/member.entity';

export interface IFamilyRepository {
  create(family: FamilyEntity): Promise<FamilyEntity>;
  findById(id: string): Promise<FamilyEntity | null>;
  findByCode(code: string): Promise<FamilyEntity | null>;
  update(family: FamilyEntity): Promise<FamilyEntity>;
  addMember(member: MemberEntity): Promise<MemberEntity>;
  findMemberByTelegramId(telegramId: string): Promise<MemberEntity | null>;
  findMembersByFamilyId(familyId: string): Promise<MemberEntity[]>;
  updateMember(member: MemberEntity): Promise<MemberEntity>;
  removeMember(memberId: string): Promise<void>;
  findFamilyByTelegramId(telegramId: string): Promise<FamilyEntity | null>;
}
