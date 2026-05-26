import { Module } from '@nestjs/common';
import { OnboardingWizard } from './onboarding.wizard';
import { FamilyModule } from '../family/family.module';
import { I18nModule } from '../../infrastructure/i18n/i18n.module';

@Module({
  imports: [FamilyModule, I18nModule],
  providers: [OnboardingWizard],
  exports: [OnboardingWizard],
})
export class OnboardingModule {}
