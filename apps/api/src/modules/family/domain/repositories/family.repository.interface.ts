import { FamilyEntity } from '../entities/family.entity';
import { MemberEntity } from '../entities/member.entity';

export interface IFamilyRepository {
  createFamily(name: string, creatorTelegramId: string, creatorName: string): Promise<{ family: FamilyEntity; member: MemberEntity }>;
  findFamilyById(id: string): Promise<FamilyEntity | null>;
  findFamilyByCode(code: string): Promise<FamilyEntity | null>;
  updateFamily(family: FamilyEntity): Promise<FamilyEntity>;
  addMember(familyId: string, telegramId: string, name: string, role?: string): Promise<MemberEntity>;
  findMemberByTelegramId(telegramId: string): Promise<MemberEntity | null>;
  findMembersByFamilyId(familyId: string): Promise<MemberEntity[]>;
  updateMember(member: MemberEntity): Promise<MemberEntity>;
  removeMember(memberId: string): Promise<void>;
  getFamilyWithMembers(familyId: string): Promise<{ family: FamilyEntity; members: MemberEntity[] } | null>;
  generateInviteCode(familyId: string, createdBy: string): Promise<{ code: string }>;
}
