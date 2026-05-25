import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../services/jwt.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly jwt: JwtService) {}

  @Post('token')
  async getToken(@Body() body: { telegramId: string; familyId?: string; role?: string }) {
    const token = this.jwt.sign({
      sub: body.telegramId,
      telegramId: body.telegramId,
      familyId: body.familyId,
      role: body.role ?? 'parent',
    });
    const refreshToken = this.jwt.signRefresh({
      sub: body.telegramId,
      telegramId: body.telegramId,
      familyId: body.familyId,
      role: body.role ?? 'parent',
    });

    return {
      accessToken: token,
      refreshToken,
      expiresIn: 15 * 60,
    };
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const payload = this.jwt.verify(body.refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const token = this.jwt.sign({
      sub: payload.sub,
      telegramId: payload.telegramId,
      familyId: payload.familyId,
      role: payload.role,
    });

    return { accessToken: token, expiresIn: 15 * 60 };
  }

  @Post('verify')
  async verify(@Body() body: { token: string }) {
    const payload = this.jwt.verify(body.token);
    return { valid: !!payload, user: payload };
  }
}
