import { Injectable, Inject, Logger } from '@nestjs/common';
import { families, users, inviteCodes, type DB, withFamilyContext } from '@uyimiz/db';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';
import { FamilyEntity } from '../../domain/entities/family.entity';
import { MemberEntity, type MemberRole, type UserLang } from '../../domain/entities/member.entity';
import { IFamilyRepository } from '../../domain/repositories/family.repository.interface';

@Injectable()
export class DrizzleFamilyRepository implements IFamilyRepository {
  private readonly logger = new Logger(DrizzleFamilyRepository.name);

  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  async createFamily(name: string, creatorTelegramId: string, creatorName: string): Promise<{ family: FamilyEntity; member: MemberEntity }> {
    // Family creation happens before a family context exists —
    // the insert is on the families table, not a family-scoped table.
    // RLS on families is not applicable here, but subsequent reads use withFamilyContext.
    const [row] = await this.db.insert(families).values({
      name,
      code: nanoid(8).toUpperCase(),
    }).returning();
    const family = this.toFamilyEntity(row);

    // Insert the owner as a member — this is a pre-context operation
    const [memberRow] = await this.db.insert(users).values({
      telegramId: creatorTelegramId,
      familyId: family.id,
      name: creatorName,
      role: 'OWNER',
    }).returning();
    const member = this.toMemberEntity(memberRow);

    return { family, member };
  }

  async findFamilyById(id: string): Promise<FamilyEntity | null> {
    return withFamilyContext(id, async (tx) => {
      const [row] = await tx.select().from(families).where(eq(families.id, id));
      return row ? this.toFamilyEntity(row) : null;
    });
  }

  async findFamilyByCode(code: string): Promise<FamilyEntity | null> {
    const [row] = await this.db.select().from(families).where(eq(families.code, code));
    return row ? this.toFamilyEntity(row) : null;
  }

  async updateFamily(family: FamilyEntity): Promise<FamilyEntity> {
    return withFamilyContext(family.id, async (tx) => {
      const [row] = await tx.update(families)
        .set({ name: family.name, updatedAt: new Date() })
        .where(eq(families.id, family.id)).returning();
      return this.toFamilyEntity(row);
    });
  }

  async addMember(familyId: string, telegramId: string, name: string, role: MemberRole = 'MEMBER'): Promise<MemberEntity> {
    return withFamilyContext(familyId, async (tx) => {
      const [row] = await tx.insert(users).values({
        telegramId,
        familyId,
        name,
        role,
      }).returning();
      return this.toMemberEntity(row);
    });
  }

  async findMemberByTelegramId(telegramId: string): Promise<MemberEntity | null> {
    // Cross-family lookup — intentionally bypasses withFamilyContext
    // This is a Pre-Context Resolver that resolves a Telegram identity before
    // a family context is established.
    const [row] = await this.db.select().from(users).where(eq(users.telegramId, telegramId));
    return row ? this.toMemberEntity(row) : null;
  }

  async findMembersByFamilyId(familyId: string): Promise<MemberEntity[]> {
    return withFamilyContext(familyId, async (tx) => {
      const rows = await tx.select().from(users).where(eq(users.familyId, familyId));
      return rows.map((row) => this.toMemberEntity(row));
    });
  }

  async updateMember(member: MemberEntity): Promise<MemberEntity> {
    return withFamilyContext(member.familyId, async (tx) => {
      const [row] = await tx.update(users)
        .set({ name: member.name, role: member.role, lang: member.lang ?? 'uz', updatedAt: new Date() })
        .where(eq(users.id, member.id)).returning();
      return this.toMemberEntity(row);
    });
  }

  async removeMember(memberId: string): Promise<void> {
    const [member] = await this.db.select({ familyId: users.familyId }).from(users).where(eq(users.id, memberId));
    if (!member) return;
    await withFamilyContext(member.familyId!, async (tx) => {
      await tx.delete(users).where(eq(users.id, memberId));
    });
  }

  async getFamilyWithMembers(familyId: string): Promise<{ family: FamilyEntity; members: MemberEntity[] } | null> {
    return withFamilyContext(familyId, async (tx) => {
      const [row] = await tx.select().from(families).where(eq(families.id, familyId));
      if (!row) return null;
      const members = await tx.select().from(users).where(eq(users.familyId, familyId));
      return {
        family: this.toFamilyEntity(row),
        members: members.map((m) => this.toMemberEntity(m)),
      };
    });
  }

  async generateInviteCode(familyId: string, createdBy: string): Promise<{ code: string }> {
    return withFamilyContext(familyId, async (tx) => {
      const code = nanoid(8).toUpperCase();
      await tx.insert(inviteCodes).values({ familyId, code, createdBy });
      return { code };
    });
  }

  private toFamilyEntity(row: Record<string, unknown>): FamilyEntity {
    return new FamilyEntity(
      row.id as string,
      row.name as string,
      row.code as string,
      row.createdAt as Date,
      row.updatedAt as Date,
    );
  }

  private toMemberEntity(row: Record<string, unknown>): MemberEntity {
    return new MemberEntity(
      row.id as string,
      row.telegramId as string,
      row.name as string,
      row.role as MemberRole,
      (row.lang ?? 'uz') as UserLang,
      row.familyId as string,
      row.createdAt as Date,
      row.updatedAt as Date,
    );
  }
}
