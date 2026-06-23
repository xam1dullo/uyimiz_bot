import { Injectable, Inject } from '@nestjs/common';
import { DB_TOKEN } from '../../../../../infrastructure/database/database.module';
import { DB, users } from '@uyimiz/db';
import { eq } from 'drizzle-orm';
import { JwtService } from '../../../services/jwt.service';

export interface LoginCommand {
  telegramId: string;
  name?: string;
  username?: string;
}

@Injectable()
export class LoginHandler {
  constructor(
    @Inject(DB_TOKEN) private readonly db: DB,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand) {
    let [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.telegramId, command.telegramId));

    if (!user) {
      const [newUser] = await this.db
        .insert(users)
        .values({
          telegramId: command.telegramId,
          name: command.name || 'User',
          username: command.username,
        })
        .returning();
      user = newUser;
    }

    let familyStatus = 'NO_FAMILY';
    if (user.familyId) {
      familyStatus = 'IN_FAMILY';
    }

    const tokenPayload = {
      sub: user.telegramId,
      telegramId: user.telegramId,
      familyId: user.familyId ?? undefined,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(tokenPayload);

    return {
      accessToken,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        name: user.name,
        role: user.role,
      },
      familyStatus,
      familyId: user.familyId,
    };
  }
}
