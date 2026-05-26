import { FAMILY_REPO } from './family.tokens';
import { Module } from '@nestjs/common';
import { CreateFamilyHandler } from './application/commands/create-family/create-family.handler';
import { JoinFamilyHandler } from './application/commands/join-family/join-family.handler';
import { GenerateInviteHandler } from './application/commands/generate-invite/generate-invite.handler';
import { GetFamilyHandler } from './application/queries/get-family/get-family.handler';
import { IFamilyRepository } from './domain/repositories/family.repository.interface';
import { DrizzleFamilyRepository } from './infrastructure/repositories/drizzle-family.repository';
import { FamilyBotUpdate } from './presentation/bot/family.update';
import { FamilyController } from './presentation/http/family.controller';
import { FamilyMembersController } from './presentation/http/family-members.controller';
import { InviteController } from './presentation/http/invite.controller';


@Module({
  controllers: [FamilyController, FamilyMembersController, InviteController],
  providers: [
    CreateFamilyHandler,
    JoinFamilyHandler,
    GenerateInviteHandler,
    GetFamilyHandler,
    { provide: FAMILY_REPO, useClass: DrizzleFamilyRepository },
    FamilyBotUpdate,
  ],
  exports: [FAMILY_REPO, CreateFamilyHandler, JoinFamilyHandler],
})
export class FamilyModule {}
