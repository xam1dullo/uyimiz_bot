import { Injectable, Inject, Logger } from '@nestjs/common';
import { type DB, inviteCodes } from '@uyimiz/db';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

@Injectable()
export class InviteSystem {
  private readonly logger = new Logger(InviteSystem.name);

  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  async generateCode(familyId: string, createdBy: string): Promise<string> {
    const code = nanoid(8).toUpperCase();
    await this.db.insert(inviteCodes).values({
      familyId,
      code,
      createdBy,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return code;
  }

  async validateCode(code: string): Promise<string | null> {
    const [row] = await this.db.select()
      .from(inviteCodes)
      .where(
        and(
          eq(inviteCodes.code, code),
          eq(inviteCodes.isUsed, false),
        ),
      );
    if (!row) return null;
    if (row.expiresAt && new Date(row.expiresAt) < new Date()) return null;

    await this.db.update(inviteCodes)
      .set({ isUsed: true })
      .where(eq(inviteCodes.id, row.id));

    return row.familyId;
  }
}
