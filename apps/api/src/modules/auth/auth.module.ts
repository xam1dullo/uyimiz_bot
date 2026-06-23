import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { JwtService } from './services/jwt.service';
import { AuthController } from './controllers/auth.controller';
import { LoginHandler } from './application/commands/login/login.handler';

@Global()
@Module({
  controllers: [AuthController],
  providers: [JwtService, LoginHandler],
  exports: [JwtService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
