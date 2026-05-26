import { Injectable, Inject } from '@nestjs/common';
import { families, users, inviteCodes, type DB } from '@uyimiz/db';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';
import { FamilyEntity } from '../../domain/entities/family.entity';
import { MemberEntity } from '../../domain/entities/member.entity';
import { IFamilyRepository } from '../../domain/repositories/family.repository.interface';

@Injectable()
export class DrizzleFamilyRepository implements IFamilyRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  async createFamily(name: string, creatorTelegramId: string, creatorName: string): Promise<{ family: FamilyEntity; member: MemberEntity }> {
    const [row] = await this.db.insert(families).values({
      name,
      code: nanoid(8).toUpperCase(),
    }).returning();
    const family = this.toFamilyEntity(row);

    const [memberRow] = await this.db.insert(users).values({
      telegramId: creatorTelegramId,
      familyId: family.id,
      name: creatorName,
      role: 'admin',
    }).returning();
    const member = this.toMemberEntity(memberRow);

    return { family, member };
  }

  async findFamilyById(id: string): Promise<FamilyEntity | null> {
    const [row] = await this.db.select().from(families).where(eq(families.id, id));
    return row ? this.toFamilyEntity(row) : null;
  }

  async findFamilyByCode(code: string): Promise<FamilyEntity | null> {
    const [row] = await this.db.select().from(families).where(eq(families.code, code));
    return row ? this.toFamilyEntity(row) : null;
  }

  async updateFamily(family: FamilyEntity): Promise<FamilyEntity> {
    const [row] = await this.db.update(families)
      .set({ name: family.name, updatedAt: new Date() })
      .where(eq(families.id, family.id)).returning();
    return this.toFamilyEntity(row);
  }

  async addMember(familyId: string, telegramId: string, name: string, role = 'parent'): Promise<MemberEntity> {
    const [row] = await this.db.insert(users).values({
      telegramId,
      familyId,
      name,
      role: role as any,
    }).returning();
    return this.toMemberEntity(row);
  }

  async findMemberByTelegramId(telegramId: string): Promise<MemberEntity | null> {
    const [row] = await this.db.select().from(users).where(eq(users.telegramId, telegramId));
    return row ? this.toMemberEntity(row) : null;
  }

  async findMembersByFamilyId(familyId: string): Promise<MemberEntity[]> {
    const rows = await this.db.select().from(users).where(eq(users.familyId, familyId));
    return rows.map(this.toMemberEntity);
  }

  async updateMember(member: MemberEntity): Promise<MemberEntity> {
    const [row] = await this.db.update(users)
      .set({ name: member.name, role: member.role as any, lang: member.lang, updatedAt: new Date() })
      .where(eq(users.id, member.id)).returning();
    return this.toMemberEntity(row);
  }

  async removeMember(memberId: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, memberId));
  }

  async getFamilyWithMembers(familyId: string): Promise<{ family: FamilyEntity; members: MemberEntity[] } | null> {
    const [row] = await this.db.select({ family: families })
      .from(families).where(eq(families.id, familyId));
    if (!row) return null;
    const members = await this.findMembersByFamilyId(familyId);
    return { family: this.toFamilyEntity(row.family), members };
  }

  async generateInviteCode(familyId: string, createdBy: string): Promise<{ code: string }> {
    const code = nanoid(8).toUpperCase();
    await this.db.insert(inviteCodes).values({ familyId, code, createdBy });
    return { code };
  }

  private toFamilyEntity(row: any): FamilyEntity {
    return new FamilyEntity(row.id, row.name, row.code, row.createdAt, row.updatedAt);
  }

  private toMemberEntity(row: any): MemberEntity {
    return new MemberEntity(
      row.id, row.telegramId, row.name, row.role, row.lang,
      row.familyId, row.createdAt, row.updatedAt,
    );
  }
}
