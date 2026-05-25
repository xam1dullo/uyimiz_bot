import { Module } from '@nestjs/common';
import { CreateFamilyHandler } from './application/commands/create-family/create-family.handler';
import { JoinFamilyHandler } from './application/commands/join-family/join-family.handler';
import { GetFamilyHandler } from './application/queries/get-family/get-family.handler';
import { IFamilyRepository } from './domain/repositories/family.repository.interface';
import { DrizzleFamilyRepository } from './infrastructure/repositories/drizzle-family.repository';
import { FamilyBotUpdate } from './presentation/bot/family.update';
import { FamilyController } from './presentation/http/family.controller';
import { FamilyMembersController } from './presentation/http/family-members.controller';
import { InviteController } from './presentation/http/invite.controller';

export const FAMILY_REPO = Symbol('IFamilyRepository');

@Module({
  controllers: [FamilyController, FamilyMembersController, InviteController],
  providers: [
    CreateFamilyHandler,
    JoinFamilyHandler,
    GetFamilyHandler,
    { provide: FAMILY_REPO, useClass: DrizzleFamilyRepository },
    { provide: IFamilyRepository, useExisting: FAMILY_REPO },
    FamilyBotUpdate,
  ],
  exports: [IFamilyRepository, FAMILY_REPO, CreateFamilyHandler, JoinFamilyHandler],
})
export class FamilyModule {}
