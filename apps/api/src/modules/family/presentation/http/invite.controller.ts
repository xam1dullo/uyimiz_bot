import { Controller, Post, Body, Inject } from '@nestjs/common';
import { type DB, inviteCodes } from '@uyimiz/db';
import { nanoid } from 'nanoid';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';
import { eq } from 'drizzle-orm';

@Controller('api/invites')
export class InviteController {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  @Post('generate')
  async generate(@Body() body: { familyId: string; createdBy: string }) {
    const code = nanoid(8).toUpperCase();
    await this.db.insert(inviteCodes).values({
      familyId: body.familyId,
      code,
      createdBy: body.createdBy,
    });
    return { code };
  }

  @Post('validate')
  async validate(@Body() body: { code: string }) {
    const [row] = await this.db.select()
      .from(inviteCodes)
      .where(eq(inviteCodes.code, body.code.toUpperCase()));

    if (!row || row.isUsed) {
      return { valid: false, message: 'Invalid or used code' };
    }
    if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
      return { valid: false, message: 'Code expired' };
    }

    return { valid: true, familyId: row.familyId };
  }
}
