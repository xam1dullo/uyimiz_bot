import { Injectable, Inject } from '@nestjs/common';
import { families, users, type DB } from '@uyimiz/db';
import { eq } from 'drizzle-orm';
import { FamilyEntity } from '../../domain/entities/family.entity';
import { MemberEntity } from '../../domain/entities/member.entity';
import { IFamilyRepository } from '../../domain/repositories/family.repository.interface';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

@Injectable()
export class DrizzleFamilyRepository implements IFamilyRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  async create(family: FamilyEntity): Promise<FamilyEntity> {
    const [row] = await this.db.insert(families).values({
      id: family.id,
      name: family.name,
      code: family.code,
      createdAt: family.createdAt,
      updatedAt: family.updatedAt,
    }).returning();
    return this.toFamilyEntity(row);
  }

  async findById(id: string): Promise<FamilyEntity | null> {
    const [row] = await this.db.select().from(families).where(eq(families.id, id));
    return row ? this.toFamilyEntity(row) : null;
  }

  async findByCode(code: string): Promise<FamilyEntity | null> {
    const [row] = await this.db.select().from(families).where(eq(families.code, code));
    return row ? this.toFamilyEntity(row) : null;
  }

  async update(family: FamilyEntity): Promise<FamilyEntity> {
    const [row] = await this.db.update(families)
      .set({ name: family.name, updatedAt: family.updatedAt })
      .where(eq(families.id, family.id))
      .returning();
    return this.toFamilyEntity(row);
  }

  async addMember(member: MemberEntity): Promise<MemberEntity> {
    const [row] = await this.db.insert(users).values({
      id: member.id,
      telegramId: member.telegramId,
      name: member.name,
      role: member.role as any,
      lang: member.lang as any,
      familyId: member.familyId,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
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
      .set({ name: member.name, role: member.role as any, lang: member.lang as any, updatedAt: member.updatedAt })
      .where(eq(users.id, member.id))
      .returning();
    return this.toMemberEntity(row);
  }

  async removeMember(memberId: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, memberId));
  }

  async findFamilyByTelegramId(telegramId: string): Promise<FamilyEntity | null> {
    const [row] = await this.db.select({ family: families })
      .from(users)
      .innerJoin(families, eq(users.familyId, families.id))
      .where(eq(users.telegramId, telegramId));
    return row ? this.toFamilyEntity(row.family as any) : null;
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
